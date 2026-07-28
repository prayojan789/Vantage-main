from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.models import Source
from app.schemas.sources import SourcesResponse
from app.core.responses import APIResponse, wrap_response

router = APIRouter()


@router.get("", response_model=APIResponse[SourcesResponse])
def get_sources(db: Session = Depends(get_db)):
    rows = db.query(Source).all()
    data = SourcesResponse(sources=[r.name for r in rows])
    return wrap_response(data, "Sources retrieved successfully")
