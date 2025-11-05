# 🍕 Pizza Microservices

A full-stack pizza ordering system demonstrating **microservices architecture** with **Docker** and **Kubernetes**.

![Node.js](https://img.shields.io/badge/Node.js-18-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)
![Docker](https://img.shields.io/badge/Docker-Ready-blue)
![Kubernetes](https://img.shields.io/badge/Kubernetes-Deployed-blue)

## 🎯 What This Project Demonstrates

- **Microservices Architecture** - 4 independent services working together
- **Docker Containerization** - Each service packaged in a container
- **Kubernetes Orchestration** - Auto-scaling, self-healing, load balancing
- **API Gateway Pattern** - Centralized routing and request handling
- **Real-World Problems** - Solutions to actual challenges (body streaming, service discovery)

## ✨ Features

- 👤 **User Authentication** - Sign up, login with JWT
- 🍕 **Pizza Menu** - Browse and select pizzas
- 🛒 **Order Placement** - Add delivery details and phone number
- 📦 **Order Tracking** - Visual timeline (Placed → Preparing → On the Way → Delivered)
- 🔍 **Status Filtering** - Filter orders by status
- 📱 **Responsive Design** - Works on mobile and desktop

## 🏗️ Architecture

```
User Browser
    ↓
Webapp (Port 3005)
    ↓
API Gateway (Port 4000) ← Single entry point
    ↓
    ├─→ Auth Service (3001)    - Authentication
    ├─→ Menu Service (3002)    - Pizza menu
    └─→ Order Service (3003)   - Orders
         ↓
    MongoDB Atlas (Cloud Database)
```

**Why this architecture?** See [docs/WHY.md](docs/WHY.md)

## 🛠️ Tech Stack

**Backend**
- Node.js 18 + Express
- MongoDB Atlas (Cloud)
- JWT Authentication
- bcrypt for passwords

**Frontend**
- EJS templating
- Vanilla JavaScript
- Modern CSS with animations

**DevOps**
- Docker (containerization)
- Kubernetes (orchestration)
- Docker Compose (local development)

## 🚀 Quick Start

### Option 1: Kubernetes (Full Experience)

```bash
# 1. Build Docker images
docker build -t pizza-auth-service:latest ./auth-service
docker build -t pizza-menu-service:latest ./menu-service
docker build -t pizza-order-service:latest ./order-service
docker build -t pizza-api-gateway:latest ./api-gateway
docker build -t pizza-webapp:latest ./webapp

# 2. Deploy to Kubernetes
kubectl apply -f k8s/

# 3. Check status
kubectl get pods

# 4. Access the app
open http://localhost:30005
```

### Option 2: Docker Compose (Easier)

```bash
docker-compose up
open http://localhost:3005
```

### Option 3: Local Development

```bash
# Install dependencies for all services
cd auth-service && npm install && cd ..
cd menu-service && npm install && cd ..
cd order-service && npm install && cd ..
cd api-gateway && npm install && cd ..
cd webapp && npm install && cd ..

# Start each service in a separate terminal
npm start  # in each service directory
```

**Full setup instructions:** [docs/SETUP.md](docs/SETUP.md)

## 📚 Documentation

- **[How It Works](docs/HOW-IT-WORKS.md)** - Architecture explained simply
- **[Why This Architecture?](docs/WHY.md)** - Design decisions explained
- **[Setup Guide](docs/SETUP.md)** - Step-by-step installation
- **[Docker & Kubernetes](docs/DOCKER-K8S.md)** - Containerization explained

## 🎓 What You'll Learn

✅ How to split a monolith into microservices
✅ Docker containerization best practices
✅ Kubernetes deployment and management
✅ API Gateway pattern implementation
✅ Service-to-service communication
✅ Request body streaming in proxies
✅ MongoDB Atlas integration
✅ JWT authentication
✅ Real-world problem solving

## 🔧 Key Implementation Details

### Problem Solved: API Gateway Body Streaming

**Challenge:** Express middleware consumes request body before proxy forwards it.

**Solution:** Re-stream the body in the proxy middleware:
```javascript
onProxyReq: (proxyReq, req, res) => {
  if (req.body && req.method === 'POST') {
    const bodyData = JSON.stringify(req.body);
    proxyReq.write(bodyData);
  }
}
```

[Read more about challenges](docs/DOCKER-K8S.md)

## 📁 Project Structure

```
Pizza-Microservices/
├── auth-service/          # User authentication
├── menu-service/          # Pizza menu CRUD
├── order-service/         # Order processing
├── api-gateway/           # Request routing
├── webapp/                # Frontend
├── k8s/                   # Kubernetes configs
├── docs/                  # Documentation
├── docker-compose.yml     # Docker Compose
└── README.md
```

## 🎨 UI Highlights

- **Order Timeline** - Visual progress indicator with status icons
- **Status Filters** - Quick filtering by order status
- **Responsive Cards** - Modern card-based design
- **Form Validation** - Real-time input validation
- **Success Animations** - Smooth transitions and feedback

## 🔒 Security

- Passwords hashed with bcrypt
- JWT tokens for authentication
- HTTP-only cookies
- Input validation
- MongoDB injection prevention

## 🚧 Future Enhancements

- [ ] Separate databases per service
- [ ] Message queue (RabbitMQ/Kafka)
- [ ] Real-time order updates (WebSockets)
- [ ] Admin dashboard
- [ ] Payment integration
- [ ] Email notifications
- [ ] Comprehensive tests
- [ ] CI/CD pipeline

## 💻 Author

**Amit Eizenberg**

[LinkedIn](https://www.linkedin.com/in/amit-eizenberg) | [GitHub](https://github.com/Amit-Eizen)

## 📄 License

MIT License - Feel free to use for learning and portfolio projects!

## 🙏 Acknowledgments

Built as a learning project to understand modern microservices architecture and cloud-native development practices.

---

**⭐ Star this repo if you found it helpful!**
