# Monitoring Setup

This folder contains the Grafana provisioning configuration for automatic dashboard and datasource setup.

## Structure

```
monitoring/
└── provisioning/
    ├── datasources/
    │   └── prometheus.yml          # Prometheus datasource configuration
    └── dashboards/
        ├── dashboard.yml           # Dashboard provisioning config
        ├── products-api-dashboard.json    # API monitoring dashboard
        └── system-overview-dashboard.json # System overview dashboard
```

## Features

### Automatic Provisioning
When you run `docker-compose up`, Grafana will automatically:
- Configure Prometheus as the default datasource
- Load pre-configured dashboards
- Be ready to use immediately

### Dashboards Included

#### 1. Products API Dashboard
Comprehensive monitoring for the Products API including:
- API Status indicator
- Request rate graphs
- Response time metrics (95th percentile)
- HTTP status code distribution
- CPU usage
- Memory usage
- Request counts by route

#### 2. System Overview Dashboard
High-level system monitoring including:
- Service health status
- Total request counts
- Error tracking (5xx errors)
- Request rate over time
- HTTP method distribution
- Response time percentiles (p50, p90, p95, p99)

## Access

After running `docker-compose up`:
- Grafana UI: http://localhost:3000
- Default credentials:
  - Username: `admin`
  - Password: `admin`

## Customization

All dashboards are editable through the Grafana UI. Changes can be:
- Saved directly in Grafana (stored in the grafana_data volume)
- Exported as JSON and committed to this folder for team sharing

To export a dashboard:
1. Open the dashboard in Grafana
2. Click the Share icon
3. Go to "Export" tab
4. Click "Save to file"
5. Save the JSON to `monitoring/provisioning/dashboards/`

## Metrics

The dashboards expect the following Prometheus metrics from the API:
- `up` - Service availability
- `http_requests_total` - Total HTTP requests with labels (method, route, status_code)
- `http_request_duration_seconds` - Request duration histogram
- `process_cpu_seconds_total` - CPU usage
- `process_resident_memory_bytes` - Memory usage

Make sure your API exports these metrics for full dashboard functionality.
