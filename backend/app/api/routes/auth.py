from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.security import (
    get_password_hash,
    get_current_user,
    normalize_email,
    verify_password,
    create_access_token,
    Token,
)
from app.core.responses import wrap_response
from app.database.session import get_db
from app.models.models import User

router = APIRouter()

MIN_PASSWORD_LENGTH = 6
MAX_FULL_NAME_LENGTH = 255


class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=MIN_PASSWORD_LENGTH)
    full_name: str = Field(..., min_length=1, max_length=MAX_FULL_NAME_LENGTH)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    email: str
    full_name: str | None = None


@router.post("/signup", status_code=status.HTTP_201_CREATED)
def signup(user_in: UserCreate, db: Session = Depends(get_db)):
    normalized = normalize_email(user_in.email)

    # Check if user already exists (normalised comparison)
    existing_user = (
        db.query(User)
        .filter(User.email == normalized)
        .first()
    )
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    new_user = User(
        email=normalized,
        hashed_password=get_password_hash(user_in.password),
        full_name=user_in.full_name.strip(),
        role="user",
    )

    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
    except IntegrityError:
        # Race-condition guard: unique constraint on email
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    return wrap_response(
        {"email": new_user.email, "full_name": new_user.full_name},
        "User created successfully",
    )


@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    normalized = normalize_email(form_data.username)

    user = (
        db.query(User)
        .filter(User.email == normalized)
        .first()
    )

    # Same error for both missing user and wrong password (prevents enumeration)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(data={"sub": user.email})
    return wrap_response(
        {"access_token": access_token, "token_type": "bearer"},
        "Login successful",
    )


@router.post("/logout")
def logout():
    # JWT is stateless — logout is handled on the frontend by deleting the token.
    # This endpoint is provided for consistency and future server-side revocation.
    return wrap_response(None, "Logged out successfully")


@router.get("/me", response_model=UserOut)
def get_current_user_endpoint(
    current_user: User = Depends(get_current_user),
):
    return UserOut(
        email=current_user.email,
        full_name=current_user.full_name,
    )
