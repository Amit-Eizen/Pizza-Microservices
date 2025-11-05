# Pizza Microservices - Documentation

A full-stack pizza ordering system built with microservices architecture.

## What We Built

This project is a **pizza ordering website** split into small, independent services that work together. Each service handles one specific job.

### The Services

1. **Auth Service** - Handles user registration and login
2. **Menu Service** - Manages the pizza menu
3. **Order Service** - Processes orders
4. **API Gateway** - Routes requests to the right service
5. **Webapp** - The website users see and interact with

### What Users Can Do

✅ Sign up and log in
✅ Browse pizza menu
✅ Place orders with delivery info and phone number
✅ Track orders with visual timeline (Placed → Preparing → On the Way → Delivered)
✅ Filter orders by status

## Tech Stack

- **Node.js** + Express - Backend services
- **MongoDB Atlas** - Cloud database (all services share one database)
- **EJS** - Frontend templates
- **Docker** - Package each service in a container
- **Kubernetes** - Run and manage containers

## Quick Start

**Local Development** (easiest):
```bash
cd auth-service && npm start    # Terminal 1
cd menu-service && npm start    # Terminal 2
cd order-service && npm start   # Terminal 3
cd api-gateway && npm start     # Terminal 4
cd webapp && npm start          # Terminal 5
```

Then go to: `http://localhost:3005`

**Docker**:
```bash
docker-compose up
```

**Kubernetes**:
```bash
# Build images
docker build -t pizza-auth-service:latest ./auth-service
docker build -t pizza-menu-service:latest ./menu-service
docker build -t pizza-order-service:latest ./order-service
docker build -t pizza-api-gateway:latest ./api-gateway
docker build -t pizza-webapp:latest ./webapp

# Deploy
kubectl apply -f k8s/
```

Then go to: `http://localhost:30005`

## Documentation

- **[How It Works](./HOW-IT-WORKS.md)** - System architecture explained simply
- **[Setup](./SETUP.md)** - Step-by-step installation
- **[Docker & Kubernetes](./DOCKER-K8S.md)** - Containerization guide
