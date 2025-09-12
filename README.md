# Xeno FDE Internship - Demo Project
This archive contains a minimal full-stack reference project implementing:
- Backend: Node.js + Express + Sequelize (MySQL)
- Frontend: React (Create-React-App style)
- Multi-tenant data ingestion endpoints for customers, products, orders
- Simple dashboard (no charting libraries used, per request)

## Quickstart
1. Backend: copy backend/.env.example -> backend/.env and set DB credentials.
2. Create MySQL database (e.g. xeno_db).
3. cd backend && npm install
4. npm run dev
5. Frontend: cd frontend && npm install && npm start
6. Use Signup to create a tenant, then use ingest endpoints to push sample data.


## Documentation
See DOCUMENTATION.md for architecture, APIs, DB schema, assumptions, and next steps.

## Deployment checklist
- Create GitHub repo and push code
- Deploy backend to Render/Heroku/Railway (set DB env vars and JWT_SECRET)
- Deploy frontend to Vercel (set REACT_APP_API_URL)
- Record a 5-7 minute demo video showing features and trade-offs
