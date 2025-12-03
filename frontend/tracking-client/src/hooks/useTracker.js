import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Generate or retrieve sessionId
const getSessionId = () => {
    let sessionId = sessionStorage.getItem('sessionId');
    if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        sessionStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
};

const useTracker = () => {
    const sessionId = getSessionId();

    const trackEvent = async (event, page) => {
        try {
            const payload = {
                event,
                page: page || window.location.pathname,
                sessionId,
                userAgent: navigator.userAgent,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                timestamp: Date.now(),
                referrer: document.referrer || '',
            };

            await fetch(`${API_URL}/track`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            console.log(`✅ Tracked: ${event} on ${page}`);
        } catch (error) {
            console.error('Failed to track event:', error);
        }
    };

    useEffect(() => {
        // Track session start
        trackEvent('session_start', '/');

        // Track page view
        trackEvent('page_view', '/');

        // Track session end on page unload
        const handleUnload = () => {
            trackEvent('session_end', '/');
        };

        window.addEventListener('beforeunload', handleUnload);

        return () => {
            window.removeEventListener('beforeunload', handleUnload);
        };
    }, []);

    return { trackEvent };
};

export default useTracker;
