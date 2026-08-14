# AutoForge — Deployment Guide

## Docker Build

### Backend
```bash
cd backend
docker build -t autoforge-backend:latest .
```

### Frontend
```bash
cd frontend
docker build -t autoforge-frontend:latest .
```

## Docker Compose (Full Stack)
```yaml
# Add to docker-compose.yml for full deployment
services:
  backend:
    build: ./backend
    ports:
      - "8080:8080"
    environment:
      - SPRING_PROFILES_ACTIVE=prod
      - DB_URL=jdbc:postgresql://postgres:5432/autoforge
      - DB_USER=autoforge_user
      - DB_PASS=autoforge_pass
      - REDIS_HOST=redis
      - AWS_S3_ENDPOINT=http://minio:9000
      - AWS_ACCESS_KEY=minioadmin
      - AWS_SECRET_KEY=minioadmin
      - JWT_SECRET=your-production-secret-here
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
```

## Environment Variables (Production)

| Variable | Description | Required |
|----------|-------------|----------|
| DB_URL | PostgreSQL JDBC URL | Yes |
| DB_USER | Database username | Yes |
| DB_PASS | Database password | Yes |
| REDIS_HOST | Redis hostname | Yes |
| JWT_SECRET | JWT signing key (Base64 512-bit) | Yes |
| AWS_S3_ENDPOINT | MinIO/S3 endpoint | Yes |
| AWS_ACCESS_KEY | S3 access key | Yes |
| AWS_SECRET_KEY | S3 secret key | Yes |
| GEMINI_API_KEY | Google Gemini AI key | Optional |

## Health Checks
- Backend: `GET /api/v1/actuator/health`
- PostgreSQL: `pg_isready`
- Redis: `redis-cli ping`
- MinIO: `curl http://minio:9000/minio/health/live`

## Production Checklist
- [ ] Change JWT secret to strong random value
- [ ] Set SPRING_PROFILES_ACTIVE=prod
- [ ] Configure proper CORS allowed origins
- [ ] Set up HTTPS/TLS termination
- [ ] Configure backup for PostgreSQL and MinIO
- [ ] Set up log aggregation
- [ ] Configure Prometheus scraping from /actuator/prometheus
- [ ] Set resource limits on containers
