from datetime import date, timedelta
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Dict, Any

from app.database.session import get_db
from app.models.models import Article, Event, Source
from app.core.responses import APIResponse, wrap_response

router = APIRouter()

@router.get("/summary", response_model=APIResponse[Dict[str, Any]])
def get_analytics_summary(db: Session = Depends(get_db)):
    # 1. Time Series Data (Last 14 days)
    trend_data = []
    today = date.today()
    for i in range(13, -1, -1):
        day = today - timedelta(days=i)
        # Count events and articles for this specific day
        events_count = db.query(Event).filter(Event.created_at >= day).count() # Simplified for demo
        articles_count = db.query(Article).filter(Article.published_at == day).count()
        
        trend_data.append({
            "day": day.strftime("%a %d"),
            "events": events_count,
            "articles": articles_count
        })

    # 2. Sentiment Distribution by Source
    sources = db.query(Source).all()
    distribution = []
    for src in sources:
        articles = db.query(Article).filter(Article.source_id == src.id).all()
        pos = sum(1 for a in articles if a.entities and any(e.sentiment == 'positive' for e in a.entities))
        neg = sum(1 for a in articles if a.entities and any(e.sentiment == 'negative' for e in a.entities))
        neu = len(articles) - pos - neg
        distribution.append({
            "name": src.name,
            "pos": pos,
            "neu": neu,
            "neg": neg
        })

    return wrap_response({
        "trend": trend_data,
        "distribution": distribution
    }, "Analytics data retrieved successfully")
