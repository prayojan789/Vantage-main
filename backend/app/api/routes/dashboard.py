from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.models import Article, Entity, Event, Source
from app.schemas.dashboard import DashboardSummaryResponse, SentimentDistribution
from app.services.helpers import sentiment_from_entities
from app.core.responses import APIResponse, wrap_response

router = APIRouter()


@router.get("/summary", response_model=APIResponse[DashboardSummaryResponse])
def get_dashboard_summary(db: Session = Depends(get_db)):
    total_articles = db.query(Article).count()
    total_events = db.query(Event).count()
    total_publishers = db.query(Source).count()

    articles = db.query(Article).all()
    pos = neg = neu = 0
    for a in articles:
        sent = sentiment_from_entities(a.entities or [])
        if sent == "positive":
            pos += 1
        elif sent == "negative":
            neg += 1
        else:
            neu += 1

    data = DashboardSummaryResponse(
        total_articles=total_articles,
        total_events=total_events,
        total_publishers=total_publishers,
        sentiment_distribution=SentimentDistribution(
            positive=pos,
            neutral=neu,
            negative=neg,
        ),
    )
    return wrap_response(data, "Dashboard summary retrieved successfully")
