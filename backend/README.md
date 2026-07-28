# Vantage — Backend

<div align="center">

### **FastAPI-powered NLP pipeline for news intelligence and media bias analysis**

*REST API that ingests, clusters, analyzes sentiment, and detects bias across Nepali English press outlets.*

<br>

![FastAPI](https://img.shields.io/badge/FastAPI-0.139-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=for-the-badge&logo=python&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-2.0-D71F00?style=for-the-badge&logo=sqlalchemy&logoColor=white)
![Hugging Face](https://img.shields.io/badge/Transformers-5.13-FFD21E?style=for-the-badge&logo=huggingface&logoColor=black)

</div>

---

## Overview

The Vantage backend is a FastAPI application that powers the news intelligence platform. It handles:

- **News ingestion** — scraping and fetching articles from 50+ Nepali English press outlets
- **Event clustering** — grouping related articles into meaningful news events
- **Entity extraction** — identifying people, organizations, parties, and locations using spaCy
- **Aspect-based sentiment analysis (ABSA)** — scoring sentiment toward specific entities using DistilBERT
- **Media bias detection** — comparing framing, tone, and coverage patterns across publishers
- **Knowledge graph** — mapping relationships between entities, publishers, topics, and events
- **JWT authentication** — secure user registration, login, and session management
- **pgvector embeddings** — semantic search and similarity matching via vectorized article representations

---

## Tech Stack

| Category        | Technology                                    |
|-----------------|-----------------------------------------------|
| Framework       | FastAPI 0.139                                 |
| Language        | Python 3.12+                                  |
| ORM             | SQLAlchemy 2.0                                |
| Database        | PostgreSQL 16 + pgvector                      |
| Auth            | JWT (python-jose) + OAuth2 password flow      |
| Validation      | Pydantic v2 + Pydantic Settings               |
| ML / NLP        | Hugging Face Transformers, spaCy, DistilBERT  |
| Vector Search   | pgvector                                      |
| Scraping        | Scrapy, httpx, fake-useragent                 |
| Server          | Uvicorn + httptools                           |

---

## Project Structure

```
backend/
├── app/
│   ├── api/
│   │   ├── routes/           # Route handlers (auth, articles, events, bias, etc.)
│   │   └── router.py         # Central router aggregator
│   ├── core/
│   │   ├── config.py         # Pydantic Settings (env-driven configuration)
│   │   ├── responses.py      # Standardized API response wrapper
│   │   └── security.py       # Password hashing, JWT creation/verification
│   ├── database/
│   │   └── session.py        # SQLAlchemy engine and session factory
│   ├── models/
│   │   └── models.py         # SQLAlchemy ORM models
│   ├── schemas/
│   │   ├── articles.py       # Article request/response schemas
│   │   ├── bias.py           # Bias report schemas
│   │   ├── common.py         # Shared Pydantic models
│   │   ├── dashboard.py      # Dashboard KPI schemas
│   │   ├── events.py         # Event cluster schemas
│   │   ├── sentiment.py      # Sentiment analysis schemas
│   │   └── sources.py        # Publisher/source schemas
│   ├── services/
│   │   ├── helpers.py        # Business logic and DB query helpers
│   │   └── nlp.py            # NLP pipeline (sentiment, embeddings, entities)
│   ├── __init__.py
│   └── main.py               # FastAPI app entry point
├── db/                       # Database migration scripts or seed data
├── scraping/                 # Scrapy spiders for news ingestion
├── scripts/                  # Utility scripts
├── .env.example              # Environment variable template
├── Dockerfile                # Container build
├── requirements.txt          # Python dependencies
└── README.md
```

---

## Getting Started

### Prerequisites

- Python 3.12+
- PostgreSQL 16 with pgvector extension
- Docker (optional, for containerized setup)

### Setup

#### Option 1: Docker (recommended)

Use the root `docker-compose.yml` which starts both PostgreSQL and the backend:

```bash
# From the project root
docker compose up --build
```

#### Option 2: Manual

```bash
# 1. Create and configure the environment file
cp .env.example .env
# Edit .env with your database URL and secret key

# 2. Install dependencies
pip install -r requirements.txt

# 3. Make sure PostgreSQL is running with pgvector extension

# 4. Start the server
uvicorn app.main:app --reload --port 8000
```

The API runs at **http://localhost:8000**.

---

## Environment Variables

| Variable                    | Default                                     | Description                     |
|-----------------------------|---------------------------------------------|---------------------------------|
| `DATABASE_URL`              | `postgresql+psycopg://postgres:postgres@localhost:5432/vantage` | PostgreSQL connection string |
| `SECRET_KEY`                | `change-me-in-production`                   | JWT signing secret              |
| `ALGORITHM`                 | `HS256`                                     | JWT signing algorithm           |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `1440` (24 hours)                        | JWT token lifetime              |
| `ALLOWED_ORIGINS`           | `http://localhost:5173`                     | CORS allowed origins            |
| `FRONTEND_URL`              | `http://localhost:5173`                     | Frontend URL for CORS/redirects |

---

## API Routes

All routes are prefixed with `/api/v1`. All responses follow the standardized format:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Authentication

| Method | Path                | Description                        |
|--------|---------------------|------------------------------------|
| POST   | `/auth/signup`      | Register a new user                |
| POST   | `/auth/login`       | Authenticate and receive JWT       |
| POST   | `/auth/logout`      | Logout (stateless JWT — frontend-side) |
| GET    | `/auth/me`          | Get current user profile (auth required) |

### Dashboard

| Method | Path                       | Description                |
|--------|----------------------------|----------------------------|
| GET    | `/dashboard/summary`       | Dashboard KPI summary      |

### Events

| Method | Path                | Description                  |
|--------|---------------------|------------------------------|
| GET    | `/events`           | List event clusters          |
| GET    | `/events/{id}`      | Single event with articles   |

### Articles

| Method | Path                  | Description               |
|--------|-----------------------|---------------------------|
| GET    | `/articles`           | List articles (paginated) |
| GET    | `/articles/{id}`      | Single article detail     |

### Sources / Publishers

| Method | Path                  | Description               |
|--------|-----------------------|---------------------------|
| GET    | `/sources`            | List news sources         |
| GET    | `/sources/{id}`       | Single publisher detail   |
| GET    | `/sources/{id}/articles` | Articles by publisher  |

### Bias & Sentiment

| Method | Path                | Description                            |
|--------|---------------------|----------------------------------------|
| GET    | `/bias`             | Cross-publisher bias report            |
| POST   | `/sentiment`        | Run ABSA analysis on provided text     |

### Health

| Method | Path      | Description      |
|--------|-----------|------------------|
| GET    | `/health` | Health check     |

API documentation is available at **http://localhost:8000/docs** (Swagger UI) or **http://localhost:8000/redoc** (ReDoc).

---

## Authentication Flow

1. **Sign up** — `POST /auth/signup` with `{ email, password, full_name }`
2. **Log in** — `POST /auth/login` with `username` (email) + `password` (form-encoded per OAuth2 spec)
3. **Receive JWT** — The response includes an `access_token` (valid for 24 hours by default)
4. **Authenticate requests** — Include `Authorization: Bearer <token>` header
5. **Token refresh** — Not currently implemented; a new token is obtained via re-login

---

## Database Models

- **User** — `id`, `email` (unique), `hashed_password`, `full_name`, `role`, `created_at`, `updated_at`
- **Article** — `id`, `title`, `content`, `url` (unique), `source`, `published_at`, `embedding` (pgvector), `sentiment_scores`
- **Event** — `id`, `title`, `description`, `keywords`, `created_at`
- **EventArticle** — many-to-many join between events and articles
- **Entity** — `id`, `name`, `type` (person, organization, location), `sentiment_score`, `mentions`
- **Source** — `id`, `name`, `base_url`, `country`, `language`, `bias_score`

---

## NLP Pipeline

The NLP service (`app/services/nlp.py`) handles:

1. **Named Entity Recognition (NER)** — spaCy model extracts people, organizations, and locations
2. **Aspect-Based Sentiment Analysis (ABSA)** — DistilBERT fine-tuned for aspect-level sentiment classification
3. **Text embeddings** — sentence-transformers generate vector embeddings stored in pgvector for semantic search
4. **Event clustering** — articles are grouped into events based on cosine similarity of embeddings + keyword overlap

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request

---

## License

MIT