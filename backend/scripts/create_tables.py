import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from db import models  # noqa: F401 — ensures models are registered
from db.base import Base, engine


def create_tables():
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)
    print("Done. All tables created successfully.")


if __name__ == "__main__":
    create_tables()
