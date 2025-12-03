import { connectDB } from './config/db.js';
import { kafkaConsumer } from './services/kafka-consumer.js';
import { logger } from './utils/logger.js';

const startConsumer = async () => {
    try {
        // Connect to MongoDB
        await connectDB();

        // Connect and start Kafka Consumer
        await kafkaConsumer.connect();
        await kafkaConsumer.start();

        logger.info('Consumer service started successfully');
    } catch (error) {
        logger.error(`Failed to start consumer: ${error.message}`);
        process.exit(1);
    }
};

startConsumer();
