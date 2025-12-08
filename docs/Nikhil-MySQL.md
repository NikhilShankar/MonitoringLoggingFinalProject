# Nikhil - MySQL API Integration

## What Was Built

**Python FastAPI service that replaces hardcoded products with MySQL database.**

## Architecture

```
Shell Microfrontend (4200)
    └─> Products Microfrontend (4201)
            └─> Python API (5000)
                    └─> MySQL (8877)
```

## Components

### 1. MySQL Database
- **Port:** 8877
- **Database:** products_db
- **Table:** products (id, name, category, price, stock)
- **Runs in:** Docker container

### 2. Python FastAPI
- **Port:** 5000
- **Endpoints:**
  - `GET /api/products` - Returns all products from MySQL
  - `GET /health` - Health check
  - `GET /metrics` - Prometheus metrics (for Zafar)
  - `GET /docs` - API documentation
- **Tech:** FastAPI + pymysql (raw SQL, no ORM)
- **Runs in:** Docker container

### 3. Products Microfrontend (Angular)
- **Port:** 4201
- **What changed:**
  - Created `ProductService` with HttpClient
  - Calls `http://localhost:5000/api/products`
  - Replaced hardcoded HTML table with `*ngFor`
- **Fix applied:** Removed `providedIn: 'root'` to avoid circular dependency in Module Federation

### 4. Shell Microfrontend (Angular)
- **Port:** 4200
- **Role:** Host app that loads Products remote
- **No changes needed**

## How to Run

```bash
# 1. Start MySQL + API
docker-compose up -d

# 2. Seed database
docker exec -it products-api python seed.py

# 3. Start Products microfrontend
cd products/products
npm start

# 4. Start Shell microfrontend
cd shell/shell
npm start

# 5. Test
# Open http://localhost:4200
# Click "Go to Products"
# Products load from MySQL!
```

## Key Files

```
api/
├── main.py              # FastAPI with raw SQL queries
├── seed.py              # Database seeder
├── requirements.txt     # 4 dependencies only
└── Dockerfile

docker-compose.yml       # MySQL + API containers

products/products/src/app/products/
├── product.model.ts     # Product interface
├── product.service.ts   # API HTTP calls
├── products.component.ts   # Uses ProductService
└── products.module.ts   # Provides ProductService
```

## Data Flow

1. User opens Shell (http://localhost:4200)
2. Clicks "Go to Products"
3. Shell loads Products remote via Module Federation
4. ProductsComponent calls ProductService.getProducts()
5. ProductService makes HTTP call to http://localhost:5000/api/products
6. FastAPI queries MySQL: `SELECT * FROM products`
7. Returns JSON to Angular
8. Products display in table with *ngFor

## For Richard (CI/CD)
- API runs in Docker
- Build Docker image in GitHub Actions
- Run `docker-compose up` for deployment

## For Zafar (Monitoring)
- API exposes `/metrics` endpoint
- Configure Prometheus to scrape http://localhost:5000/metrics
- Add Prometheus + Grafana to docker-compose.yml
