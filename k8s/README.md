# Kubernetes Deployment Guide

This guide explains how to deploy the Pizza Microservices system on Kubernetes.

## Prerequisites

1. **Docker Desktop** installed with Kubernetes enabled
2. **kubectl** installed and configured

## Step 1: Build Docker Images

Before running Kubernetes, build the images for all services:

```bash
# Auth Service
docker build -t pizza-auth-service:latest ./auth-service

# Menu Service
docker build -t pizza-menu-service:latest ./menu-service

# Order Service
docker build -t pizza-order-service:latest ./order-service

# API Gateway
docker build -t pizza-api-gateway:latest ./api-gateway

# Webapp
docker build -t pizza-webapp:latest ./webapp
```

## Step 2: Deploy to Kubernetes

Apply all configuration files in the correct order:

```bash
# 1. MongoDB (with PVC)
kubectl apply -f k8s/mongodb-deployment.yaml

# 2. Wait for MongoDB to be ready
kubectl wait --for=condition=ready pod -l app=mongodb --timeout=60s

# 3. Microservices
kubectl apply -f k8s/auth-service-deployment.yaml
kubectl apply -f k8s/menu-service-deployment.yaml
kubectl apply -f k8s/order-service-deployment.yaml

# 4. Wait for services to be ready
kubectl wait --for=condition=ready pod -l app=auth-service --timeout=60s
kubectl wait --for=condition=ready pod -l app=menu-service --timeout=60s
kubectl wait --for=condition=ready pod -l app=order-service --timeout=60s

# 5. API Gateway
kubectl apply -f k8s/api-gateway-deployment.yaml
kubectl wait --for=condition=ready pod -l app=api-gateway --timeout=60s

# 6. Webapp
kubectl apply -f k8s/webapp-deployment.yaml
```

## Step 3: Check Status

Verify all pods are running:

```bash
kubectl get pods
kubectl get services
```

## Step 4: Access Application

The application is accessible via NodePort:

```
http://localhost:30005
```

## Useful Commands

### View Logs
```bash
# Auth Service
kubectl logs -l app=auth-service -f

# Menu Service
kubectl logs -l app=menu-service -f

# Order Service
kubectl logs -l app=order-service -f

# API Gateway
kubectl logs -l app=api-gateway -f

# Webapp
kubectl logs -l app=webapp -f

# MongoDB
kubectl logs -l app=mongodb -f
```

### Check Deployment Status
```bash
kubectl get deployments
kubectl describe deployment auth-service
```

### Delete Everything
```bash
kubectl delete -f k8s/webapp-deployment.yaml
kubectl delete -f k8s/api-gateway-deployment.yaml
kubectl delete -f k8s/order-service-deployment.yaml
kubectl delete -f k8s/menu-service-deployment.yaml
kubectl delete -f k8s/auth-service-deployment.yaml
kubectl delete -f k8s/mongodb-deployment.yaml
```

Or delete everything at once:
```bash
kubectl delete -f k8s/
```

## Architecture

```
┌──────────────┐
│   Browser    │
└──────┬───────┘
       │ :30005
       ▼
┌──────────────┐
│   Webapp     │
│   (NodePort) │
└──────┬───────┘
       │ :4000
       ▼
┌──────────────┐
│ API Gateway  │
│  (ClusterIP) │
└──────┬───────┘
       │
       ├──────► Auth Service (3001)
       ├──────► Menu Service (3002)
       └──────► Order Service (3003)
              │
              ▼
        ┌──────────┐
        │ MongoDB  │
        │  (27017) │
        └──────────┘
```

## Scaling

To increase the number of replicas:

```bash
kubectl scale deployment auth-service --replicas=3
kubectl scale deployment menu-service --replicas=3
kubectl scale deployment order-service --replicas=3
kubectl scale deployment api-gateway --replicas=3
kubectl scale deployment webapp --replicas=3
```

## Troubleshooting

If a pod is not starting:
```bash
kubectl describe pod <pod-name>
kubectl logs <pod-name>
```

If MongoDB is not connecting:
```bash
kubectl exec -it <mongodb-pod-name> -- mongosh -u admin -p password123
```
