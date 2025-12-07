from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from prometheus_fastapi_instrumentator import Instrumentator
import pymysql
import os
import logging


# Logging configuration
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s"
)

logger = logging.getLogger("products-api")


# FastAPI App
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

Instrumentator().instrument(app).expose(app)


# DB Connection
def get_db_connection():
    return pymysql.connect(
        host=os.getenv("DB_HOST", "localhost"),
        port=int(os.getenv("DB_PORT", "8877")),
        user=os.getenv("DB_USER", "root"),
        password=os.getenv("DB_PASSWORD", "rootpassword"),
        database=os.getenv("DB_NAME", "products_db"),
        cursorclass=pymysql.cursors.DictCursor
    )


# Endpoints
@app.get("/")
def root():
    logger.info("Root endpoint called")
    return {"message": "Products API", "docs": "/docs"}


@app.get("/api/products")
def get_products():
    logger.info("GET /api/products called")
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM products")
    products = cursor.fetchall()
    cursor.close()
    conn.close()
    return products


@app.get("/health")
def health():
    logger.info("Health endpoint called")
    return {"status": "ok"}


# Error Simulation (for logging test)
@app.get("/force-error")
def force_error():
    logger.error("Forced error triggered by user!")
    raise Exception("Forced exception for testing logs")
