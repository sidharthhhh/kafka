import { Kafka } from 'kafkajs';
import { config } from '../config/env.js';
import { logger } from '../utils/logger.js';
import { Event } from '../models/Event.js';
import { metricsEngine } from './metrics.js';
import { broadcastMetrics } from './websocket.js';

class KafkaConsumer {
    constructor() {
        this.kafka = new Kafka({
            clientId: config.kafka.clientId,
            brokers: config.kafka.brokers,
        });

        this.consumer = this.kafka.consumer({
            groupId: config.kafka.consumerGroup,
            sessionTimeout: 30000,
            heartbeatInterval: 3000,
        });

        this.dlqProducer = this.kafka.producer();
        this.isRunning = false;
    }

    async connect() {
        try {
            await this.consumer.connect();
            await this.dlqProducer.connect();
            logger.info('Kafka Consumer connected');
        } catch (error) {
            logger.error(`Kafka Consumer connection error: ${error.message}`);
            throw error;
        }
    }

    async start() {
        await this.consumer.subscribe({
            topic: config.kafka.topic,
            fromBeginning: false,
        });

        this.isRunning = true;

        await this.consumer.run({
            autoCommit: false, // Manual offset commit
            eachMessage: async ({ topic, partition, message }) => {
                try {
                    const event = JSON.parse(message.value.toString());

                    logger.debug(`Processing event: ${event.event}`, {
                        partition,
                        offset: message.offset,
                        sessionId: event.sessionId,
                    });

                    // Save to database
                    await this.saveEvent(event);

                    // Update metrics
                    await metricsEngine.processEvent(event);

                    // Broadcast updated metrics via WebSocket
                    const metrics = await metricsEngine.getMetrics();
                    broadcastMetrics(metrics);

                    // Manually commit offset after successful processing
                    await this.consumer.commitOffsets([
                        {
                            topic,
                            partition,
                            offset: (parseInt(message.offset) + 1).toString(),
                        },
                    ]);

                    logger.debug(`Event processed successfully`, {
                        offset: message.offset,
                    });
                } catch (error) {
                    logger.error(`Error processing message: ${error.message}`, {
                        offset: message.offset,
                        partition,
                    });

                    // Send to Dead Letter Queue
                    await this.sendToDLQ(message, error);
                }
            },
        });
    }

    async saveEvent(event) {
        try {
            const newEvent = new Event(event);
            await newEvent.save();
            logger.debug(`Event saved to DB: ${event.event}`);
        } catch (error) {
            logger.error(`Failed to save event to DB: ${error.message}`);
            throw error;
        }
    }

    async sendToDLQ(message, error) {
        try {
            await this.dlqProducer.send({
                topic: config.kafka.dlqTopic,
                messages: [
                    {
                        key: message.key,
                        value: message.value,
                        headers: {
                            originalTopic: config.kafka.topic,
                            errorMessage: error.message,
                            errorTimestamp: Date.now().toString(),
                        },
                    },
                ],
            });
            logger.info(`Message sent to DLQ: ${message.offset}`);
        } catch (dlqError) {
            logger.error(`Failed to send to DLQ: ${dlqError.message}`);
        }
    }

    async disconnect() {
        if (this.isRunning) {
            await this.consumer.disconnect();
            await this.dlqProducer.disconnect();
            this.isRunning = false;
            logger.info('Kafka Consumer disconnected');
        }
    }
}

export const kafkaConsumer = new KafkaConsumer();

// Graceful shutdown
process.on('SIGINT', async () => {
    await kafkaConsumer.disconnect();
    process.exit(0);
});
