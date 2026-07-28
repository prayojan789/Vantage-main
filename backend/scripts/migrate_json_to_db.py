import json
import os
import re
import sys
from datetime import datetime

from sqlalchemy import select


def clean_text(text):
    if not text:
        return None
    # remove control characters except \n \t (normal whitespace)
    text = re.sub(r"[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]", "", text)
    # normalize whitespace
    text = " ".join(text.split())
    return text.strip()


sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from db.base import SessionLocal, engine
from db.models import Article, Source

# ── Config ────────────────────────────────────────────────────────────────────

FILES = [
    {
        "path": "scraping/scraper/kathmanduData1.json",
        "source_name": "kathmandu_post",
        "base_url": "https://kathmandupost.com",
    },
    {
        "path": "scraping/scraper/onlinekhabarData1.json",
        "source_name": "onlinekhabar",
        "base_url": "https://english.onlinekhabar.com",
    },
    {
        "path": "scraping/scraper/setopatiData1.json",
        "source_name": "setopati",
        "base_url": "https://en.setopati.com",
    },
    {
    "path": "scraping/scraper/himalayan1.json",  
    "source_name": "himalayan_times",
    "base_url": "https://thehimalayantimes.com"
    },
]

# ── Helpers ───────────────────────────────────────────────────────────────────


def get_or_create_source(session, name, base_url):
    source = session.execute(
        select(Source).where(Source.name == name)
    ).scalar_one_or_none()

    if source is None:
        source = Source(name=name, base_url=base_url)
        session.add(source)
        session.commit()
        print(f"  Created source: {name}")
    else:
        print(f"  Source already exists: {name}")

    return source


def article_exists(session, url):
    result = session.execute(
        select(Article).where(Article.url == url)
    ).scalar_one_or_none()
    return result is not None


def parse_scraped_at(scraped_at_str):
    try:
        return datetime.strptime(scraped_at_str, "%Y-%m-%d %H:%M")
    except Exception:
        return datetime.now()


def parse_published_at(published_at_str):
    try:
        from datetime import date

        return date.fromisoformat(published_at_str)
    except Exception:
        return None


# ── Main Migration ────────────────────────────────────────────────────────────


def migrate():
    session = SessionLocal()

    total_inserted = 0
    total_skipped = 0

    try:
        for file_config in FILES:
            path = file_config["path"]
            source_name = file_config["source_name"]
            base_url = file_config["base_url"]

            print(f"\nProcessing: {path}")

            if not os.path.exists(path):
                print(f"  File not found, skipping: {path}")
                continue

            source = get_or_create_source(session, source_name, base_url)

            with open(path, "r", encoding="utf-8") as f:
                data = json.load(f)

            inserted = 0
            skipped = 0

            for item in data:
                url = item.get("url")

                if not url:
                    skipped += 1
                    continue

                if article_exists(session, url):
                    skipped += 1
                    continue

                published_at = parse_published_at(item.get("published_at"))
                if published_at is None:
                    skipped += 1
                    continue

                article = Article(
                    url=url,
                    title=clean_text(item.get("title", "")),
                    paragraph1=clean_text(item.get("paragraph1")),
                    body=clean_text(item.get("body", "")),
                    published_at=published_at,
                    scraped_at=parse_scraped_at(item.get("scraped_at", "")),
                    source_id=source.id,
                    event_id=None,
                    embedding=None,
                )

                session.add(article)
                inserted += 1

                # commit every 50 articles to avoid memory buildup
                if inserted % 50 == 0:
                    session.commit()
                    print(f"  Committed {inserted} articles so far...")

            session.commit()
            print(f"  Done — inserted: {inserted}, skipped: {skipped}")

            total_inserted += inserted
            total_skipped += skipped

    except Exception as e:
        session.rollback()
        print(f"\nError occurred: {e}")
        raise

    finally:
        session.close()

    print(f"\nMigration complete.")
    print(f"Total inserted: {total_inserted}")
    print(f"Total skipped:  {total_skipped}")


if __name__ == "__main__":
    migrate()
