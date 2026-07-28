from fastapi import APIRouter

from app.api.routes import articles, bias, dashboard, events, sentiment, sources, auth, analytics

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["Analytics"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard"])
api_router.include_router(articles.router, prefix="/articles", tags=["Articles"])
api_router.include_router(events.router, prefix="/events", tags=["Events"])
api_router.include_router(sources.router, prefix="/sources", tags=["Sources"])
api_router.include_router(bias.router, prefix="/bias", tags=["Bias"])
api_router.include_router(sentiment.router, prefix="/sentiment", tags=["Sentiment"])
