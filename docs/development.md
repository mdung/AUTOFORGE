# AutoForge — Development Guide

## Prerequisites
- Java 21 (JDK)
- Maven 3.9+
- Node.js 20+
- Docker & Docker Compose

## Quick Start

```bash
# 1. Start infrastructure
docker compose up -d

# 2. Run backend
cd backend
mvn spring-boot:run

# 3. Run frontend (separate terminal)
cd frontend
npm install
npm run dev
```

## Project Structure
```
AUTOFORGE/
├── backend/                    # Spring Boot 3.2.5 modular monolith
│   ├── src/main/java/com/autoforge/
│   │   ├── core/              # Security, Tenant, Config, Metrics, Logging
│   │   └── modules/           # 19 business modules
│   ├── src/main/resources/
│   │   ├── application.yml    # Default config
│   │   ├── application-dev.yml
│   │   ├── application-test.yml
│   │   ├── application-prod.yml
│   │   └── db/migration/      # Flyway scripts
│   └── src/test/java/         # Tests
├── frontend/                   # React 19 + Vite 8 + TypeScript
│   ├── src/
│   │   ├── components/        # Shared components
│   │   ├── views/             # Page-level components
│   │   ├── hooks/             # TanStack Query hooks
│   │   ├── services/          # API client
│   │   └── config/            # Environment config
│   └── public/                # PWA manifest + service worker
├── docs/                       # Documentation
└── docker-compose.yml          # Infrastructure services
```

## Running Tests
```bash
cd backend
mvn test                        # All tests
mvn test -Dspring.profiles.active=test
```

## Environment Variables
See `backend/.env.example` for required environment variables.

## API Documentation
When running locally, Swagger UI is available at:
http://localhost:8080/api/v1/swagger-ui/index.html

## Spring Profiles
- `dev` — Verbose logging, SQL output
- `test` — In-memory style, Flyway disabled
- `prod` — Environment variable driven, minimal logging

## Coding Conventions
- Entities extend `AbstractTenantEntity` for tenant isolation
- Services use `TenantContext.getCurrentTenant()` for scoping
- Write endpoints use `@PreAuthorize` for role-based access
- Mutations use `@Valid` for input validation
- All stock changes create `StockMovement` records
- Business state transitions use `BusinessRuleValidator`
- Significant events publish via `DomainEventPublisher`
