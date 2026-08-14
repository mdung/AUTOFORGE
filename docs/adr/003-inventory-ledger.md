# ADR-003: Immutable Inventory Stock Movement Ledger

## Status: Accepted

## Context
Automotive parts inventory must be auditable. The system must never allow inventory to become inconsistent — every quantity change must be traceable.

## Decision
Every stock change (receipt, consumption, reservation, adjustment, return) creates an immutable `StockMovement` record. The `Part.stockQty` and `Part.reservedQty` fields are denormalized summaries. The source of truth is the movement ledger.

## Movement Types
- RECEIPT — Parts received from purchase order
- CONSUMPTION — Parts used in repair
- RESERVATION_ADD — Parts reserved for approved repair order
- RESERVATION_REMOVE — Reservation cancelled
- ADJUSTMENT — Manual inventory correction
- RETURN — Part returned to stock

## Consequences
- **Positive**: Full audit trail for every inventory change
- **Positive**: Can reconcile stock by replaying movements
- **Positive**: References link movements to POs and ROs
- **Negative**: Slightly more complex write path
- **Negative**: Denormalized stockQty can theoretically drift (need periodic reconciliation)
