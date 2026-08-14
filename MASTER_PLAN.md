# AutoForge Master Plan

AutoForge aims to be the leading operational OS for independent and chain automotive workshops.

---

## 🎯 MVP Architecture Targets

1. **Modular Monolith**: Enforce clean module division with 19 business modules in a single deployable unit.
2. **Tenant Isolation**: Hibernate @FilterDef + ThreadLocal TenantContext + AOP TenantFilterAspect.
3. **Optimized Workshop Flows**: Real-time Kanban board, interactive vehicle checks, and PWA-based technician logs.
4. **Security**: JWT + Refresh tokens, @PreAuthorize RBAC, rate limiting, secure approval links.
5. **Observability**: Micrometer Prometheus metrics, MDC correlation IDs, structured logging, audit trail.

---

## 🏗️ Phased Development Schedule

### Phase 0: Infrastructure & Skeletons (Completed)
- Docker Compose (PostgreSQL 16, Redis 7, MinIO)
- Spring Boot 3.2.5 Maven project with Flyway
- Vite-React frontend shell with PWA support
- CI/CD pipeline (GitHub Actions)
- Dockerfiles (backend + frontend)

### Phase 1: Authentication & Core Entities (Completed)
- JWT Security + Refresh tokens
- @PreAuthorize role-based access control
- Rate limiting, Idempotency filter, MDC logging
- Database schema (V1 + V2 migrations, 27+ tables)
- Demo data seeder with Vietnamese dataset
- OpenAPI/Swagger documentation

### Phase 2: Check-in reception & Inspections (Completed)
- Vehicle check-in workflow with damage recording
- Digital Vehicle Inspection (DVI) with traffic-light indicators
- Photo evidence architecture via MinIO S3

### Phase 3: Estimating & approvals (Completed)
- Estimate builder from DVI findings
- Customer digital approval with secure signed links (time-limited, single-use, revocable)
- Partial approval support (approve/decline individual items)

### Phase 4: Job dispatch & Control board (Completed)
- Workshop Kanban board with RO status columns
- Full RO state machine (12 states + cancellation from any open state)
- Technician timer with overlap prevention
- QC gating enforcement (must pass QC before delivery)
- DomainEventPublisher integration for audit trail

### Phase 5: Parts, Procurement & Billing (Completed)
- Parts catalog with stock management
- Immutable stock movement ledger
- Parts reservation logic (reserve on approval, consume on completion)
- Purchase Order module (create, send, receive goods)
- Supplier management
- Invoice generation from approved estimates
- Payment recording (VNPay + Stripe integration)
- BusinessMetrics (Prometheus counters)

### Phase 6: Analytics, Fleet & Service History (In Progress)
- Vehicle timeline (service history, mileage records, maintenance schedules)
- Deferred work / recommendations tracking
- Fleet management (Fleet, Driver, FleetVehicle, Policy)
- Calendar views (Day/Week/Month)
- Next service reminder calculation
- Recurring failure detection utility
- Basic reports controller

---

## 📊 Current Metrics
- **Backend modules**: 19
- **Database tables**: 27+
- **REST endpoints**: 50+
- **Frontend pages**: 15+
- **Test coverage**: 6 tests (integration + controller)
- **Documentation files**: 14 (docs + ADRs)
