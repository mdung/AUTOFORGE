# AutoForge — Domain Model

## Core Entities

### Multi-Tenancy Hierarchy
```
Tenant
├── Organization
│   └── Branch
│       └── Bay (Service Bay)
└── User (with Role)
```

### Customer & Vehicle
```
Customer (Individual | Business | Fleet)
└── Vehicle
    ├── MileageRecord[]
    ├── MaintenanceSchedule[]
    ├── DeferredWork[]
    └── ServiceHistory (derived from ROs)
```

### Workshop Operations
```
Appointment → CheckIn → Inspection → Estimate → RepairOrder → Invoice → Payment → Delivery
```

### Repair Order Decomposition
```
RepairOrder
├── RepairJob[]
│   ├── JobTimeEntry[] (technician clock)
│   └── Parts consumed
├── Estimate
│   └── EstimateItem[] (LABOR | PART | FEE)
├── QualityCheck
└── Invoice
    └── Payment[]
```

### Parts & Inventory
```
Part
├── StockMovement[] (immutable ledger)
├── Supplier
└── PurchaseOrder
    └── PurchaseOrderItem[]
```

### Fleet Management
```
Fleet
├── FleetVehicle[]
├── Driver[]
└── Policy[]
```

## State Machines

### Repair Order Statuses
```
DRAFT → CHECKED_IN → INSPECTION → WAITING_APPROVAL → APPROVED →
  WAITING_PARTS / READY_FOR_WORK → IN_PROGRESS → QUALITY_CONTROL →
  READY_FOR_DELIVERY → DELIVERED → CLOSED

Any open state → CANCELLED
```

### Estimate Statuses
DRAFT → SENT → APPROVED / PARTIALLY_APPROVED / DECLINED

### Purchase Order Statuses
DRAFT → SENT → PARTIALLY_RECEIVED → RECEIVED / CANCELLED

### Invoice Statuses
DRAFT → ISSUED → PARTIALLY_PAID → PAID / VOID / REFUNDED

## Domain Events
- CustomerCreated, VehicleRegistered
- AppointmentBooked, VehicleCheckedIn
- InspectionCompleted, CriticalFindingDetected
- EstimateCreated, EstimateApproved
- RepairOrderCreated, JobAssigned, JobCompleted
- PurchaseOrderCreated, GoodsReceived
- QualityCheckPassed, QualityCheckFailed
- InvoiceIssued, PaymentReceived, VehicleDelivered
