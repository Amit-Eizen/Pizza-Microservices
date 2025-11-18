@echo off
echo.
echo ========================================
echo   Pizza Microservices - Starting...
echo ========================================
echo.
echo Frontend: http://localhost:3005
echo Admin:    http://localhost:3005/admin
echo.
echo Press Ctrl+C to stop
echo ========================================
echo.
kubectl port-forward service/webapp 3005:3005
