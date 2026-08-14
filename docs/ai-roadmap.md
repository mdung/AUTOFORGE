# AutoForge — AI Roadmap

## Philosophy
AI must NOT be a decorative chatbot. It must provide genuine operational value by analyzing structured automotive repair data.

## Phase 1: AI Service Boundary (Current)
- AiCopilotService interface defined
- Google Gemini API integration configured
- Placeholder endpoints for vehicle analysis

## Phase 2: Structured Data Analysis
- **Vehicle History Summary** — Aggregate repair history into readable narrative
- **Repair Order Summary** — Generate customer-friendly explanation of work performed
- **Estimate Explanation** — Explain recommended repairs in plain language
- **Recurring Failure Detection** — Flag vehicles returning with same symptoms

## Phase 3: Knowledge-Assisted Repair
- **Technician Knowledge Assistant** — Answer diagnostic questions using repair history
- **Parts Recommendation** — Suggest parts based on vehicle model + symptom
- **Service Advisor Assistant** — Help advisors explain technical issues to customers

## Phase 4: Predictive Maintenance
- **Failure Prediction** — Analyze patterns across fleet to predict upcoming failures
- **Maintenance Scheduling** — Optimize service intervals based on actual usage
- **Cost Forecasting** — Predict maintenance costs for fleet budgeting

## Phase 5: Connected Intelligence
- **DTC Analysis** — Correlate diagnostic trouble codes with successful repairs
- **Parts Quality Analysis** — Identify supplier quality patterns from warranty data
- **Workshop Load Balancing** — Predict demand and optimize scheduling

## Architecture Requirements
- RAG over repair history + service manuals + technical bulletins
- Structured SQL retrieval for vehicle-specific data
- Vector search for similar past cases
- Clear distinction between FACT / HYPOTHESIS / RECOMMENDATION
- Evidence linking to source records
- AI must never present uncertain diagnosis as confirmed
