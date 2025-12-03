import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config/env.js';
import { logger } from './utils/logger.js';
import { connectDB } from './config/db.js';
import { kafkaProducer } from './services/kafka-producer.js';
import { initWebSocket } from './services/websocket.js';
import apiRoutes from './routes/api.js';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('combined', {
    stream: {
        write: (message) => logger.info(message.trim()),
    },
}));

// Routes
app.use('/api', apiRoutes);

// Error handler
app.use((err, req, res, next) => {
    logger.error(`Unhandled error: ${err.message}`);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
    });
});

// Initialize services
const startServer = async () => {
    try {
        // Connect to MongoDB
        await connectDB();

        // Connect Kafka Producer
        await kafkaProducer.connect();

        // Initialize WebSocket on separate port
        const httpServer = initWebSocket(app);

        // Start Kafka Consumer in the same process
        const { kafkaConsumer } = await import('./services/kafka-consumer.js');
        await kafkaConsumer.connect();
        await kafkaConsumer.start();
        logger.info('Kafka Consumer started');

        // Start API server on port 5000
        app.listen(config.port, () => {
            logger.info(`Server running on port ${config.port}`);
        });

        // Start WebSocket server on port 5001
        const websocketPort = config.websocket.port || 5001;
        httpServer.listen(websocketPort, () => {
            logger.info(`WebSocket server ready on port ${websocketPort}`);
        });
    } catch (error) {
        logger.error(`Failed to start server: ${error.message}`);
        process.exit(1);
    }
};

startServer();
