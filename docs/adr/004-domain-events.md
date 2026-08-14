# ADR-004: In-Process Domain Events with Transactional Outbox Readiness

## Status: Accepted

## Context
Business events (estimate approved, payment received, vehicle delivered) need to trigger side effects (notifications, audit trail, metrics) without tight coupling.

## Decision
Use Spring's `ApplicationEventPublisher` for in-process synchronous domain events. `DomainEventPublisher` wraps the Spring publisher. `AuditEventListener` persists events to `audit_events` table.

## Current Implementation
- Events published within same transaction
- AuditEventListener saves to audit_events table
- BusinessMetricsService increments Prometheus counters

## Future: Transactional Outbox
When async processing is needed:
1. Save event to `outbox_events` table within business transaction
2. Separate poller reads outbox and publishes to message broker (Kafka/RabbitMQ)
3. Consumers process events asynchronously

## Consequences
- **Positive**: Decoupled event handling
- **Positive**: Full audit trail via listener
- **Positive**: Clear migration path to async
- **Negative**: Synchronous execution — slow listeners block the caller
