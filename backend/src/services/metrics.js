import { Event } from '../models/Event.js';
import { logger } from '../utils/logger.js';

class MetricsEngine {
    constructor() {
        this.metrics = {
            activeUsers: 0,
            pageViewsLastMinute: 0,
            topPages: [],
            deviceStats: {},
            uniqueVisitorsToday: 0,
            recentEvents: [],
            pageViewsHistory: [],
        };
    }

    async processEvent(event) {
        // Add to recent events
        this.metrics.recentEvents.unshift({
            event: event.event,
            page: event.page,
            timestamp: event.timestamp,
            sessionId: event.sessionId,
        });

        // Keep only last 50 events
        if (this.metrics.recentEvents.length > 50) {
            this.metrics.recentEvents = this.metrics.recentEvents.slice(0, 50);
        }
    }

    async getMetrics() {
        try {
            const now = Date.now();
            const oneMinuteAgo = now - 60 * 1000;
            const oneDayAgo = now - 24 * 60 * 60 * 1000;
            const thirtyMinutesAgo = now - 30 * 60 * 1000;

            // Page views in last minute
            this.metrics.pageViewsLastMinute = await Event.countDocuments({
                event: 'page_view',
                timestamp: { $gte: oneMinuteAgo },
            });

            // Active users (unique sessions in last 5 minutes)
            const fiveMinutesAgo = now - 5 * 60 * 1000;
            const activeSessions = await Event.distinct('sessionId', {
                timestamp: { $gte: fiveMinutesAgo },
            });
            this.metrics.activeUsers = activeSessions.length;

            // Unique visitors today
            const uniqueSessionsToday = await Event.distinct('sessionId', {
                timestamp: { $gte: oneDayAgo },
            });
            this.metrics.uniqueVisitorsToday = uniqueSessionsToday.length;

            // Top pages
            const topPages = await Event.aggregate([
                {
                    $match: {
                        event: 'page_view',
                        timestamp: { $gte: oneDayAgo },
                    },
                },
                {
                    $group: {
                        _id: '$page',
                        count: { $sum: 1 },
                    },
                },
                {
                    $sort: { count: -1 },
                },
                {
                    $limit: 10,
                },
            ]);

            this.metrics.topPages = topPages.map((p) => ({
                page: p._id,
                views: p.count,
            }));

            // Page Views History (Last 30 minutes)
            const history = await Event.aggregate([
                {
                    $match: {
                        event: 'page_view',
                        timestamp: { $gte: thirtyMinutesAgo },
                    },
                },
                {
                    $project: {
                        // Round down to nearest minute
                        minute: {
                            $subtract: [
                                '$timestamp',
                                { $mod: ['$timestamp', 60 * 1000] }
                            ]
                        }
                    }
                },
                {
                    $group: {
                        _id: '$minute',
                        count: { $sum: 1 },
                    },
                },
                {
                    $sort: { _id: 1 },
                },
            ]);

            // Fill in gaps with 0
            const filledHistory = [];
            for (let i = 29; i >= 0; i--) {
                const time = now - i * 60 * 1000;
                const minuteTimestamp = time - (time % (60 * 1000));

                const found = history.find(h => h._id === minuteTimestamp);
                const date = new Date(minuteTimestamp);
                const timeLabel = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

                filledHistory.push({
                    time: timeLabel,
                    views: found ? found.count : 0
                });
            }
            this.metrics.pageViewsHistory = filledHistory;

            // Device stats (parsed from userAgent)
            const deviceStats = await Event.aggregate([
                {
                    $match: {
                        timestamp: { $gte: oneDayAgo },
                    },
                },
                {
                    $group: {
                        _id: {
                            $cond: [
                                { $regexMatch: { input: '$userAgent', regex: /mobile/i } },
                                'Mobile',
                                {
                                    $cond: [
                                        { $regexMatch: { input: '$userAgent', regex: /tablet/i } },
                                        'Tablet',
                                        'Desktop',
                                    ],
                                },
                            ],
                        },
                        count: { $sum: 1 },
                    },
                },
            ]);

            this.metrics.deviceStats = deviceStats.reduce((acc, item) => {
                acc[item._id] = item.count;
                return acc;
            }, {});

            logger.debug('Metrics updated', this.metrics);
            return this.metrics;
        } catch (error) {
            logger.error(`Failed to calculate metrics: ${error.message}`);
            return this.metrics;
        }
    }
}

export const metricsEngine = new MetricsEngine();
