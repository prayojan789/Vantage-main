from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import or_
from sqlalchemy.orm import Session, joinedload

from app.database.session import get_db
from app.models.models import Article, Source
from app.schemas.articles import ArticleOut, ArticlesResponse
from app.services.helpers import build_article_out
from app.core.responses import APIResponse, wrap_response

router = APIRouter()


@router.get("", response_model=APIResponse[ArticlesResponse])
def get_articles(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    source: Optional[str] = Query(None, description="Filter by source name"),
    search: Optional[str] = Query(None, description="Search in title or body"),
    db: Session = Depends(get_db),
):
    query = (
        db.query(Article)
        .options(
            joinedload(Article.source),
            joinedload(Article.entities),
        )
    )

    if source:
        query = query.join(Source).filter(Source.name == source)

    if search:
        pattern = f"%{search}%"
        query = query.filter(
            or_(
                Article.title.ilike(pattern),
                Article.body.ilike(pattern),
            )
        )

    total = query.count()
    articles = (
        query.order_by(Article.published_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )

    articles_out = [build_article_out(a) for a in articles]
    data = ArticlesResponse(
        total=total,
        page=page,
        page_size=page_size,
        total_pages=(total + page_size - 1) // page_size if page_size else 0,
        articles=articles_out,
    )
    return wrap_response(data, "Articles retrieved successfully")


@router.get("/{article_id}", response_model=ArticleOut)
def get_article(article_id: int, db: Session = Depends(get_db)):
    a = (
        db.query(Article)
        .options(joinedload(Article.source), joinedload(Article.entities))
        .filter(Article.id == article_id)
        .first()
    )
    if not a:
        raise HTTPException(status_code=404, detail="Article not found")
    return build_article_out(a)
