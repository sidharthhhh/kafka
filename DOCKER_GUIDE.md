# 🐳 Docker Deployment Guide

## Quick Start

All services run in Docker containers on the same network. No local Node.js installation needed!

### 1. Start All Services

```bash
docker-compose up -d
```

This starts:
- ✅ **Zookeeper** (Kafka coordination)
- ✅ **Kafka** (Message broker on port 9092)
- ✅ **MongoDB** (Database on port 27017)
- ✅ **Backend API** (REST API on port 5000)
- ✅ **Consumer Service** (Event processor)
- ✅ **Tracking Client** (port 3000)
- ✅ **Admin Dashboard** (port 3001)

### 2. Access the Applications

- **Tracking Client**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3001
- **Backend API**: http://localhost:5000/api/health

### 3. View Logs

```bash
# View all logs
docker-compose logs -f

# View specific service
docker logs backend-api -f
docker logs consumer-service -f
```

### 4. Check Status

```bash
docker-compose ps
```

### 5. Stop All Services

```bash
docker-compose down
```

### 6. Rebuild After Changes

```bash
docker-compose up --build -d
```

## Network Architecture

All containers communicate on the **tracking-network** bridge network:

- Backend API → `kafka:29092` (internal Kafka address)
- Consumer → `mongodb:27017` (internal MongoDB address)
- Frontend → `localhost:5000` (exposed API port)

## Troubleshooting

### Port Conflicts
If ports are in use, modify `docker-compose.yml`:
```yaml
ports:
  - "8000:5000"  # Change 5000 to 8000
```

### View Logs
```bash
docker logs <container-name> --tail 50
```

### Restart Service
```bash
docker-compose restart backend-api
```

### Clean Rebuild
```bash
docker-compose down -v
docker-compose up --build -d
```

## Health Checks

All infrastructure services have health checks:
- Zookeeper: Port 2181
- Kafka: Bootstrap server check
- MongoDB: Ping command

Services start only when dependencies are healthy.
