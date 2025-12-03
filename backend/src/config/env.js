import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  kafka: {
    brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
    topic: process.env.KAFKA_TOPIC || 'web-activity',
    dlqTopic: process.env.KAFKA_DLQ_TOPIC || 'web-activity-dlq',
    clientId: process.env.KAFKA_CLIENT_ID || 'visitor-tracker',
    consumerGroup: process.env.KAFKA_CONSUMER_GROUP || 'tracker-consumer-group',
  },
  
  mongo: {
    uri: process.env.MONGO_URI || 'mongodb://localhost:27017/visitor_tracking',
  },
  
  auth: {
    dashboardToken: process.env.DASHBOARD_TOKEN || 'admin123',
  },
  
  websocket: {
    port: process.env.WEBSOCKET_PORT || 5001,
  },
  
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000'),
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '200'),
  },
};
