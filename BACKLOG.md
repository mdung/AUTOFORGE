# AutoForge Product Backlog & Roadmaps

This document maintains upcoming tasks and refactoring plans.

---

## ✅ Recently Completed
- [x] URL path consistency (context-path + controller paths verified)
- [x] @PreAuthorize on write endpoints (Customer, Vehicle, RepairOrder, Parts, Invoice, Appointment)
- [x] @Valid on mutation endpoints
- [x] RO State Machine expanded (full lifecycle: DRAFT → CLOSED + CANCELLED)
- [x] QC gating enforcement in RepairOrderService.updateStatus()
- [x] DomainEventPublisher wired to RepairOrderService, EstimateService, InvoiceService, PurchaseOrderService
- [x] BusinessMetricsService wired to RepairOrderService
- [x] Stock Movement ledger (model + repository + service integration)
- [x] Parts reservation logic (reserveParts / releaseReservedParts)
- [x] Purchase Order module (controller + service + models + repositories)
- [x] Pagination (RepairOrders, Customers, Vehicles)
- [x] Refresh token mechanism (JwtUtils + AuthService + /auth/refresh endpoint)
- [x] Frontend Dockerfile (multi-stage Node + nginx)
- [x] MinIO S3 real integration (presigned URLs, upload, download, delete)
- [x] Spring profiles (dev, test, prod)
- [x] .env.example
- [x] CI/CD pipeline (GitHub Actions)
- [x] ADRs (5 records)
- [x] Comprehensive documentation (product, domain-model, development, deployment, testing, ai-roadmap, integration-roadmap)
- [x] Frontend architecture (ErrorBoundary, TanStack Query provider, API service, env config, hooks, i18n)
- [x] Zod + React Hook Form (demonstrated in LoginPage)
- [x] Calendar view (Day/Week/Month)
- [x] PWA (manifest + service worker)

---

## 📈 High Priority (Next Cycle)
- [ ] Integrate useApi hooks into App.tsx pages (replace inline fetch + mock data)
- [ ] Implement React Router DOM routes (URL-based navigation instead of state)
- [ ] Split App.tsx monolithic pages into separate view files
- [ ] Add Testcontainers for integration tests with isolated PostgreSQL
- [ ] Add tenant isolation tests (verify cross-tenant access is blocked)
- [ ] Expand i18n to cover all page content (not just nav labels)
- [ ] Add accessibility (aria-labels, semantic HTML, keyboard navigation)

## ⚙️ Refactoring & Technical Debt
- [ ] Create DTO layer for all controller responses (don't expose raw JPA entities)
- [ ] Add frontend E2E tests (Playwright or Cypress)
- [ ] Add more backend unit tests for services
- [ ] Implement proper RBAC with fine-grained permissions table instead of role strings
- [ ] Move SecureLinkService revocation from in-memory to Redis
- [ ] Implement proper pagination for Parts, Appointments, Inspections endpoints
- [ ] Add branch-level enforcement at repository level (not just SecurityService method)
