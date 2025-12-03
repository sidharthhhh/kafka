import { Server } from 'socket.io';
import { createServer } from 'http';
import { config } from '../config/env.js';
import { logger } from '../utils/logger.js';

let io;
let httpServer;

export const initWebSocket = (app) => {
    httpServer = createServer(app);

    io = new Server(httpServer, {
        cors: {
            origin: '*', // Configure appropriately for production
            methods: ['GET', 'POST'],
        },
    });

    io.on('connection', (socket) => {
        logger.info(`WebSocket client connected: ${socket.id}`);

        socket.on('disconnect', () => {
            logger.info(`WebSocket client disconnected: ${socket.id}`);
        });

        socket.on('authenticate', (token) => {
            if (token === config.auth.dashboardToken) {
                socket.data.authenticated = true;
                socket.emit('authenticated', { success: true });
                logger.info(`Client authenticated: ${socket.id}`);
            } else {
                socket.emit('authenticated', { success: false });
                socket.disconnect();
            }
        });
    });

    return httpServer;
};

export const broadcastMetrics = (metrics) => {
    if (io) {
        io.emit('metrics:update', metrics);
        logger.debug('Metrics broadcasted to all clients');
    }
};

export const getIO = () => io;
