Monitoring & Logging Layer
Prometheus - Port 9090 - Scrapes /metrics from FastAPI every 15 seconds
Grafana - Port 3000 - Visualizes metrics and logs via dashboards
Loki - Centralized log aggregation service
Promtail - Collects and forwards container logs to Loki