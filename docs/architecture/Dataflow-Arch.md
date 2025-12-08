Data Flow
User → Shell (4200) → Products Remote (4201) → API (5000) → MySQL (8877)
API → Prometheus → Grafana
Container Logs → Promtail → Loki → Grafana