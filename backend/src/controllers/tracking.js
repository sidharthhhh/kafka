import { validateTrackingEvent } from '../utils/validation.js';
import { kafkaProducer } from '../services/kafka-producer.js';
import { logger } from '../utils/logger.js';

export const trackEvent = async (req, res) => {
    try {
        // Get IP address
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        // Validate request body
        const validation = validateTrackingEvent({
            ...req.body,
            ip,
        });

        if (!validation.success) {
            return res.status(400).json({
                success: false,
                errors: validation.error,
            });
        }

        // Send to Kafka
        await kafkaProducer.sendEvent(validation.data);

        logger.info(`Event tracked: ${validation.data.event}`, {
            sessionId: validation.data.sessionId,
            page: validation.data.page,
        });

        res.status(200).json({
            success: true,
            message: 'Event tracked successfully',
        });
    } catch (error) {
        logger.error(`Track event error: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Failed to track event',
        });
    }
};

export const getHealth = (req, res) => {
    res.status(200).json({
        success: true,
        status: 'healthy',
        timestamp: Date.now(),
    });
};
