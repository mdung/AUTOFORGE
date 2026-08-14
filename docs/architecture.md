# System Architecture Design

This document details the software architecture of **AutoForge**, built as a high-performance, developer-friendly **Modular Monolith** using Spring Boot 3.x and React.

---

## Modular Monolith Patterns

To maintain simplicity in hosting while enforcing decoupling, AutoForge uses package-level modularity.

```
com.autoforge/
├── core/                   # Contexts, Configurations, Security Filter chains
└── modules/
    ├── identity/           # RBAC, User models, JWT generators
    ├── tenant/             # Hierarchy: Tenant -> Organization -> Branch -> Bay
    ├── customer/           # Customer database & search queries
    ├── vehicle/            # Vehicle specifications and mileage tracking
    ├── appointment/        # Arrival schedules
    ├── checkin/            # Interactive damage pins mapping
    ├── inspection/         # DVI checklist items
    ├── estimate/           # Estimate calculations and approval signatures
    ├── repairorder/        # State validation, jobs, technician clocks
    ├── parts/              # Parts catalogs, inventory movements
    └── invoice/            # Receipts & payment records
```

### Decoupling Rules
1. **No cross-module database tables joins**: Database foreign keys only reference the primary keys of other tables (e.g. `vehicle` table contains an `owner_id` referring to the `customer` table).
2. **State synchronization**: Major business milestones dispatch transactional domain events or direct interface method calls. For example, estimate approvals trigger job assignments in the `repairorder` package and parts reservations in the `parts` package.

---

## Multi-Tenancy Design

AutoForge uses a **Shared Database, Discriminator Column** model for data isolation:
- Every table containing operational information has a non-nullable `tenant_id` column.
- The thread-local `TenantContext` class registers the tenant ID of the authenticated user upon reading their JWT signature.
- Database access methods verify the active tenant context using Spring JpaRepository custom query queries or manual filters to prevent cross-tenant data leakage.

---

## Frontend Architecture

- **React Core**: Single-Page Application (SPA) leveraging Vite for build cycles.
- **TanStack Query**: Coordinates server-side caching, cache invalidation, and data synchronization.
- **Component Design System**: Built with clean Vanilla CSS variables, responsive viewport grid grids, and custom interactive SVG/Canvas wrappers.
