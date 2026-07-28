from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from app.core.config import settings


class Base(DeclarativeBase):
    pass


def _make_engine():
    url = settings.database_url
    if not url:
        return None
    return create_engine(url, pool_pre_ping=True, echo=False)


engine = _make_engine()

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
) if engine else None


def get_db():
    if SessionLocal is None:
        raise RuntimeError("DATABASE_URL is not configured.")
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
