from pydantic import BaseModel


class AnalyzeRequest(BaseModel):
    text: str


class AnalyzedEntityOut(BaseModel):
    name: str
    sentiment: str
    score: float
    context: str


class AnalyzeResponse(BaseModel):
    entities: list[AnalyzedEntityOut]
    overall_sentiment: str
    processing_ms: int
