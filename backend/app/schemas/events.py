from datetime import date
from typing import Optional

from pydantic import BaseModel

from app.schemas.articles import ArticleOut


class EventOut(BaseModel):
    id: int
    title: str
    date: str
    article_count: int
    sources: list[str]
    entities: list[str]
    dominant_sentiment: str
    similarity_score: float
    articles: list[ArticleOut]

    model_config = {"from_attributes": True}


class EventsResponse(BaseModel):
    total: int
    events: list[EventOut]
