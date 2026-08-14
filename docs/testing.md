# AutoForge — Testing Strategy

## Test Pyramid

### Unit Tests
- Business rule validation (state transitions, QC gating)
- Service-level logic (invoice calculation, stock movements)
- Utility methods

### Controller Tests (MockMvc)
- Endpoint response codes and JSON structure
- Security annotations verify access control
- Input validation (@Valid) rejection

### Integration Tests
- Full workflow execution (Appointment → Delivery)
- Tenant isolation verification
- Database constraint enforcement

### E2E Tests (Future)
- Browser-based workflow testing
- Multi-user scenarios
- Offline/PWA scenarios

## Running Tests
```bash
cd backend
mvn test                                   # All tests
mvn test -pl . -Dtest=EstimateControllerTest  # Single test class
mvn test -Dspring.profiles.active=test      # With test profile
```

## Critical Test Assertions
1. Tenant A cannot access Tenant B data
2. Unauthorized branch access is rejected
3. Invalid RO state transitions throw IllegalStateException
4. QC must pass before READY_FOR_DELIVERY
5. Stock movements are created for every inventory change
6. Parts reservation increments reservedQty
7. Invoice totals are deterministic from approved estimate items
8. Technician timer overlap is prevented
9. Secure approval links expire and are single-use

## Test Data
- DemoDataSeeder creates realistic Vietnamese test data on startup
- Integration tests use @Transactional for automatic rollback
- Test profile uses separate database (autoforge_test)

## Current Test Coverage
- `AutoForgeWorkflowIntegrationTest` — State transitions, QC gating, delivery flow
- `EstimateControllerTest` — CRUD endpoints, error handling, tenant mismatch
