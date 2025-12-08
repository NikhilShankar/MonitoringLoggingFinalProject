# Zafar - Prometheus & Grafana Monitoring

## Your Task

**Add Prometheus and Grafana to monitor the Python API metrics.**

## What to Do

Add Prometheus + Grafana services to `docker-compose.yml` and configure Prometheus to scrape API metrics.

## Step 1: Create Prometheus Config

**File:** `prometheus.yml` (in project root)

```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'products-api'
    static_configs:
      - targets: ['api:5000']
```

## Step 2: Update docker-compose.yml

Add Prometheus and Grafana services to existing `docker-compose.yml`:

```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    container_name: products-mysql
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: products_db
    ports:
      - "8877:3306"
    volumes:
      - mysql_data:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5

  api:
    build:
      context: ./api
      dockerfile: Dockerfile
    container_name: products-api
    environment:
      DB_HOST: mysql
      DB_PORT: 3306
      DB_USER: root
      DB_PASSWORD: rootpassword
      DB_NAME: products_db
    ports:
      - "5000:5000"
    depends_on:
      mysql:
        condition: service_healthy
    volumes:
      - ./api:/app

  prometheus:
    image: prom/prometheus:latest
    container_name: prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
    depends_on:
      - api

  grafana:
    image: grafana/grafana:latest
    container_name: grafana
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana_data:/var/lib/grafana
    depends_on:
      - prometheus

volumes:
  mysql_data:
  grafana_data:
```

## Step 3: Run Everything

```bash
# Stop existing containers
docker-compose down

# Start with new monitoring services
docker-compose up -d

# Check all services are running
docker ps
```

## Step 4: Access Monitoring

**Prometheus:**
- URL: http://localhost:9090
- Check targets: http://localhost:9090/targets
- Should show `products-api` as UP

**Grafana:**
- URL: http://localhost:3000
- Login: admin / admin
- Add Prometheus data source:
  - Go to Configuration → Data Sources → Add data source
  - Select Prometheus
  - URL: http://prometheus:9090
  - Click "Save & Test"

## Step 5: Create Grafana Dashboard

**Simple dashboard to show API metrics:**

1. Click "+" → "Dashboard" → "Add new panel"
2. In query box, enter: `http_requests_total`
3. Click "Apply"
4. Save dashboard

**Useful Metrics (already exposed by API):**
- `http_requests_total` - Total requests
- `http_request_duration_seconds` - Request latency
- `http_requests_created` - Request timestamps

## What Nikhil Built

- Python API at http://localhost:5000
- **Already exposes `/metrics` endpoint** with Prometheus format
- Uses `prometheus-fastapi-instrumentator` library
- Metrics auto-generated for all API endpoints

## Test the Metrics

```bash
# 1. Call API to generate metrics
curl http://localhost:5000/api/products

# 2. View raw metrics
curl http://localhost:5000/metrics

# 3. Check Prometheus captured them
# Open http://localhost:9090
# Query: http_requests_total
```

## Architecture After Your Changes

```
Browser
   ├─> Shell (4200)
   ├─> Products (4201)
   ├─> API (5000) ────> MySQL (8877)
   ├─> Prometheus (9090) ─┐
   └─> Grafana (3000) ────┘
          ^
          └─ Scrapes /metrics from API every 15s
```

## Files You Create/Modify

```
prometheus.yml           # NEW - Prometheus config
docker-compose.yml       # UPDATE - Add prometheus + grafana
```

## What Richard Will Do

- GitHub Actions will build/deploy all services
- Including Prometheus + Grafana (after you add them)

## Quick Test Checklist

- [ ] Prometheus running on port 9090
- [ ] Grafana running on port 3000
- [ ] Prometheus targets show API as UP
- [ ] Grafana can connect to Prometheus
- [ ] API metrics visible in Grafana dashboard

## Troubleshooting

**Prometheus can't reach API:**
- Check `docker ps` - all containers running?
- Check network: containers in same docker-compose share network
- Try `docker exec prometheus ping api`

**No metrics in Grafana:**
- Verify Prometheus data source URL: `http://prometheus:9090` (NOT localhost)
- Check Prometheus has scraped data: http://localhost:9090/graph

**Grafana login not working:**
- Default: admin / admin
- Reset: `docker-compose down -v` (deletes grafana_data volume)

## Minimal Working Setup (Start Here)

Just get Prometheus scraping API metrics:

1. Create `prometheus.yml` with config above
2. Add `prometheus` service to docker-compose.yml
3. Run `docker-compose up -d`
4. Visit http://localhost:9090/targets
5. Should see API target as UP

**This is enough for the assignment!** Add Grafana dashboards for bonus points.
