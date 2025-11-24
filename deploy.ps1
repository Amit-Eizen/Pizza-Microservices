Write-Host ""
Write-Host "========================================"
Write-Host "  Pizza Microservices - Deployment"
Write-Host "========================================"
Write-Host ""

# Check if Docker is running
Write-Host "Checking Docker..." -ForegroundColor Yellow
$dockerRunning = docker info 2>&1 | Select-String "Server Version"
if (-not $dockerRunning) {
    Write-Host "ERROR: Docker is not running!" -ForegroundColor Red
    Write-Host "Please start Docker Desktop and try again." -ForegroundColor Red
    exit 1
}
Write-Host "Docker is running" -ForegroundColor Green
Write-Host ""

# Check if Kubernetes is enabled
Write-Host "Checking Kubernetes..." -ForegroundColor Yellow
$k8sRunning = kubectl cluster-info 2>&1 | Select-String "Kubernetes"
if (-not $k8sRunning) {
    Write-Host "ERROR: Kubernetes is not running!" -ForegroundColor Red
    Write-Host "Please enable Kubernetes in Docker Desktop settings." -ForegroundColor Red
    exit 1
}
Write-Host "Kubernetes is running" -ForegroundColor Green
Write-Host ""

# Build Docker images
Write-Host "Building Docker images..." -ForegroundColor Yellow
Write-Host "This may take a few minutes..." -ForegroundColor Cyan
Write-Host ""

Write-Host "[1/5] Building Auth Service..." -ForegroundColor Cyan
docker build -t auth-service:latest ./auth-service
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to build auth-service" -ForegroundColor Red
    exit 1
}

Write-Host "[2/5] Building Menu Service..." -ForegroundColor Cyan
docker build -t menu-service:latest ./menu-service
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to build menu-service" -ForegroundColor Red
    exit 1
}

Write-Host "[3/5] Building Order Service..." -ForegroundColor Cyan
docker build -t order-service:latest ./order-service
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to build order-service" -ForegroundColor Red
    exit 1
}

Write-Host "[4/5] Building API Gateway..." -ForegroundColor Cyan
docker build -t api-gateway:latest ./api-gateway
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to build api-gateway" -ForegroundColor Red
    exit 1
}

Write-Host "[5/5] Building WebApp..." -ForegroundColor Cyan
docker build -t webapp:latest ./webapp
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to build webapp" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "All images built successfully!" -ForegroundColor Green
Write-Host ""

# Apply Kubernetes configurations
Write-Host "Deploying to Kubernetes..." -ForegroundColor Yellow
Write-Host ""

kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/mongodb-deployment.yaml
kubectl apply -f k8s/auth-service-deployment.yaml
kubectl apply -f k8s/menu-service-deployment.yaml
kubectl apply -f k8s/order-service-deployment.yaml
kubectl apply -f k8s/api-gateway-deployment.yaml
kubectl apply -f k8s/webapp-deployment.yaml

Write-Host ""
Write-Host "Waiting for pods to be ready..." -ForegroundColor Yellow
Write-Host "This may take a minute..." -ForegroundColor Cyan
Start-Sleep -Seconds 10

Write-Host ""
Write-Host "Current pod status:" -ForegroundColor Yellow
kubectl get pods

Write-Host ""
Write-Host "========================================"
Write-Host "  Deployment Complete!"
Write-Host "========================================"
Write-Host ""
Write-Host "To start the application, run:" -ForegroundColor Green
Write-Host "  .\start.ps1" -ForegroundColor Cyan
Write-Host ""
Write-Host "To check pod status:" -ForegroundColor Yellow
Write-Host "  kubectl get pods" -ForegroundColor Cyan
Write-Host ""
Write-Host "To view logs:" -ForegroundColor Yellow
Write-Host "  kubectl logs <pod-name>" -ForegroundColor Cyan
Write-Host ""
