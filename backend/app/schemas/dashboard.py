from pydantic import BaseModel


class SentimentDistribution(BaseModel):
    positive: int
    neutral: int
    negative: int


class DashboardSummaryResponse(BaseModel):
    total_articles: int
    total_events: int
    total_publishers: int
    sentiment_distribution: SentimentDistribution
