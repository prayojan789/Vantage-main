from datetime import datetime, timedelta
from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel

from app.core.config import settings
from app.database.session import SessionLocal
from app.models.models import User

# ── Password hashing ──────────────────────────────────────────────
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Return True if *plain_password* matches the stored *hashed_password*."""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Return a bcrypt hash of *password*."""
    return pwd_context.hash(password)


# ── Email normalisation ───────────────────────────────────────────
def normalize_email(email: str) -> str:
    """Lower-case and strip whitespace from an email address."""
    return (email or "").strip().lower()


# ── JWT helpers ───────────────────────────────────────────────────
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    email: Optional[str] = None


def create_access_token(
    data: dict,
    expires_delta: Optional[timedelta] = None,
) -> str:
    """Create a signed JWT.  *data* must contain at least ``sub`` (subject)."""
    to_encode = data.copy()
    expire = datetime.utcnow() + (
        expires_delta or timedelta(minutes=settings.access_token_expire_minutes)
    )
    to_encode.update({"exp": expire, "iat": datetime.utcnow()})
    return jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)


def decode_access_token(token: str) -> Optional[TokenData]:
    """Decode and validate a JWT.  Returns ``None`` on any error."""
    try:
        payload = jwt.decode(
            token, settings.secret_key, algorithms=[settings.algorithm]
        )
        email = payload.get("sub")
        if email is None:
            return None
        return TokenData(email=email)
    except JWTError:
        return None


# ── Current-user dependency ───────────────────────────────────────
def get_current_user(
    token: str = Depends(oauth2_scheme),
) -> User:
    """
    FastAPI dependency that resolves the authenticated ``User`` from the
    JWT bearer token.  Raises ``401`` when the token is missing, expired,
    or refers to a non-existent user.
    """
    token_data = decode_access_token(token)
    if token_data is None or token_data.email is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    db = SessionLocal()
    try:
        user = (
            db.query(User)
            .filter(User.email == normalize_email(token_data.email))
            .first()
        )
    finally:
        db.close()

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user
