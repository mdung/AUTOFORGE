# AutoForge — AI-Native Automotive Workshop, Dealer & Aftersales Operating System

AutoForge is the complete operating system for automotive service, repair, maintenance, parts, and aftersales operations. It is designed to unify fragmented workflows (WhatsApp, paper job cards, excel, diagnostics, and payment gateways) into a single multi-tenant operational source of truth.

---

## 🛠️ Technology Stack

- **Backend**: Java 21, Spring Boot 3.2.5, Spring Security, Spring Data JPA, Hibernate, PostgreSQL, Flyway, Redis, Amazon S3 (MinIO), OpenAPI.
- **Frontend**: React 18, TypeScript, Vite, TanStack Query, React Router, Lucide Icons, Vanilla CSS.
- **Infrastructure**: Docker Compose (PostgreSQL, Redis, MinIO).

---

## 🚀 Getting Started

### Prerequisites
- Docker & Docker Compose
- Java JDK 21 (Maven 3.9+)
- Node.js (v20+) & npm

### Setup Infrastructure
1. Start the Docker containers:
   ```bash
   docker compose up -d
   ```
   *Note: PostgreSQL is mapped to port `5433` on the host to avoid port allocation conflicts with existing local databases. MinIO console is mapped to `9002`.*

### Run Backend
1. Build the backend code:
   ```bash
   cd backend
   mvn clean compile
   ```
2. Start the Spring Boot application:
   ```bash
   mvn spring-boot:run
   ```
   On boot, the database migrations run automatically and `DemoDataSeeder` seeds realistic mock datasets for evaluation.

### Run Frontend
1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Launch the Vite development server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:5173/](http://localhost:5173/) in your browser.

---

## 📂 Project Structure

```
AUTOFORGE/
├── backend/                  # Spring Boot Monolith
│   ├── src/main/java/com/autoforge/
│   │   ├── core/             # Security, Tenant filters, Context
│   │   └── modules/          # Business modules (identity, vehicle, checkin, repairorder, parts, invoice)
│   └── src/main/resources/
│       └── db/migration/     # Flyway migration scripts
│
├── frontend/                 # React SPA + PWA Viewports
│   ├── src/
│   │   ├── components/       # Visual damage maps, calendars
│   │   └── App.tsx           # Router and core dashboard workflow
│   └── tsconfig.app.json
│
└── docker-compose.yml        # PostgreSQL, Redis, MinIO
```

---

## 📖 System Documentation

Detailed system documentation is located in the `docs/` folder:
- [System Architecture](docs/architecture.md)
- [Database Schema Design](docs/database.md)
- [Core Business Workflows](docs/workshop-workflow.md)
- [Inventory Ledger & Stock Audit](docs/inventory.md)
- [Security & Tenant Isolation](docs/security.md)
- [API Reference Specifications](docs/api.md)
- [Roadmaps & AI Integrations](docs/roadmap.md)
