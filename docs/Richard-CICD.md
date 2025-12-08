# Richard - GitHub Actions CI/CD

## Your Task

**Set up GitHub Actions to build, test, and optionally deploy the microfrontends and API.**

## What to Build

Create `.github/workflows/ci-cd.yml` that:
1. Builds Products microfrontend
2. Builds Shell microfrontend
3. Builds Python API Docker image
4. Runs tests (optional)
5. Pushes Docker images (optional)

## Basic Workflow File

**Location:** `.github/workflows/ci-cd.yml`

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, master]
  pull_request:
    branches: [main, master]

jobs:
  build-products:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'

      - name: Install dependencies
        run: |
          cd products/products
          npm install

      - name: Build Products
        run: |
          cd products/products
          npm run build

  build-shell:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'

      - name: Install dependencies
        run: |
          cd shell/shell
          npm install

      - name: Build Shell
        run: |
          cd shell/shell
          npm run build

  build-api:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Build Docker Image
        run: |
          cd api
          docker build -t products-api:latest .
```

## Optional: Smart Builds (Only Rebuild Changed Components)

Use path filters to trigger only when specific folders change:

```yaml
on:
  push:
    paths:
      - 'products/**'  # Only trigger when products folder changes
      - 'shell/**'
      - 'api/**'
```

## Optional: Run Tests

Add test step to each job:

```yaml
- name: Run Tests
  run: |
    cd products/products
    npm test -- --watch=false --browsers=ChromeHeadless
```

## Optional: Push Docker Images

Add Docker Hub login and push:

```yaml
- name: Login to Docker Hub
  uses: docker/login-action@v2
  with:
    username: ${{ secrets.DOCKER_USERNAME }}
    password: ${{ secrets.DOCKER_PASSWORD }}

- name: Push Docker Image
  run: |
    docker push products-api:latest
```

## Optional: Deploy

Add deployment step (requires server access):

```yaml
deploy:
  needs: [build-products, build-shell, build-api]
  runs-on: ubuntu-latest
  steps:
    - name: Deploy to Server
      run: |
        # SSH to server and run docker-compose
        ssh user@server 'cd /app && docker-compose pull && docker-compose up -d'
```

## Project Structure

```
.github/
└── workflows/
    └── ci-cd.yml       # Your workflow file

products/products/      # Angular app (port 4201)
shell/shell/            # Angular app (port 4200)
api/                    # Python API + Dockerfile
docker-compose.yml      # MySQL + API containers
```

## How It Works

**Trigger:** Push to GitHub or create Pull Request

**GitHub Actions runs:**
1. Checkout code
2. Install Node.js / Python / Docker
3. Install dependencies
4. Build each component
5. Run tests (if added)
6. Push Docker images (if added)
7. Deploy (if added)

## Test Your Workflow

```bash
# 1. Create workflow file
mkdir -p .github/workflows
# Create ci-cd.yml with content above

# 2. Commit and push
git add .github/workflows/ci-cd.yml
git commit -m "Add CI/CD pipeline"
git push

# 3. Check GitHub Actions tab in repository
# You'll see the workflow running
```

## Key Points

- **docker-compose.yml is NOT run by GitHub Actions** - it's for local dev and deployment
- **GitHub Actions builds/tests** the components
- **docker-compose runs** the components (locally or on server)
- Each job runs independently (can run in parallel)
- Failed builds block the pipeline

## What Nikhil Built

- Python API in `api/` folder
- Dockerfile in `api/Dockerfile`
- docker-compose.yml with MySQL + API
- Products Angular microfrontend connects to API

## What Zafar Will Build

- Prometheus + Grafana in docker-compose.yml
- Your CI/CD can deploy the full stack including monitoring

## Minimal Working Example (Start Here)

Just build everything - no tests, no deployment:

```yaml
name: Build All

on: [push, pull_request]

jobs:
  build-all:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - uses: actions/setup-node@v3
        with:
          node-version: '16'

      - name: Build Products
        run: cd products/products && npm install && npm run build

      - name: Build Shell
        run: cd shell/shell && npm install && npm run build

      - name: Build API Docker
        run: cd api && docker build -t products-api .
```

**This is enough for the assignment!** Add tests/deployment if you want bonus points.
