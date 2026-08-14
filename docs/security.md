# Security & Tenant Isolation

This document outlines the security architecture, token authentication, and data isolation strategies implemented in AutoForge.

---

## Identity & Access Control

AutoForge implements Role-Based Access Control (RBAC) across the tenant hierarchy.

### Supported User Roles:
- **SUPER_ADMIN**: Manages global SaaS health, tenants subscription billing levels, and global configurations.
- **TENANT_ADMIN**: Complete access to their specific organization and all branches.
- **SERVICE_ADVISOR**: Manages scheduling, vehicle check-ins, customer approvals, estimates, and billing.
- **TECHNICIAN**: Mobile-sized PWA access. Checks job lists, clocks labor time, logs checklists, and requests parts.
- **CASHIER / ACCOUNTANT**: Manages invoicing, payment ledger balances, refunds, and POS integrations.

---

## Token Architecture & JWT Claims

Authentication is stateless and uses Signed JWT Tokens (HS512 algorithm).

### Token Claims Structure:
- `sub`: User email.
- `tenantId`: Identifies the multi-tenant context.
- `role`: Maps RBAC permissions.
- `branchId`: Restricts access to a specific branch service center.

---

## Database Isolation & Filter Enforcement

Data isolation is guaranteed through the following patterns:
1. **ThreadLocal Tenant Context**: The `JwtAuthenticationFilter` reads the incoming token, extracts the `tenantId` claim, and registers it in `TenantContext`.
2. **AbstractTenantEntity Lifecycle Hook**: All tenant-specific entities extend `AbstractTenantEntity`. On database save, the `@PrePersist` hook retrieves the active tenant ID from `TenantContext` and enforces it.
3. **Repository Enforcements**: All JpaRepository methods query on `tenantId` to ensure a branch manager cannot view another organization's billing summaries.

---

## Secure Public Approvals
- Estimate approvals use secure, non-guessable, tokenized UUID paths.
- Guest approval URLs do not require user accounts, but verify tokens to prevent cross-customer data exposure.
