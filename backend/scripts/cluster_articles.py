import os
import sys

import numpy as np
from sqlalchemy import select
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from db.base import SessionLocal
from db.models import Article, Event

def get_embedding_text(article):
    if article.paragraph1:
        return f"{article.title} {article.paragraph1}"
    return article.title
    

def generate_embeddings():

    #new session opened
    session = SessionLocal()

    try:
        #Queries all articles where embedding IS NULL
        
        articles = session.execute(select(Article).where(Article.embedding == None)).scalars().all()
        

        model = SentenceTransformer("all-MiniLM-L6-v2")

        counter = 0
        for raw_article in articles:
            text = get_embedding_text(raw_article)
            embedding = model.encode(text)
            raw_article.embedding = embedding
            counter+=1
            print(f"Embedded {counter}: {raw_article.title[:60]}")

            if counter%50 == 0:
                session.commit()

        session.commit()
    finally:
        session.close()

def load_articles_with_embeddings(session):
    articles = session.execute(
        select(Article).where(Article.embedding != None).order_by(Article.published_at)
    ).scalars().all()
    return articles


def batch_cluster(session):
    articles = load_articles_with_embeddings(session)
    counter = 0

    for article in articles:
        if article.event_id is not None:
            continue

        candidates = [
            a for a in articles
            if a.event_id is not None
            and abs((a.published_at - article.published_at).days) <= 3
        ]

        best_score = 0
        best_candidate = None

        for candidate in candidates:
            score = cosine_similarity(
                article.embedding.reshape(1, -1),
                candidate.embedding.reshape(1, -1)
            )[0][0]

            if score > best_score:
                best_score = score
                best_candidate = candidate

        if best_score > 0.75:
            article.event_id = best_candidate.event_id
        else:
            new_event = Event()
            session.add(new_event)
            session.flush()
            article.event_id = new_event.id

        counter += 1
        if counter % 50 == 0:
            session.commit()
            print(f"Clustered {counter} articles...")

    session.commit()
    print(f"Batch clustering complete. Total processed: {counter}")

def cluster_articles():
    session = SessionLocal()

    try:
        batch_cluster(session)

    finally:
        session.close()



if __name__ == "__main__":
    print("Starting embedding generation...")
    generate_embeddings()
    print("Starting clustering...")
    cluster_articles()