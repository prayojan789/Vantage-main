from pgvector.sqlalchemy import Vector
from sqlalchemy import Column, Date, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from db.base import Base


class Source(Base):
    __tablename__ = "sources"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), unique=True, nullable=False)
    base_url = Column(Text, nullable=False)
    created_at = Column(DateTime, server_default=func.now())

    articles = relationship("Article", back_populates="source")


class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, autoincrement=True)
    created_at = Column(DateTime, server_default=func.now())

    articles = relationship("Article", back_populates="event")


class Article(Base):
    __tablename__ = "articles"

    id = Column(Integer, primary_key=True, autoincrement=True)
    url = Column(Text, unique=True, nullable=False)
    title = Column(Text, nullable=False)
    paragraph1 = Column(Text, nullable=True)
    body = Column(Text, nullable=False)
    published_at = Column(Date, nullable=False)
    scraped_at = Column(DateTime, nullable=False)
    source_id = Column(Integer, ForeignKey("sources.id"), nullable=False)
    event_id = Column(Integer, ForeignKey("events.id"), nullable=True)
    embedding = Column(Vector(384), nullable=True)
    created_at = Column(DateTime, server_default=func.now())

    source = relationship("Source", back_populates="articles")
    event = relationship("Event", back_populates="articles")
    entities = relationship("Entity", back_populates="article")

 
class Entity(Base):
    __tablename__ = "entities"

    id = Column(Integer, primary_key=True, autoincrement=True)
    article_id = Column(Integer, ForeignKey("articles.id"), nullable=False)
    name = Column(String(200), nullable=False)
    entity_type = Column(String(50), nullable=False)
    political_group = Column(String(50), nullable=True)
    sentiment = Column(String(20), nullable=True)
    confidence = Column(Float, nullable=True)
    created_at = Column(DateTime, server_default=func.now())

    article = relationship("Article", back_populates="entities")
