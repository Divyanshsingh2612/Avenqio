
import os
from contextlib import asynccontextmanager
from datetime import datetime, timedelta, timezone
from typing import Generator

import jwt
from pwdlib import PasswordHash
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel, ConfigDict, EmailStr, Field
from sqlalchemy import Boolean, DateTime, Integer, String, create_engine, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import DeclarativeBase, Mapped, Session, mapped_column, sessionmaker


# ---------------- CONFIGURATION ----------------

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./avenqio.db")

# Local fallback is for development only. Set JWT_SECRET_KEY in production.
JWT_SECRET_KEY = os.getenv(
    "JWT_SECRET_KEY",
    "local-development-only-change-this-secret-before-deployment",
)
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_MINUTES = 30

connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
    pool_pre_ping=True,
)
SessionLocal = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)


# ---------------- DATABASE ----------------

class Base(DeclarativeBase):
    pass


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    full_name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


# ---------------- APP & CORS ----------------

app = FastAPI(
    title="AVENQIO API",
    description="Backend API for the AVENQIO smart shopping website",
    version="2.0.0",
    lifespan=lifespan,
)

ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://avenqio.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------- PASSWORDS & JWT ----------------

password_hasher = PasswordHash.recommended()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


def create_access_token(user_id: int) -> str:
    now = datetime.now(timezone.utc)
    payload = {
        "sub": str(user_id),
        "iat": now,
        "exp": now + timedelta(minutes=ACCESS_TOKEN_MINUTES),
    }
    return jwt.encode(payload, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:
    unauthorized = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired access token. Please log in again.",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(
            token,
            JWT_SECRET_KEY,
            algorithms=[JWT_ALGORITHM],
        )
        subject = payload.get("sub")
        if not subject:
            raise unauthorized
        user_id = int(subject)
    except (jwt.InvalidTokenError, ValueError, TypeError):
        raise unauthorized

    user = db.get(User, user_id)
    if user is None or not user.is_active:
        raise unauthorized

    return user


# ---------------- REQUEST & RESPONSE SCHEMAS ----------------

class RegisterRequest(BaseModel):
    full_name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=128)


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    full_name: str
    email: EmailStr
    is_active: bool
    created_at: datetime


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


# ---------------- AUTH ENDPOINTS ----------------

@app.post(
    "/api/auth/register",
    response_model=AuthResponse,
    status_code=status.HTTP_201_CREATED,
)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    full_name = payload.full_name.strip()
    email = str(payload.email).strip().lower()

    if len(full_name) < 2:
        raise HTTPException(status_code=422, detail="Please enter your full name.")

    existing_user = db.scalar(select(User).where(User.email == email))
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists.",
        )

    user = User(
        full_name=full_name,
        email=email,
        hashed_password=password_hasher.hash(payload.password),
    )
    db.add(user)

    try:
        db.commit()
        db.refresh(user)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists.",
        )

    return AuthResponse(
        access_token=create_access_token(user.id),
        user=user,
    )


@app.post("/api/auth/login", response_model=AuthResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    email = str(payload.email).strip().lower()
    user = db.scalar(select(User).where(User.email == email))

    if (
        user is None
        or not password_hasher.verify(payload.password, user.hashed_password)
        or not user.is_active
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return AuthResponse(
        access_token=create_access_token(user.id),
        user=user,
    )


@app.get("/api/auth/me", response_model=UserResponse)
def get_my_account(current_user: User = Depends(get_current_user)):
    return current_user


# ---------------- EXISTING PRODUCT API ----------------

products = [
    {
        "id": 1,
        "name": "Wireless Headphones",
        "category": "Electronics",
        "price": 1999,
        "rating": 4.5,
        "image": "https://m.media-amazon.com/images/I/41lArSiD5hL._AC_UF1000,1000_QL80_.jpg",
        "stock": 10,
    },
    {
        "id": 2,
        "name": "Smart Watch",
        "category": "Electronics",
        "price": 2499,
        "rating": 4.3,
        "image": "https://mc.bajajfinserv.in/media/catalog/product/s/m/sml315fzgains_455069_base.jpeg",
        "stock": 8,
    },
    {
        "id": 3,
        "name": "Running Shoes",
        "category": "Fashion",
        "price": 1799,
        "rating": 4.2,
        "image": "https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/a/d/ad22b92Nike-HQ2592-702_4.jpg?rnd=20200526195200&tr=w-1536",
        "stock": 15,
    },
]


@app.get("/")
def home():
    return {"message": "Welcome to AVENQIO API!", "status": "running"}


@app.get("/api/health")
def health_check():
    return {"status": "healthy", "project": "AVENQIO"}


@app.get("/api/products")
def get_products():
    return products


@app.get("/api/products/{product_id}")
def get_product(product_id: int):
    for product in products:
        if product["id"] == product_id:
            return product

    raise HTTPException(status_code=404, detail="Product not found")
