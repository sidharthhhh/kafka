import { Kafka } from 'kafkajs';
import { config } from '../config/env.js';
import { logger } from '../utils/logger.js';

class KafkaProducer {
    constructor() {
        this.kafka = new Kafka({
            clientId: config.kafka.clientId,
            brokers: config.kafka.brokers,
        });

        this.producer = this.kafka.producer({
            allowAutoTopicCreation: true,
            transactionTimeout: 30000,
        });

        this.isConnected = false;
    }

    async connect() {
        try {
            await this.producer.connect();
            this.isConnected = true;
            logger.info('Kafka Producer connected');
        } catch (error) {
            logger.error(`Kafka Producer connection error: ${error.message}`);
            throw error;
        }
    }

    async sendEvent(event) {
        if (!this.isConnected) {
            throw new Error('Kafka Producer is not connected');
        }

        try {
            const message = {
                key: event.sessionId, // Partition by sessionId for ordering
                value: JSON.stringify(event),
                timestamp: Date.now().toString(),
            };

            const result = await this.producer.send({
                topic: config.kafka.topic,
                messages: [message],
                acks: -1, // Wait for all replicas
                timeout: 30000,
                compression: 1, // GZIP compression
            });

            logger.debug(`Event sent to Kafka: ${event.event}`, {
                partition: result[0].partition,
                offset: result[0].offset,
            });

            return result;
        } catch (error) {
            logger.error(`Failed to send event to Kafka: ${error.message}`, {
                event: event.event,
                sessionId: event.sessionId,
            });
            throw error;
        }
    }

    async disconnect() {
        if (this.isConnected) {
            await this.producer.disconnect();
            this.isConnected = false;
            logger.info('Kafka Producer disconnected');
        }
    }
}

export const kafkaProducer = new KafkaProducer();

// Graceful shutdown
process.on('SIGINT', async () => {
    await kafkaProducer.disconnect();
    process.exit(0);
});
