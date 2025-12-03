# 🚀 Real-Time Website Visitor Tracking System

A complete microservice-based **Real-Time Website Visitor Tracking System** built with **Node.js**, **Apache Kafka**, **MongoDB**, and **React**. This system demonstrates event-driven architecture, real-time analytics, and scalable microservices design.

![Architecture](https://img.shields.io/badge/Architecture-Microservices-blue)
![Tech](https://img.shields.io/badge/Tech-Kafka%20%7C%20Node.js%20%7C%20React-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 📋 Table of Contents
- [Architecture Overview](#-architecture-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Running the System](#-running-the-system)
- [API Documentation](#-api-documentation)
- [Kafka Concepts Explained](#-kafka-concepts-explained)
- [Project Structure](#-project-structure)
- [Screenshots](#-screenshots)

---

## 🏗️ Architecture Overview

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Browser   │─────▶│  Backend    │─────▶│   Kafka     │─────▶│  Consumer   │
│  (Tracker)  │      │     API     │      │   Topic     │      │   Service   │
└─────────────┘      └─────────────┘      └─────────────┘      └─────────────┘
                            │                                          │
                            │                                          ▼
                            │                                   ┌─────────────┐
                            │                                   │   MongoDB   │
                            │                                   └─────────────┘
                            │                                          │
                            ▼                                          ▼
                     ┌─────────────┐                          ┌─────────────┐
                     │  WebSocket  │◀─────────────────────────│   Metrics   │
                     │   Server    │                          │   Engine    │
                     └─────────────┘                          └─────────────┘
                            │
                            ▼
                     ┌─────────────┐
                     │    React    │
                     │  Dashboard  │
                     └─────────────┘
```

### Request Flow
1. **Client** sends tracking events via HTTP POST
2. **Backend API** validates and produces message to **Kafka Topic**
3. **Kafka** stores and distributes events across partitions
4. **Consumer Service** processes events and writes to **MongoDB**
5. **Metrics Engine** aggregates real-time analytics
6. **WebSocket Server** broadcasts updates to **Dashboard**

---

## ✨ Features

### Backend
- ✅ **Event Tracking API** with validation and rate limiting
- ✅ **Kafka Producer** with acks=all, retry, and batching
- ✅ **Kafka Consumer** with manual offset commit and DLQ
- ✅ **MongoDB Integration** for event storage
- ✅ **Real-time Metrics Engine** for analytics aggregation
- ✅ **WebSocket Server** for live updates
- ✅ **Comprehensive Logging** with Winston
- ✅ **Security** with Helmet, CORS, and input validation

### Frontend
- ✅ **Tracking Client** - Interactive demo website
- ✅ **Admin Dashboard** - Real-time analytics visualization
- ✅ **Live Charts** - Page views, top pages, device stats
- ✅ **WebSocket Integration** - Real-time data updates
- ✅ **Beautiful UI** with Tailwind CSS and glassmorphism

---

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Message Broker**: Apache Kafka
- **Database**: MongoDB
- **Real-time**: Socket.IO
- **Validation**: Zod
- **Logging**: Winston

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **WebSocket**: Socket.IO Client

### Infrastructure
- **Containerization**: Docker, Docker Compose
- **Zookeeper**: Kafka coordination

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Docker Desktop** - [Download](https://www.docker.com/products/docker-desktop/)
- **Git** (optional)

---

## 🚀 Installation

### 1. Clone or Navigate to the Project
```bash
cd c:\Users\Sidharth\Desktop\kafka
```

### 2. Install Backend Dependencies
```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

**Tracking Client:**
```bash
cd frontend/tracking-client
npm install
```

**Admin Dashboard:**
```bash
cd frontend/admin-dashboard
npm install
```

### 4. Configure Environment Variables

Copy the example environment file:
```bash
cd backend
cp .env.example .env
```

The default values should work for local development.

---

## ▶️ Running the System

### Step 1: Start Kafka Infrastructure

Start Kafka, Zookeeper, and MongoDB using Docker Compose:

```bash
# From project root
docker-compose up -d
```

This will start:
- **Zookeeper** on port 2181
- **Kafka** on port 9092
- **MongoDB** on port 27017

Verify containers are running:
```bash
docker-compose ps
```

### Step 2: Start Backend Services

**Terminal 1 - API Server:**
```bash
cd backend
npm run dev
```
Server runs on `http://localhost:5000`

**Terminal 2 - Consumer Service:**
```bash
cd backend
npm run dev:consumer
```

### Step 3: Start Frontend Applications

**Terminal 3 - Tracking Client:**
```bash
cd frontend/tracking-client
npm run dev
```
App runs on `http://localhost:5173`

**Terminal 4 - Admin Dashboard:**
```bash
cd frontend/admin-dashboard
npm run dev
```
Dashboard runs on `http://localhost:5174`

---

## 🎯 Usage

1. **Open Tracking Client** at `http://localhost:5173`
   - Click buttons to generate tracking events

2. **Open Admin Dashboard** at `http://localhost:5174`
   - Watch real-time analytics update live
   - View charts, metrics, and event feed

3. **Monitor Logs**
   - Backend logs show Kafka producer activity
   - Consumer logs show event processing
   - Dashboard shows WebSocket connection status

---

## 📡 API Documentation

### POST `/api/track`

Track user events.

**Request Body:**
```json
{
  "event": "page_view",
  "page": "/home",
  "sessionId": "session_123",
  "userId": "user_456",
  "userAgent": "Mozilla/5.0...",
  "timezone": "Asia/Kolkata",
  "timestamp": 1701234567890
}
```

**Event Types:**
- `page_view` - Page navigation
- `click` - Button/link clicks
- `session_start` - Session initialization
- `session_end` - Session termination

**Response:**
```json
{
  "success": true,
  "message": "Event tracked successfully"
}
```

### GET `/api/health`

Health check endpoint.

**Response:**
```json
{
  "success": true,
  "status": "healthy",
  "timestamp": 1701234567890
}
```

---

## 📚 Kafka Concepts Explained

### Why Kafka Instead of RabbitMQ?

| Feature | Kafka | RabbitMQ |
|---------|-------|----------|
| **Throughput** | Very High (millions/sec) | Moderate |
| **Persistence** | Yes (log-based) | Optional |
| **Partitioning** | Built-in | No |
| **Consumer Groups** | Yes | No |
| **Use Case** | Event streaming, Analytics | Task queues, RPC |

**Kafka** is ideal for:
- High-throughput event streaming
- Durable message storage
- Multiple consumers reading same data
- Real-time analytics pipelines

### Partitions & Replication

**Partitions**: 
- Topics are divided into partitions for parallelism
- Each partition is an ordered, immutable log
- Messages with same key go to same partition (ordering guarantee)

**Replication Factor**:
- Number of copies of each partition
- Ensures fault tolerance
- `replication-factor=1` for local dev (no redundancy)
- Production: typically 3

### Consumer Groups & Horizontal Scaling

**Consumer Group**:
- Multiple consumers work as a team
- Each partition assigned to ONE consumer in group
- Enables parallel processing

**Scaling Example**:
```
Topic: 3 partitions
Consumer Group A: 3 consumers → Each consumer reads 1 partition
Consumer Group B: 2 consumers → Consumer 1 reads 2 partitions, Consumer 2 reads 1
```

### Offset Management

**Offset**: Position in partition log

**Manual Commit** (used in this project):
```javascript
await consumer.commitOffsets([{
  topic: 'web-activity',
  partition: 0,
  offset: '123'
}]);
```

**Benefits**:
- Process message → Write to DB → Commit offset
- Prevents data loss on failure
- Enables exactly-once semantics

### Topic Retention

**Log Retention** (used here):
- Keep messages for time period (7 days)
- Disk-based storage
- Great for event streaming

**Compacted Topics**:
- Keep only latest value per key
- Good for state snapshots (e.g., user profiles)

---

## 📁 Project Structure

```
kafka/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js              # MongoDB connection
│   │   │   └── env.js             # Environment config
│   │   ├── controllers/
│   │   │   └── tracking.js        # API controllers
│   │   ├── models/
│   │   │   └── Event.js           # Mongoose schema
│   │   ├── routes/
│   │   │   └── api.js             # Express routes
│   │   ├── services/
│   │   │   ├── kafka-producer.js  # Kafka producer
│   │   │   ├── kafka-consumer.js  # Kafka consumer
│   │   │   ├── metrics.js         # Metrics aggregation
│   │   │   └── websocket.js       # Socket.IO server
│   │   ├── utils/
│   │   │   ├── logger.js          # Winston logger
│   │   │   └── validation.js      # Zod schemas
│   │   ├── server.js              # API entry point
│   │   └── consumer.js            # Consumer entry point
│   ├── .env.example
│   ├── package.json
│   └── Dockerfile (optional)
│
├── frontend/
│   ├── tracking-client/
│   │   ├── src/
│   │   │   ├── hooks/
│   │   │   │   └── useTracker.js
│   │   │   ├── App.jsx
│   │   │   └── index.css
│   │   ├── package.json
│   │   └── tailwind.config.js
│   │
│   └── admin-dashboard/
│       ├── src/
│       │   ├── components/
│       │   │   ├── MetricCard.jsx
│       │   │   ├── PageViewsChart.jsx
│       │   │   ├── TopPagesChart.jsx
│       │   │   ├── DeviceStatsChart.jsx
│       │   │   └── LiveEventsTable.jsx
│       │   ├── hooks/
│       │   │   └── useWebSocket.js
│       │   ├── App.jsx
│       │   └── index.css
│       ├── package.json
│       └── tailwind.config.js
│
└── docker-compose.yml
```

---

## 🎨 Screenshots

### Tracking Client
Beautiful gradient UI with interactive buttons that send tracking events.

### Admin Dashboard
Real-time analytics with:
- Active users counter
- Page views chart
- Top pages bar chart
- Device distribution pie chart
- Live event feed

---

## 🔒 Security Best Practices

- ✅ **Helmet.js** - Security headers
- ✅ **CORS** - Cross-origin protection
- ✅ **Rate Limiting** - Prevent abuse (200 req/min)
- ✅ **Input Validation** - Zod schema validation
- ✅ **Token Authentication** - Dashboard access control
- ✅ **Environment Variables** - Sensitive data protection

---

## 🚢 Production Deployment

### Docker (Optional)

Build backend image:
```bash
cd backend
docker build -t visitor-tracker-backend .
```

### Kubernetes (Optional)

See `k8s/` directory for deployment manifests (not included in this version).

---

## 🧪 Testing

Run the system and verify:

1. ✅ Kafka producer sends events
2. ✅ Consumer processes and stores in MongoDB
3. ✅ Metrics update in real-time
4. ✅ WebSocket broadcasts to dashboard
5. ✅ UI reflects changes instantly

---

## 📖 Kafka Learning Resources

- [Kafka Introduction](https://kafka.apache.org/intro)
- [KafkaJS Documentation](https://kafka.js.org/)
- [When to use Kafka vs RabbitMQ](https://www.cloudamqp.com/blog/when-to-use-rabbitmq-or-apache-kafka.html)

---

## 🤝 Contributing

Contributions welcome! Please open an issue or submit a pull request.

---

## 📄 License

MIT License - feel free to use this project for learning and commercial purposes.

---

## 🙏 Acknowledgments

Built with modern web technologies and best practices in microservices architecture.

**Happy Tracking! 🎉**
