import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
const DASHBOARD_TOKEN = 'admin123';

const useWebSocket = () => {
    const [socket, setSocket] = useState(null);
    const [metrics, setMetrics] = useState({
        activeUsers: 0,
        pageViewsLastMinute: 0,
        topPages: [],
        deviceStats: {},
        uniqueVisitorsToday: 0,
        recentEvents: [],
    });
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        const newSocket = io(SOCKET_URL);

        newSocket.on('connect', () => {
            console.log('✅ WebSocket connected');
            setConnected(true);
            newSocket.emit('authenticate', DASHBOARD_TOKEN);
        });

        newSocket.on('authenticated', (data) => {
            if (data.success) {
                console.log('✅ Authenticated');
            } else {
                console.error('❌ Authentication failed');
            }
        });

        newSocket.on('metrics:update', (data) => {
            console.log('📊 Metrics update:', data);
            setMetrics(data);
        });

        newSocket.on('disconnect', () => {
            console.log('❌ WebSocket disconnected');
            setConnected(false);
        });

        setSocket(newSocket);

        return () => {
            newSocket.close();
        };
    }, []);

    return { socket, metrics, connected };
};

export default useWebSocket;
