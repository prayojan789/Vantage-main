from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.router import api_router
from app.core.config import settings

app = FastAPI(
    title="Vantage API",
    version="1.0.0",
    description="Nepal news intelligence platform API",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)

app.include_router(api_router, prefix="/api/v1")


@app.get("/health", tags=["System"])
async def health_check():
    return {"status": "healthy", "service": "vantage-api"}


@app.get("/", tags=["System"])
async def root():
    return {"status": "ok", "service": "vantage-api", "docs": "/docs"}
