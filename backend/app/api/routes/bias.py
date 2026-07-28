from datetime import date

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session, joinedload

from app.database.session import get_db
from app.models.models import Article, Source
from app.schemas.bias import BiasResponse, BiasSourceOut
from app.services.helpers import sentiment_from_entities
from app.core.responses import APIResponse, wrap_response

router = APIRouter()


@router.get("", response_model=APIResponse[BiasResponse])
def get_bias(
    days: int = Query(30, description="Number of days to look back"),
    db: Session = Depends(get_db),
):
    sources = (
        db.query(Source)
        .options(joinedload(Source.articles).joinedload(Article.entities))
        .all()
    )

    media_houses = []
    all_entity_names: dict = {}

    for src in sources:
        if not src.articles:
            continue

        positive = negative = neutral = 0
        for article in src.articles:
            sent = sentiment_from_entities(article.entities or [])
            if sent == "positive":
                positive += 1
            elif sent == "negative":
                negative += 1
            else:
                neutral += 1
            for ent in (article.entities or []):
                all_entity_names[ent.name] = all_entity_names.get(ent.name, 0) + 1

        sorted_articles = sorted(src.articles, key=lambda a: a.published_at or date.min)
        chunk = max(1, len(sorted_articles) // 7)
        trend = []
        for i in range(7):
            chunk_articles = sorted_articles[i * chunk : (i + 1) * chunk]
            if chunk_articles:
                pos = sum(1 for a in chunk_articles if sentiment_from_entities(a.entities or []) == "positive")
                neg = sum(1 for a in chunk_articles if sentiment_from_entities(a.entities or []) == "negative")
                total = len(chunk_articles)
                score = round((pos - neg) / total, 2) if total else 0.0
                ref_date = chunk_articles[0].published_at
                trend.append({"date": ref_date.strftime("%b %d") if ref_date else f"Week {i+1}", "score": score})
            else:
                trend.append({"date": f"Week {i+1}", "score": 0.0})

        media_houses.append(
            BiasSourceOut(
                name=src.name,
                positive=positive,
                negative=negative,
                neutral=neutral,
                trend=trend,
            )
        )

    top_entities = sorted(all_entity_names, key=all_entity_names.get, reverse=True)[:6]
    data = BiasResponse(top_entities=top_entities, media_houses=media_houses)
    return wrap_response(data, "Bias report generated successfully")
