
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="AVENQIO API",
    description="Backend API for the AVENQIO smart shopping website",
    version="1.0.0",
)

# Allow requests from the local frontend and deployed Vercel website.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://avenqio.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Temporary product data.
# Later, this can be moved into a database.
products = [
    {
        "id": 1,
        "name": "Wireless Headphones",
        "category": "Electronics",
        "price": 1999,
        "rating": 4.5,
        "image": "https://placehold.co/400x400?text=Headphones",
        "stock": 10,
    },
    {
        "id": 2,
        "name": "Smart Watch",
        "category": "Electronics",
        "price": 2499,
        "rating": 4.3,
        "image": "https://placehold.co/400x400?text=Smart+Watch",
        "stock": 8,
    },
    {
        "id": 3,
        "name": "Running Shoes",
        "category": "Fashion",
        "price": 1799,
        "rating": 4.2,
        "image": "https://placehold.co/400x400?text=Shoes",
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
