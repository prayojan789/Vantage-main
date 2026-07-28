# Vantage — Nepal News Intelligence Platform

AI-powered news aggregator that clusters, analyzes, and visualizes media bias across Nepali English press outlets.

## Stack

| Layer    | Technology                        |
|----------|-----------------------------------|
| Frontend | React 18, Vite, Tailwind CSS      |
| Backend  | FastAPI, Python 3.12, Pydantic v2 |
| Database | PostgreSQL 16 + pgvector          |
| ML       | sentence-transformers, HuggingFace|

## Project structure

```
vantage/
├── frontend/          React + Vite SPA
├── backend/           FastAPI application
│   └── app/
│       ├── api/       Route handlers
│       ├── core/      Config & settings
│       ├── database/  DB session
│       ├── models/    SQLAlchemy ORM models
│       ├── schemas/ la Pydantic request/response schemas
│       └── services/  Business logic helpers
├── docker-compose.yml Local full-stack dev
└── README.md
```

## Local development

### 1. Database + Backend (Docker)

```bash
docker compose up --build
```

Backend runs at: http://localhost:8000  
API docs: http://localhost:8000/docs  
Health: http://localhost:8000/health

### 2. Frontend (Vite dev server)

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: http://localhost:5173

### 3. Environment variables

Create a `.env` file in the root directory based on `.env.example`:

```bash
cp .env.example .env
# Edit .env with your DATABASE_URL and SECRET_KEY
```

## API routes

All routes are prefixed with `/api/v1`. All responses follow the standardized format: `{ "success": boolean, "message": string, "data": any }`.

| Method | Path                    | Description            |
|--------|-------------------------|------------------------|
| POST   | /auth/signup             | Register new user       |
| POST   | /auth/login              | Authenticate & get JWT  |
| GET    | /health                 | Health check           |
| GET    | /api/v1/events          | List event clusters    |
| GET    | /api/v1/events/{id}     | Single event detail    |
| GET    | /api/v1/articles/{id}   | Single article         |
| GET    | /api/v1/sources         | List news sources      |
| GET    | /api/v1/bias            | Publisher bias report  |
| POST   | /api/v1/sentiment       | Run ABSA analysis      |
| GET    | /api/v1/dashboard/summary | Dashboard KPIs       |
