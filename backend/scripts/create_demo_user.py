"""
Create a demo user for testing the Vantage application.
Run this script to create a test user with known credentials.
"""

from app.database.session import SessionLocal
from app.models.models import User
from app.core.security import get_password_hash

def create_demo_user():
    db = SessionLocal()
    try:
        # Check if demo user already exists
        existing = db.query(User).filter(User.email == "demo@vantage.np").first()
        if existing:
            print("✓ Demo user already exists")
            print(f"  Email: demo@vantage.np")
            print(f"  Password: demo123")
            return

        # Create demo user with short password for bcrypt compatibility
        password = "demo123"
        hashed = get_password_hash(password)
        print(f"Debug: Password hash generated: {hashed[:50]}...")
        demo_user = User(
            email="demo@vantage.np",
            hashed_password=hashed,
            full_name="Demo User",
            role="user",
        )
        db.add(demo_user)
        db.commit()
        db.refresh(demo_user)

        print("✓ Demo user created successfully!")
        print(f"  Email: demo@vantage.np")
        print(f"  Password: demo123")
        print(f"  Name: Demo User")
        print(f"\nYou can now log in at http://localhost:5173/sign-in")

    except Exception as e:
        print(f"✗ Error creating demo user: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_demo_user()