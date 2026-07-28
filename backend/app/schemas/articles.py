from datetime import date
from typing import Optional

from pydantic import BaseModel


class EntityOut(BaseModel):
    name: str
    entity_type: str
    sentiment: Optional[str] = None
    score: Optional[float] = None

    model_config = {"from_attributes": True}


class ArticleOut(BaseModel):
    id: int
    title: str
    headline: str
    url: str
    published_at: date
    source: str
    sentiment: str
    sentiment_score: float
    summary: str
    entities: list[EntityOut]

    model_config = {"from_attributes": True}


class ArticlesResponse(BaseModel):
    total: int
    page: int
    page_size: int
    total_pages: int
    articles: list[ArticleOut]
