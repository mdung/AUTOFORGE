# ADR-001: Modular Monolith Architecture

## Status: Accepted

## Context
AutoForge needs to support complex automotive workshop workflows while remaining simple to deploy and operate for initial customers.

## Decision
Use a modular monolith architecture with package-level module boundaries. Each business domain (customer, vehicle, repairorder, parts, invoice, etc.) is a separate package under `com.autoforge.modules`.

## Consequences
- **Positive**: Single deployable unit, simpler operations, shared database transactions
- **Positive**: Clear module boundaries enable future extraction to microservices
- **Positive**: No distributed system complexity (no service mesh, no eventual consistency)
- **Negative**: Must enforce module boundaries through discipline (no cross-module JPA joins)
- **Negative**: Scaling is vertical initially

## Future Migration Path
Modules communicate through service interfaces and domain events. When scale demands it, individual modules can be extracted into separate services using the transactional outbox pattern.
