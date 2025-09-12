# Backend (Node.js + Express + Sequelize + MySQL)
## Setup
1. Copy `.env.example` to `.env` and set DB credentials.
2. `cd backend && npm install`
3. Ensure MySQL is running and the database exists (create if needed).
4. `npm run dev` to start with nodemon or `npm start`.
## Endpoints
- POST /api/auth/signup { name, storeUrl } -> { token, tenant }
- POST /api/auth/login { tenantId } -> { token }
- POST /api/ingest/tenant/:tenantId/customers  -> ingest customers
- POST /api/ingest/tenant/:tenantId/products   -> ingest products
- POST /api/ingest/tenant/:tenantId/orders     -> ingest orders
- GET /api/dashboard/overview  (Authorization: Bearer <token>)
- GET /api/dashboard/orders?from=YYYY-MM-DD&to=YYYY-MM-DD
- GET /api/dashboard/top-customers
