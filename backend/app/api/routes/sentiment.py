from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.sentiment import AnalyzeRequest, AnalyzedEntityOut, AnalyzeResponse
from app.services.nlp import run_absa

router = APIRouter()


@router.post("", response_model=AnalyzeResponse)
def analyze_text(body: AnalyzeRequest, db: Session = Depends(get_db)):
    """
    Run aspect-based sentiment analysis (ABSA) on the provided text.

    Uses a pre-trained HuggingFace sentiment model (lazy-loaded on first
    call) to determine the sentiment toward each political entity
    mentioned in the text.  Falls back to a lexicon-based approach when
    the model is unavailable.
    """
    result = run_absa(body.text)

    entities = [
        AnalyzedEntityOut(
            name=r["name"],
            sentiment=r["sentiment"],
            score=r["score"],
            context=r["context"],
        )
        for r in result["entities"]
    ]

    return AnalyzeResponse(
        entities=entities,
        overall_sentiment=result["overall_sentiment"],
        processing_ms=result["processing_ms"],
    )
