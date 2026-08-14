# ADR-002: Shared Database Multi-Tenancy with Discriminator Column

## Status: Accepted

## Context
AutoForge is SaaS multi-tenant. Each workshop/dealer group is a tenant. Need to isolate data while keeping operational simplicity.

## Decision
Use shared database with `tenant_id` discriminator column on every operational table. Enforce isolation through:
1. `AbstractTenantEntity` base class with `@PrePersist` auto-setting tenant_id
2. Hibernate `@FilterDef` / `@Filter` annotations
3. `TenantFilterAspect` AOP that enables Hibernate filter before repository calls
4. ThreadLocal `TenantContext` set from JWT claims in `JwtAuthenticationFilter`

## Consequences
- **Positive**: Simple deployment (single database)
- **Positive**: Cross-tenant reporting possible with admin access
- **Positive**: No schema duplication
- **Negative**: Must never forget tenant_id in queries (mitigated by Hibernate filter)
- **Negative**: Noisy neighbor potential (mitigated by indexing on tenant_id)

## Alternatives Considered
- Schema-per-tenant: Too complex for initial scale
- Database-per-tenant: Expensive, complex connection pooling
