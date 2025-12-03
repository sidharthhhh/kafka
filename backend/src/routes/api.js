import express from 'express';
import { trackEvent, getHealth } from '../controllers/tracking.js';
import rateLimit from 'express-rate-limit';
import { config } from '../config/env.js';

const router = express.Router();

// Rate limiter
const limiter = rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.max,
    message: 'Too many requests from this IP, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
});

// Routes
router.post('/track', limiter, trackEvent);
router.get('/health', getHealth);

export default router;
