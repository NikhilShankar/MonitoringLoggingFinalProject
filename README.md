# Monitoring Dashboard – Zafar (9027671)

This Grafana dashboard visualizes API performance metrics collected by Prometheus.

### Metrics Displayed
- **http_requests_total** – Total count of HTTP requests
- **Request latency** – Time taken to serve API requests (ms)


### Purpose
These panels help track API traffic and ensure the service is healthy and responding efficiently.

## Screenshots

### 1️⃣ Prometheus Target Health
![Prometheus Targets](screenshots/01-prometheus-targets.png)
_Verifies that Prometheus successfully scrapes API metrics, job state is UP._

### 2️⃣ Grafana Prometheus Data Source
![Grafana Data Source](screenshots/02-grafana-datasource.png)
_Grafana is connected to Prometheus and data source is working._

### 3️⃣ Grafana API Monitoring Dashboard
![Grafana Dashboard](screenshots/03-grafana-dashboard-requests.png)
_API request metrics displayed through the http_requests_total metric._
