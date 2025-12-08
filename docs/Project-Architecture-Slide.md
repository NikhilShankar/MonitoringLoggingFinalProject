
Project Architecture

Frontend Layer
Shell Microfrontend - Port 4200 - Angular host application with Module Federation
Products Microfrontend - Port 4201 - Angular remote module for product catalog
Communication - Module Federation loads Products into Shell at runtime

Backend Layer
FastAPI Service - Port 5000 - RESTful API with /api/products endpoint
MySQL Database - Port 8877 - Products database (id, name, category, price, stock)
Communication - FastAPI queries MySQL using raw SQL

Monitoring & Logging Layer
Prometheus - Port 9090 - Scrapes /metrics from FastAPI every 15 seconds
Grafana - Port 3000 - Visualizes metrics and logs via dashboards
Loki - Centralized log aggregation service
Promtail - Collects and forwards container logs to Loki

Infrastructure Layer
Docker Compose - Orchestrates all services in containers
GitHub Actions - CI/CD pipeline builds Shell, Products, and API
Nginx - Serves production builds of microfrontends

Data Flow
User → Shell (4200) → Products Remote (4201) → API (5000) → MySQL (8877)
API → Prometheus → Grafana
Container Logs → Promtail → Loki → Grafana

Technology Stack
Frontend: Angular 16, Module Federation, TypeScript
Backend: Python, FastAPI, PyMySQL
Database: MySQL 8.0
Monitoring: Prometheus, Grafana, Loki, Promtail
Infrastructure: Docker, Docker Compose, Nginx
CI/CD: GitHub Actions
