import { z } from 'zod';

export const trackEventSchema = z.object({
    event: z.enum(['page_view', 'click', 'session_start', 'session_end']),
    page: z.string().url().or(z.string().min(1)),
    sessionId: z.string().min(1),
    userId: z.string().optional(),
    referrer: z.string().optional(),
    userAgent: z.string().min(1),
    timezone: z.string().optional(),
    timestamp: z.number().int().positive(),
});

export const validateTrackingEvent = (data) => {
    try {
        return {
            success: true,
            data: trackEventSchema.parse(data),
        };
    } catch (error) {
        return {
            success: false,
            error: error.errors,
        };
    }
};
