Write-Host ""
Write-Host "========================================"
Write-Host "  Pizza Microservices - Starting..."
Write-Host "========================================"
Write-Host ""
Write-Host "Frontend: http://localhost:3005" -ForegroundColor Green
Write-Host "Admin:    http://localhost:3005/admin" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press Ctrl+C to stop"
Write-Host "========================================"
Write-Host ""
kubectl port-forward service/webapp 3005:3005
