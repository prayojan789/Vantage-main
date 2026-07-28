from pydantic import BaseModel


class BiasSourceOut(BaseModel):
    name: str
    positive: int
    negative: int
    neutral: int
    trend: list[dict]


class BiasResponse(BaseModel):
    top_entities: list[str]
    media_houses: list[BiasSourceOut]
