# AutoForge — Integration Roadmap

## Current Integrations
- **VIN Decode** — NHTSA VPIC API for vehicle specification lookup
- **Payment Gateways** — VNPay (sandbox) + Stripe (mock)
- **Object Storage** — MinIO S3-compatible for documents/photos
- **AI** — Google Gemini API boundary

## Phase 1: Communication
- **Email** — SMTP / SendGrid for notifications
- **SMS** — Twilio / Brandname SMS for Vietnamese market
- **Push Notifications** — Firebase Cloud Messaging
- **Messaging** — WhatsApp Business API, Zalo OA API

## Phase 2: Parts Ecosystem
- **Supplier API** — Standardized interface for part search/availability/ordering
- **Parts Marketplace** — Aggregate multiple suppliers
- **Electronic Invoice** — Vietnam e-invoice regulations (hóa đơn điện tử)

## Phase 3: Vehicle Data
- **OBD-II** — Diagnostic scanner integration
- **Telematics** — Connected vehicle data (mileage, DTC, location)
- **OEM Diagnostic** — Brand-specific diagnostic tool APIs

## Phase 4: Business Ecosystem
- **Insurance** — Claims submission, assessor workflow
- **Warranty** — OEM warranty claim submission
- **Fleet API** — Fleet management system integration
- **Accounting** — Export to accounting systems (QuickBooks, SAP)

## Phase 5: Platform APIs
- **Public API** — REST API for partners
- **Webhooks** — Event notifications to external systems
- **OAuth2** — Third-party application authorization
- **Marketplace** — Plugin/extension system

## Integration Design Principles
1. Never tightly couple to one provider — use adapter pattern
2. Define clear interface boundaries (e.g., `PaymentProvider`, `VehicleDataProvider`)
3. Support graceful degradation when integrations are unavailable
4. Log all external API calls for debugging
5. Use circuit breakers for unreliable external services
6. Store integration credentials in environment variables, never in code
