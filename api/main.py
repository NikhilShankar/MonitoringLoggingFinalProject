from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from prometheus_fastapi_instrumentator import Instrumentator
import pymysql
import os
import logging
from pythonjsonlogger import jsonlogger

# -------------------------------------------------
# JSON Logging configuration
# -------------------------------------------------
logHandler = logging.StreamHandler()
formatter = jsonlogger.JsonFormatter(
    '%(asctime)s %(levelname)s %(name)s %(message)s'
)
logHandler.setFormatter(formatter)

logger = logging.getLogger("products-api")
logger.setLevel(logging.INFO)
logger.addHandler(logHandler)


# -------------------------------------------------
# FastAPI
# -------------------------------------------------
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

Instrumentator().instrument(app).expose(app)


# -------------------------------------------------
# DB Connection
# -------------------------------------------------
def get_db_connection():
    return pymysql.connect(
        host=os.getenv("DB_HOST", "localhost"),
        port=int(os.getenv("DB_PORT", "8877")),
        user=os.getenv("DB_USER", "root"),
        password=os.getenv("DB_PASSWORD", "rootpassword"),
        database=os.getenv("DB_NAME", "products_db"),
        cursorclass=pymysql.cursors.DictCursor
    )


# -------------------------------------------------
# Endpoints
# -------------------------------------------------
@app.get("/")
async def root(request: Request):

    logger.info(
        "root_called",
        extra={
            "client": request.client.host,
            "method": request.method,
            "endpoint": request.url.path,
        }
    )

    return {"message": "Products API", "docs": "/docs"}


@app.get("/api/products")
async def get_products(request: Request):

    logger.info(
        "request_products",
        extra={
            "client": request.client.host,
            "method": request.method,
            "endpoint": request.url.path,
        }
    )

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM products")
    products = cursor.fetchall()
    cursor.close()
    conn.close()

    return products


@app.get("/health")
async def health(request: Request):

    logger.info(
        "health_check",
        extra={
            "client": request.client.host,
            "method": request.method,
            "endpoint": request.url.path,
        }
    )

    return {"status": "ok"}


# -------------------------------------------------
# Error Simulation (for logging)
# -------------------------------------------------
@app.get("/force-error")
async def force_error(request: Request):

    logger.error(
        "forced_error",
        extra={
            "client": request.client.host,
            "method": request.method,
            "endpoint": request.url.path,
        }
    )

    raise Exception("Forced Exception for logging demonstration")
