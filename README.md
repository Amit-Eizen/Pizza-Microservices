# 🍕 Pizza Microservices

A pizza ordering system built with Microservices Architecture using Docker and Kubernetes

## 🛠️ Tech Stack

- **Backend**: Node.js + Express
- **Frontend**: EJS Templates
- **Database**: MongoDB
- **Container**: Docker
- **Orchestration**: Kubernetes
- **Auth**: JWT

## 🏗️ Architecture

Frontend (EJS) ↓ API Gateway ↓ ├─→ Auth Service (Login/Register) ├─→ Menu Service (Pizza Menu) └─→ Order Service (Orders) ↓ MongoDB

## 📁 Project Structure

pizza-microservices/ ├── frontend/ # EJS UI ├── api-gateway/ # API Gateway ├── auth-service/ # Authentication ├── menu-service/ # Menu CRUD ├── order-service/ # Orders └── k8s/ # Kubernetes configs

## 🚀 Installation & Running

### Prerequisites
- Node.js v18+
- Docker Desktop
- Kubernetes enabled
- kubectl

### Run Locally

```bash
# Clone
git clone https://github.com/Amit-Eizen/pizza-microservices.git


# Frontend
cd frontend
npm install
npm start
Deploy to Kubernetes
# Build images
docker build -t pizza/frontend ./frontend
docker build -t pizza/auth-service ./auth-service
docker build -t pizza/menu-service ./menu-service
docker build -t pizza/order-service ./order-service
docker build -t pizza/api-gateway ./api-gateway

# Deploy
kubectl apply -f k8s/

# Access
kubectl port-forward service/frontend 3000:3000
📝 Features
✅ User registration and login
✅ Browse pizza menu
✅ Place orders
✅ Track order history
🎓 Learning Goals
Microservices Architecture
Docker & Kubernetes
Service Communication
API Gateway Pattern
JWT Authentication
EJS Templates

💻 Author
Amit Eizenberg