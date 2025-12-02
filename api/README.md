# Products API

FastAPI service that exposes product data from MySQL database for the Products microfrontend.

## Features

- RESTful API with `/api/products` endpoint
- MySQL database integration
- Prometheus metrics at `/metrics`
- CORS enabled for Angular microfrontends
- Auto-generated API docs at `/docs`

## Quick Start with Docker

### 1. Start MySQL and API
```bash
# From project root
docker-compose up -d
```

### 2. Seed the Database
```bash
# Wait for containers to be healthy (10-15 seconds)
docker exec -it products-api python seed.py
```

### 3. Test the API
```bash
# Get all products
curl http://localhost:5000/api/products

# Health check
curl http://localhost:5000/health

# Prometheus metrics
curl http://localhost:5000/metrics
```

### 4. View API Documentation
Open: http://localhost:5000/docs

## Local Development (Without Docker)

### Prerequisites
- Python 3.11+
- MySQL running on port 8877

### Setup
```bash
cd api
pip install -r requirements.txt
```

### Run
```bash
# Make sure MySQL is running on port 8877
uvicorn main:app --reload --port 5000
```

### Seed Database
```bash
python seed.py
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products |
| GET | `/api/products/{id}` | Get single product |
| GET | `/health` | Health check |
| GET | `/metrics` | Prometheus metrics |
| GET | `/docs` | API documentation |

## Environment Variables

Configure in `api/.env`:

```env
DB_HOST=localhost
DB_PORT=8877
DB_USER=root
DB_PASSWORD=rootpassword
DB_NAME=products_db
```

## Database Schema

**Table:** `products`

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key |
| name | VARCHAR(255) | Product name |
| category | VARCHAR(100) | Product category |
| price | FLOAT | Product price |
| stock | INT | Stock quantity |

## Integration with Angular

Update Products component to call API:

```typescript
// In ProductService
getProducts(): Observable<Product[]> {
  return this.http.get<Product[]>('http://localhost:5000/api/products');
}
```

## Monitoring

- Prometheus scrapes: `http://localhost:5000/metrics`
- Metrics include: request count, latency, error rates

## Troubleshooting

**Connection refused:**
```bash
# Check if containers are running
docker ps

# Check MySQL health
docker logs products-mysql

# Check API logs
docker logs products-api
```

**Database not seeded:**
```bash
# Re-run seed script
docker exec -it products-api python seed.py
```

**Port 8877 already in use:**
```bash
# Change port in docker-compose.yml and .env
```
