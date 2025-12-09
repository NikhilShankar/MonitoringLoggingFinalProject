# CI/CD Pipeline Documentation

## 📋 Table of Contents
- [Overview](#overview)
- [Pipeline Architecture](#pipeline-architecture)
- [Pipeline Strategy](#pipeline-strategy)
- [Pipeline Stages](#pipeline-stages)
- [Configuration Files](#configuration-files)
- [Testing Strategy](#testing-strategy)
- [Docker Integration](#docker-integration)
- [Setup Instructions](#setup-instructions)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

This repository implements a comprehensive CI/CD pipeline using GitHub Actions to automate the build, test, and deployment processes for a microservices architecture consisting of:

- **Products Microfrontend** (Angular)
- **Shell Microfrontend** (Angular)
- **Python API** (FastAPI)
- **Supporting Services** (MySQL, Prometheus, Grafana)

The pipeline is designed with efficiency, reliability, and maintainability in mind, using smart builds and parallel execution to optimize CI/CD runtime.

---

## 🏗️ Pipeline Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     GitHub Actions Trigger                   │
│              (Push/PR to main or master branch)              │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
                  ┌────────────────┐
                  │  Changes Job   │
                  │ (Path Filter)  │
                  └────────┬───────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
┌───────────────┐  ┌───────────────┐  ┌──────────────┐
│ Build Products│  │  Build Shell  │  │  Build API   │
│  (if changed) │  │  (if changed) │  │ (if changed) │
└───────┬───────┘  └───────┬───────┘  └──────┬───────┘
        │                  │                  │
        └──────────────────┼──────────────────┘
                           ▼
                ┌──────────────────────┐
                │ Test Docker Compose  │
                │  (Validate & Test)   │
                └──────────-───────────┘
                           
                           
                        

```

---

## 🎯 Pipeline Strategy

### 1. **Smart Builds with Path Filtering**

**Strategy**: Only rebuild components that have actually changed, reducing unnecessary builds and saving CI/CD resources.

**Implementation**:
- Uses `dorny/paths-filter@v2` action to detect file changes
- Each component (products, shell, api) has its own path filter
- Jobs run conditionally based on detected changes

**Benefits**:
- ⚡ Faster pipeline execution (skip unchanged components)
- 💰 Reduced CI/CD costs and resource usage
- 🔄 Efficient use of runner minutes

**Example**:
```yaml
changes:
  outputs:
    products: ${{ steps.filter.outputs.products }}
    shell: ${{ steps.filter.outputs.shell }}
    api: ${{ steps.filter.outputs.api }}
  steps:
    - uses: dorny/paths-filter@v2
      with:
        filters: |
          products:
            - 'products/**'
          shell:
            - 'shell/**'
          api:
            - 'api/**'
```

### 2. **Parallel Job Execution**

**Strategy**: Build and test all components simultaneously rather than sequentially.

**Implementation**:
- Jobs run in parallel when there are no dependencies
- Only synchronize when necessary (e.g., before docker-compose testing)

**Benefits**:
- ⏱️ Reduced total pipeline time (3x faster than sequential)
- 🚀 Faster feedback on pull requests
- 🔄 Independent component testing

### 3. **Conditional Deployment**

**Strategy**: Only push Docker images when changes are merged to the main branch.

**Implementation**:
```yaml
if: github.event_name == 'push' && github.ref == 'refs/heads/main'
```

**Benefits**:
- 🔒 Prevents accidental deployments from feature branches
- 📦 Only production-ready code gets published
- 🎯 Clear separation between testing and deployment

### 4. **Fail-Safe Testing**

**Strategy**: Continue pipeline execution even if previous jobs fail (with `always()` and `!cancelled()` conditions).

**Implementation**:
```yaml
if: |
  always() && 
  !cancelled() &&
  (needs.changes.outputs.api == 'true' || ...)
```

**Benefits**:
- 🔍 Complete visibility into all component failures
- 🐛 Better debugging (see all failures, not just the first)
- ✅ Docker Compose tests run even if frontend tests fail

### 5. **Caching Strategy**

**Strategy**: Cache dependencies and Docker layers to speed up builds.

**Implementation**:
- npm dependencies cached by `actions/setup-node@v3`
- Docker layers cached using GitHub Actions cache (`type=gha`)

**Benefits**:
- ⚡ 3-5x faster dependency installation
- 💾 Reduced bandwidth usage
- 🚀 Faster Docker image builds

---

## 🔄 Pipeline Stages

### Stage 1: Change Detection
**Purpose**: Identify which components have been modified

**Actions**:
- Checkout repository
- Run path filters to detect changes in `products/`, `shell/`, `api/`, and `docker-compose.yml`
- Output boolean flags for each component

**Duration**: ~10-15 seconds

---

### Stage 2: Parallel Builds

#### 2a. Build Products Microfrontend
**Runs when**: Files in `products/**` change

**Steps**:
1. Setup Node.js 16 with npm cache
2. Install dependencies (`npm ci`)
3. Run Karma unit tests in headless Chrome
4. Build production bundle (`npm run build`)
5. Upload build artifacts

**Duration**: ~2-3 minutes

**Test Coverage**:
- 5 unit tests for ProductsComponent
- Component creation validation
- DOM rendering tests
- Data display verification

---

#### 2b. Build Shell Microfrontend
**Runs when**: Files in `shell/**` change

**Steps**:
1. Setup Node.js 16 with npm cache
2. Install dependencies (`npm ci`)
3. Run Karma unit tests in headless Chrome
4. Run Cypress E2E tests (with error tolerance)
5. Build production bundle (`npm run build`)
6. Upload build artifacts
7. Upload Cypress screenshots/videos (on failure)

**Duration**: ~3-4 minutes

**Test Coverage**:
- 3 Karma unit tests
- 1 Cypress integration test (skipped in CI)
- Component and module federation tests

---

#### 2c. Build API Docker Image
**Runs when**: Files in `api/**` change

**Steps**:
1. Setup Docker Buildx
2. Build Docker image with layer caching
3. Tag image as `products-api:latest`

**Duration**: ~1-2 minutes (with cache)

---

### Stage 3: Docker Compose Integration Testing
**Runs when**: API, Products, Shell, or docker-compose.yml changes

**Steps**:
1. Validate docker-compose.yml syntax
2. Build all services (MySQL, API, Products, Shell, Prometheus, Grafana)
3. Start all containers
4. Wait for services to initialize (45 seconds)
5. Run health checks:
   - MySQL connection test
   - API health endpoint
   - Products microfrontend (port 4201)
   - Shell microfrontend (port 4200)
   - Prometheus health check
   - Grafana health check
6. Display logs on failure
7. Cleanup containers and volumes

**Duration**: ~3-5 minutes

**Validation**:
- ✅ All services start successfully
- ✅ Services respond to health checks
- ✅ Inter-service communication works
- ✅ No configuration errors

---

## 📁 Configuration Files

### `.github/workflows/ci-cd.yml`
Main pipeline configuration file defining all jobs, steps, and conditional logic.



## 🧪 Testing Strategy

### Unit Testing (Karma/Jasmine)
**Framework**: Karma + Jasmine + Chrome Headless

**Approach**:
- Test components in isolation
- Mock external dependencies (HttpClient, Services)
- Validate DOM rendering and user interactions

**Configuration**:
```yaml
npm test -- --no-watch --browsers=ChromeHeadless --code-coverage=false
```

**Advantages**:
- ⚡ Fast execution (runs in headless browser)
- 🔒 Reliable (no external dependencies)
- 🎯 Focused (tests one component at a time)

---

### E2E Testing (Cypress)
**Framework**: Cypress

**Approach**:
- Test user workflows across components
- Validate microfrontend integration
- Skip tests requiring external services in CI

**Configuration**:
```yaml
npx cypress run --headless --browser chrome
continue-on-error: true
```

**Advantages**:
- 📸 Screenshot/video capture on failure
- 🔄 Real browser testing
- 🎭 User behavior simulation

---

### Integration Testing (Docker Compose)
**Framework**: Docker Compose + curl

**Approach**:
- Start complete application stack
- Test inter-service communication
- Validate health endpoints

**Validation Tests**:
```bash
# MySQL
docker-compose exec -T mysql mysqladmin ping

# API
curl -f http://localhost:5000/health

# Microfrontends
curl -f http://localhost:4200
curl -f http://localhost:4201

# Monitoring
curl -f http://localhost:9090/-/healthy
curl -f http://localhost:3000/api/health
```

---

## 🐳 Docker Integration

### Services Defined in docker-compose.yml

| Service | Port | Purpose |
|---------|------|---------|
| MySQL | 8877 | Database |
| API | 5000 | Python FastAPI backend |
| Products | 4201 | Products microfrontend |
| Shell | 4200 | Shell microfrontend |
| Prometheus | 9090 | Metrics collection |
| Grafana | 3000 | Metrics visualization |

### Health Check Strategy
- MySQL: `mysqladmin ping` command
- API: Custom health endpoint
- Frontends: HTTP GET request
- Prometheus: Built-in health endpoint
- Grafana: API health endpoint

---

## 🚀 Setup Instructions

### Prerequisites
- GitHub repository with Actions enabled
- Docker Hub account (for image pushing)
- Node.js 16+ (for local development)
- Docker and Docker Compose (for local testing)

### 1. Configure Repository Secrets

Navigate to: `Repository → Settings → Secrets and variables → Actions`

Add the following secrets:
- `DOCKER_USERNAME`: Your Docker Hub username
- `DOCKER_PASSWORD`: Your Docker Hub password or access token

### 2. Enable GitHub Actions

1. Go to the **Actions** tab in your repository
2. Enable workflows if not already enabled
3. The pipeline will automatically run on push/PR to main/master

### 3. Local Testing

Test the pipeline components locally:

```bash
# Test Products build
cd products/products
npm ci
npm test
npm run build

# Test Shell build
cd shell/shell
npm ci
npm test
npm run build

# Test Docker Compose
docker-compose config
docker-compose build
docker-compose up -d
docker-compose ps
docker-compose down -v

# Test API build
cd api
docker build -t products-api:latest .
```

### 4. Trigger Pipeline

The pipeline automatically triggers on:
- Push to `main` or `master` branch
- Pull request to `main` or `master` branch

Manual trigger:
1. Go to **Actions** tab
2. Select **CI/CD Pipeline** workflow
3. Click **Run workflow**

---

## 🐛 Troubleshooting

### Common Issues

#### Tests Fail: "No provider for ProductService"
**Solution**: Add `ProductService` to test providers and import `HttpClientTestingModule`

```typescript
TestBed.configureTestingModule({
  declarations: [ProductsComponent],
  imports: [HttpClientTestingModule],
  providers: [ProductService]
});
```

---

#### Tests Fail: "Cannot find type definition for 'jasminewd2'"
**Solution**: Remove `jasminewd2` from `tsconfig.spec.json` types array

```json
{
  "compilerOptions": {
    "types": ["jasmine"]  // Remove "jasminewd2" and "node"
  }
}
```

---

#### Docker Compose Test Fails: "Service not responding"
**Solution**: Increase wait time in pipeline or check service logs

```yaml
- name: Wait for services
  run: |
    sleep 60  # Increase from 45 to 60 seconds
    docker-compose logs
```

---

#### Cypress Tests Fail: "Failed to fetch"
**Solution**: Integration tests requiring external services should be skipped in CI

```typescript
if (typeof process !== 'undefined' && process.env['CI']) {
  pending('Skipped in CI');
  return;
}
```

---

#### Docker Push Fails: "Authentication required"
**Solution**: Verify Docker Hub secrets are configured correctly

```bash
# Check secrets are set in repository settings
Repository → Settings → Secrets and variables → Actions
```

---

