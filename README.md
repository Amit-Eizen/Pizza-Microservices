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

### User Features
- 👤 **User Authentication** - Sign up, login with JWT tokens
- 🍕 **Pizza Menu** - Browse pizzas with images and prices
- 🛒 **Order Placement** - Add to cart, delivery details, phone number
- 📦 **Order Tracking** - Visual timeline showing order progress
- 📱 **Responsive Design** - Works on mobile and desktop
- 🎨 **Modern UI** - Purple gradient theme with smooth animations

### Admin Features
- 🔐 **Admin Dashboard** - View all orders in real-time
- 📊 **Order Management** - Update order status (Placed → Preparing → On the Way → Delivered)
- 🗑️ **Delete Orders** - Remove completed orders
- 🍕 **Menu Management** - Add, edit, delete pizzas
- 📸 **Image Upload** - Upload pizza images or choose from presets
- 🎯 **Live Preview** - See image preview before saving

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

## 📋 Prerequisites

Before you start, make sure you have:

### Required Software

1. **Docker Desktop** (includes Kubernetes)
   - Download: https://www.docker.com/products/docker-desktop
   - Version: Latest stable version
   - **Important:** Enable Kubernetes in Docker Desktop settings

2. **Node.js** (for local development)
   - Download: https://nodejs.org
   - Version: 18.x or higher
   - Includes npm (package manager)

3. **MongoDB Atlas Account** (Free)
   - Sign up: https://www.mongodb.com/cloud/atlas
   - Create a free cluster
   - Get your connection string

### Verify Installation

```powershell
# Check Docker
docker --version
docker ps

# Check Kubernetes
kubectl version
kubectl cluster-info

# Check Node.js
node --version
npm --version
```

## 🚀 Quick Start

### Windows (PowerShell)

**First Time Setup:**

```powershell
# 1. Clone the repository
git clone <your-repo-url>
cd Pizza-Microservices

# 2. Create .env files (see Configuration section below)

# 3. Deploy everything (builds images and deploys to Kubernetes)
.\deploy.ps1

# 4. Start the application (opens port-forward)
.\start.ps1

# 5. Open browser
# http://localhost:3005
```

**After First Setup:**

```powershell
# Just start the application
.\start.ps1

# To stop: Press Ctrl+C
```

**After Code Changes:**

```powershell
# Rebuild and redeploy
.\deploy.ps1

# Then start
.\start.ps1
```

### Linux/Mac (Bash)

```bash
# 1. Make deployment easier - run all at once
kubectl apply -f k8s/

# 2. Wait for pods to be ready
kubectl get pods

# 3. Port forward
kubectl port-forward service/webapp 3005:3005

# 4. Open browser
open http://localhost:3005
```

## ⚙️ Configuration

### Environment Variables

Each service needs a `.env` file. Create these files:

**auth-service/.env**
```env
PORT=3001
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key_here
```

**menu-service/.env**
```env
PORT=3002
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key_here
```

**order-service/.env**
```env
PORT=3003
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key_here
```

**api-gateway/.env**
```env
PORT=4000
AUTH_SERVICE_URL=http://auth-service:3001
MENU_SERVICE_URL=http://menu-service:3002
ORDER_SERVICE_URL=http://order-service:3003
```

**webapp/.env**
```env
PORT=3005
API_GATEWAY_URL=http://api-gateway:4000
AUTH_SERVICE_URL=http://auth-service:3001
MENU_SERVICE_URL=http://menu-service:3002
ORDER_SERVICE_URL=http://order-service:3003
JWT_SECRET=your_super_secret_jwt_key_here
```

**Important:** Replace `your_mongodb_atlas_connection_string` with your actual MongoDB Atlas connection string.

## 🎯 Access the Application

- **Frontend:** http://localhost:3005
- **Admin Panel:** http://localhost:3005/admin

**Test Credentials:**
- Create a new account through the signup page
- First user will be created as admin (if needed)

## 📝 Common Commands

```powershell
# View all pods
kubectl get pods

# View pod logs
kubectl logs <pod-name>

# View all services
kubectl get services

# Delete all deployments (clean slate)
kubectl delete -f k8s/

# Restart a specific service
kubectl rollout restart deployment/webapp

# Check pod details
kubectl describe pod <pod-name>
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

- [x] Admin dashboard ✅
- [x] Menu management (CRUD) ✅
- [x] Image upload for pizzas ✅
- [x] Delete completed orders ✅
- [ ] Separate databases per service
- [ ] Message queue (RabbitMQ/Kafka)
- [ ] Real-time order updates (WebSockets)
- [ ] Payment integration (Stripe/PayPal)
- [ ] Email notifications
- [ ] SMS notifications for order status
- [ ] User profile management
- [ ] Order history for users
- [ ] Comprehensive tests (Jest/Mocha)
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Monitoring and logging (Prometheus/Grafana)
- [ ] Rate limiting and security hardening

## 💻 Author

**Amit Eizenberg**

[LinkedIn](https://www.linkedin.com/in/amit-eizenberg) | [GitHub](https://github.com/Amit-Eizen)

## 📄 License

MIT License - Feel free to use for learning and portfolio projects!

## 🙏 Acknowledgments

Built as a learning project to understand modern microservices architecture and cloud-native development practices.

---

**⭐ Star this repo if you found it helpful!**
