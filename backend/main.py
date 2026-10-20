
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="AVENQIO API",
    description="Backend API for the AVENQIO smart shopping website",
    version="1.0.0",
)

# CORS configuration for local development and production.
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

# Temporary product data.
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
    return {
        "message": "Welcome to AVENQIO API!",
        "status": "running",
    }


@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "project": "AVENQIO",
    }


@app.get("/api/products")
def get_products():
    return products


@app.get("/api/products/{product_id}")
def get_product(product_id: int):
    for product in products:
        if product["id"] == product_id:
            return product

    raise HTTPException(
        status_code=404,
        detail="Product not found",
    )
