from datetime import date

import numpy as np

from app.models.models import Article, Entity
from app.schemas.articles import ArticleOut, EntityOut


def sentiment_from_entities(entities: list) -> str:
    """Derive dominant sentiment from a list of Entity ORM objects."""
    if not entities:
        return "neutral"
    counts = {"positive": 0, "negative": 0, "neutral": 0}
    for e in entities:
        s = e.sentiment if e.sentiment in counts else "neutral"
        counts[s] += 1
    return max(counts, key=counts.get)


def score_from_entities(entities: list) -> float:
    """Average confidence score from a list of Entity ORM objects."""
    scores = [e.confidence for e in entities if e.confidence is not None]
    if not scores:
        return 0.5
    return round(sum(scores) / len(scores), 3)


def compute_similarity_score(event) -> float:
    """
    Compute the average pairwise cosine similarity between all article
    embeddings in an event cluster.

    Falls back to 0.0 when fewer than two articles have usable embeddings.
    """
    embeddings = []
    for a in event.articles:
        if a.embedding is not None:
            emb = np.array(a.embedding, dtype=np.float32)
            if np.linalg.norm(emb) > 0:
                embeddings.append(emb)

    if len(embeddings) < 2:
        return 0.0

    total = 0.0
    count = 0
    for i in range(len(embeddings)):
        for j in range(i + 1, len(embeddings)):
            norm_i = float(np.linalg.norm(embeddings[i]))
            norm_j = float(np.linalg.norm(embeddings[j]))
            if norm_i > 0 and norm_j > 0:
                sim = float(np.dot(embeddings[i], embeddings[j])) / (norm_i * norm_j)
                total += sim
                count += 1

    if count == 0:
        return 0.0

    return round(total / count, 2)


def build_article_out(a: Article) -> ArticleOut:
    entities = a.entities or []
    sentiment = sentiment_from_entities(entities)
    score = score_from_entities(entities)
    entity_outs = [
        EntityOut(
            name=e.name,
            entity_type=e.entity_type or "UNKNOWN",
            sentiment=e.sentiment if e.sentiment in ("positive", "negative", "neutral") else "neutral",
            score=round(float(e.confidence), 3) if e.confidence is not None else 0.5,
        )
        for e in entities
    ]
    summary = ""
    if a.paragraph1:
        summary = a.paragraph1
    elif a.body:
        summary = a.body[:200]
    return ArticleOut(
        id=a.id,
        title=a.title or "",
        headline=a.title or "",
        url=a.url or "",
        published_at=a.published_at,
        source=a.source.name if a.source else "Unknown",
        sentiment=sentiment,
        sentiment_score=score,
        summary=summary,
        entities=entity_outs,
    )


def build_event_out(e) -> dict:
    """Build a dict matching EventOut schema from an Event ORM object."""
    from app.schemas.events import EventOut

    articles = [build_article_out(a) for a in e.articles]
    sources = list({a.source for a in articles})

    entity_names = []
    seen: set = set()
    for a in e.articles:
        for ent in (a.entities or []):
            if ent.name not in seen:
                seen.add(ent.name)
                entity_names.append(ent.name)

    sent_counts = {"positive": 0, "negative": 0, "neutral": 0}
    for a in articles:
        s = a.sentiment if a.sentiment in sent_counts else "neutral"
        sent_counts[s] += 1
    dominant = max(sent_counts, key=sent_counts.get) if articles else "neutral"

    dates = [a.published_at for a in e.articles if a.published_at]
    event_date = (
        max(dates).isoformat()
        if dates
        else (
            e.created_at.date().isoformat()
            if e.created_at
            else date.today().isoformat()
        )
    )

    title = e.articles[0].title if e.articles else f"Event #{e.id}"
    similarity_score = compute_similarity_score(e)

    return EventOut(
        id=e.id,
        title=title,
        date=event_date,
        article_count=len(articles),
        sources=sources,
        entities=entity_names[:6],
        dominant_sentiment=dominant,
        similarity_score=similarity_score,
        articles=articles,
    )
