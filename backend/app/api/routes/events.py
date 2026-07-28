from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload

from app.database.session import get_db
from app.models.models import Article, Event
from app.schemas.events import EventOut, EventsResponse
from app.services.helpers import build_event_out
from app.core.responses import APIResponse, wrap_response

router = APIRouter()


@router.get("", response_model=APIResponse[EventsResponse])
def get_events(
    min_articles: int = Query(2, description="Only return events with at least this many articles"),
    limit: int = Query(50, le=200),
    source: Optional[str] = Query(None, description="Filter by source name"),
    db: Session = Depends(get_db),
):
    all_events = (
        db.query(Event)
        .options(
            joinedload(Event.articles).joinedload(Article.source),
            joinedload(Event.articles).joinedload(Article.entities),
        )
        .all()
    )

    result = []
    for e in all_events:
        if len(e.articles) < min_articles:
            continue
        if source:
            source_names = {a.source.name for a in e.articles if a.source}
            if source not in source_names:
                continue
        result.append(e)

    result.sort(key=lambda e: len(e.articles), reverse=True)
    total = len(result)
    events_out = [build_event_out(e) for e in result[:limit]]
    data = EventsResponse(total=total, events=events_out)
    return wrap_response(data, "Events retrieved successfully")


@router.get("/{event_id}", response_model=APIResponse[EventOut])
def get_event(event_id: int, db: Session = Depends(get_db)):
    e = (
        db.query(Event)
        .options(
            joinedload(Event.articles).joinedload(Article.source),
            joinedload(Event.articles).joinedload(Article.entities),
        )
        .filter(Event.id == event_id)
        .first()
    )
    if not e:
        raise HTTPException(status_code=404, detail="Event not found")
    return wrap_response(build_event_out(e), "Event details retrieved successfully")
