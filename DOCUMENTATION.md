# Documentation — Xeno FDE Internship Assignment (Demo)

## Overview & Assumptions
- This project demonstrates a multi-tenant Shopify Data Ingestion & Insights Service.
- **Assumptions**:
  - Shopify store setup and actual API credentials are not provided; ingestion endpoints accept Shopify-like payloads for demo/testing.
  - No external queue systems (Redis/RabbitMQ) or charting libraries are included (per request).
  - Simple email/password admin auth for tenant onboarding (demo only — not production hardened).

## High-level architecture (ASCII diagram)
  ┌─────────────┐       ┌──────────────┐       ┌──────────────┐
  │ Shopify     │ <---> │ Ingestion    │ <---> │ MySQL (ORM)  │
  │ (dev store) │ webhooks| Service     |       │ Sequelize    │
  └─────────────┘       └──────────────┘       └──────────────┘
                              │
                              ▼
                          Scheduler (cron)
                              │
                              ▼
                           Dashboard (React)

## APIs
- POST /api/auth/signup { name, storeUrl, email, password } -> { token, tenant }
- POST /api/auth/login { email, password } -> { token, tenant }
- POST /api/ingest/tenant/:tenantId/customers  -> ingest customers
- POST /api/ingest/tenant/:tenantId/products   -> ingest products
- POST /api/ingest/tenant/:tenantId/orders     -> ingest orders
- GET /api/dashboard/overview  (Authorization: Bearer <token>)
- GET /api/dashboard/orders?from=YYYY-MM-DD&to=YYYY-MM-DD
- GET /api/dashboard/top-customers

## DB Models (Sequelize)
- Tenant: id, name, storeUrl, adminEmail, adminPasswordHash
- Customer: id, tenantId, shopifyId, email, firstName, lastName, totalSpent
- Product: id, tenantId, shopifyId, title, price
- Order: id, tenantId, shopifyId, customerId, totalPrice, createdAtShopify

## How to run (local)
1. Backend:
   - Copy `backend/.env.example` to `backend/.env` and set DB credentials & JWT_SECRET.
   - Create MySQL database (e.g. `CREATE DATABASE xeno_db;`).
   - `cd backend && npm install`
   - `npm run dev` (starts server and scheduler stub)
2. Frontend:
   - `cd frontend && npm install && npm start`
   - Update `REACT_APP_API_URL` if backend runs elsewhere.
3. Ingest sample data via curl or Postman (examples in README).

## Next steps to productionize
- Add real Shopify OAuth and webhook verification with HMAC signatures.
- Add background job processing (Redis + Bull or RabbitMQ) for robust ingestion.
- Add production-grade auth (email verification, password reset, RBAC).
- Add proper CI/CD and docker-compose for reproducible deployment.
- Add automated tests and end-to-end tests, and monitoring/metrics.

## Known limitations
- Admin auth stores password hash in the Tenant table for demo only.
- No charting library included; dashboard shows numeric tables only (per user request).
- Scheduler is a stub; actual Shopify API sync not implemented without credentials.
