# Product Roadmaps & AI Integration Boundaries

This document details the roadmap plans for the future evolution of AutoForge.

---

## 📅 Roadmap Phases

### Phase 1: SaaS Core & Offline Check-ins (Current MVP)
- Multi-tenant tenant database architecture.
- Damage mapReception, DVI checklists, digital estimates builder.
- Technician mobile PWA with time trackers.
- Parts catalog and inventory movement log auditing.

### Phase 2: Parts supplier marketplace & integrations
- Real-time parts availability search.
- Supplier APIs for automatic parts pricing checks and ETAs.
- In-app card card payments and QR code invoicing.

### Phase 3: Connected telematics & predictive schedules
- OBD-II / Connected vehicle API integrations.
- Auto-tracking vehicle health anomalies (oil levels, brake wear).
- Automated service booking reminder dispatch.

---

## 🤖 AI Copilot & Knowledge Graph

The AI system is designed as a standalone microservice to keep the core operations engine light.

```
[Core Platform Database] (SQL)
          │
          ▼
[Vector Database Sync] (RAG) ──► [LLM Agent Pipeline] ──► [Advisor UI Assistant]
          ▲
          │
[Repair SOP Documents] (PDF/Markdown)
```

### Strategic AI Operations Moat:
- **Comeback Flags**: Analyzes recurring symptoms on the same VIN, warning if the vehicle returns with similar vibrations.
- **Estimate Summarizer**: Explains diagnostic details to customers in non-technical terms.
- **SOP Recommendation**: Suggests diagnostic workflows to technicians based on model, year, and DTC codes.
