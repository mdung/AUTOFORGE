# Parts Inventory & Ledger Audits

This document describes the AutoForge inventory tracking, stock movements, and audit ledger systems.

---

## stock reservation and consumption flows

```mermaid
sequenceDiagram
    participant Estimator as Estimate Module
    participant Inv as Inventory Module
    participant Tech as Technician PWA

    Estimator->>Inv: Reserve parts on estimate approval
    Note over Inv: Stock remains constant;<br/>Reserved quantity increases.
    Tech->>Inv: Consume parts during job repair
    Note over Inv: Stock quantity decreases;<br/>Reserved quantity decreases.
    Inv->>Inv: Log immutable movement ledger
```

---

## Inventory Ledger System

AutoForge enforces stock integrity using an **Immutable Stock Movement Ledger** represented by the `inventory_stock_movements` table.
- Stock numbers are never modified without a corresponding transaction row.
- All additions, adjustments, reservations, and consumption logs are appended as transactions.

### Transaction Movement Types:
1. **RECEIPT**: Restocking inventory items via purchase receipts from suppliers. Cost basis is tracked.
2. **RESERVATION_ADD**: Locks inventory parts for an approved estimate. Prevents selling reserved parts to other walk-in customers.
3. **RESERVATION_REMOVE**: Decrements the reservation pool (in case of cancellations or partial approvals).
4. **CONSUMPTION**: Deducts parts physically used by a technician during a repair. Decreases both total stock and reserved allocations.
5. **ADJUSTMENT**: Adjusts values during stock counts (audit reconciliation).

---

## Parts Purchase Procurement
- Purchase Orders (PO) track transactions with parts distributors.
- When items are marked as received, stock levels increment, cost averages update, and matching ROs are flagged to resume jobs.
