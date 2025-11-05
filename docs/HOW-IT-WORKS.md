# How It Works

This document explains how the Pizza Microservices system works and why we built it this way.

## The Big Picture

```
User Browser
    ↓
Webapp (Port 3005) - Website
    ↓
API Gateway (Port 4000) - Traffic cop
    ↓
    ├→ Auth Service (3001) - Login/Register
    ├→ Menu Service (3002) - Pizza menu
    └→ Order Service (3003) - Orders
         ↓
    MongoDB Atlas - Database in the cloud
```

## Why Split Into Services?

Instead of one big application, we split it into 4 small services. Here's why:

**Benefits:**
- Each service can be updated independently
- If one service crashes, others keep working
- Easy to scale - run multiple copies of busy services
- Different teams can work on different services

**Our Services:**

1. **Auth Service** - Everything about users (register, login)
2. **Menu Service** - Everything about pizzas (list, add, edit)
3. **Order Service** - Everything about orders (create, track)
4. **API Gateway** - Routes requests to the right service

## Request Flow Example

Let's see what happens when you order a pizza:

1. **You click "Order Now"** on the website
2. **Webapp** sends order to API Gateway (`http://localhost:4000/api/orders`)
3. **API Gateway** sees `/api/orders` and forwards to Order Service
4. **Order Service** saves order to MongoDB
5. **MongoDB** confirms save
6. **Order Service** returns success
7. **API Gateway** forwards response back
8. **Webapp** shows success message

## Why API Gateway?

The Gateway is like a receptionist - it knows which service handles what.

**Without Gateway:**
- Webapp needs to know all service addresses
- Hard to change service locations
- Each service exposed to internet

**With Gateway:**
- Webapp only talks to one address
- Easy to move services around
- Only Gateway is exposed

## Database Strategy

Originally, microservices use separate databases. We use **one shared database** with different collections:

```
MongoDB Atlas (pizza-microservices database)
├── users collection (Auth Service)
├── pizzas collection (Menu Service)
└── orders collection (Order Service)
```

**Why shared database?**
- Simpler for learning/development
- No complex data synchronization
- Still keeps services separate (different collections)

**In production**, you'd use separate databases for true independence.

## How Services Communicate

**Locally:**
```javascript
// Services use localhost
http://localhost:3001  // Auth
http://localhost:3002  // Menu
http://localhost:3003  // Order
```

**In Kubernetes:**
```javascript
// Services use service names
http://auth-service:3001
http://menu-service:3002
http://order-service:3003
```

Kubernetes DNS automatically resolves service names!

## The API Gateway Problem We Solved

**Problem:** When we proxy requests, the request body gets "eaten" by Express middleware.

**Example:**
```javascript
// This doesn't work:
app.use(express.json());  // Reads and consumes body
app.use('/api/auth', proxy(...));  // Body is already consumed!
```

**Solution:** Re-stream the body in the proxy:
```javascript
onProxyReq: (proxyReq, req, res) => {
  if (req.body && req.method === 'POST') {
    const bodyData = JSON.stringify(req.body);
    proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
    proxyReq.write(bodyData);  // Send body again
  }
}
```

## Docker & Kubernetes

### What is Docker?

**Docker** = Package your app with everything it needs (code, Node.js, dependencies) into a "container"

**Why?**
- Works the same on any computer
- No "works on my machine" problems
- Easy to share and deploy

### What is Kubernetes?

**Kubernetes** = Manager for containers

**What it does:**
- Runs multiple copies of your app (2 of each service)
- Restarts crashed containers automatically
- Distributes traffic across copies
- Manages networking between services

**Example:** If Order Service crashes, Kubernetes notices and starts a new one immediately.

## Data Models

### User
```javascript
{
  username: "john_doe",
  email: "john@example.com",
  password: "hashed_password_here"
}
```

### Pizza
```javascript
{
  name: "Margherita",
  description: "Fresh tomatoes, mozzarella, basil",
  price: 45,
  image: "https://...",
  category: "Classic"
}
```

### Order
```javascript
{
  userId: "user_id_here",
  pizzaName: "Margherita",
  quantity: 2,
  totalPrice: 90,
  status: "Preparing",  // Pending → Preparing → On the Way → Delivered
  deliveryAddress: {
    street: "123 Main St",
    city: "Tel Aviv",
    zipCode: "050-1234567"  // We changed this to phone number!
  },
  paymentMethod: "Credit Card"
}
```

## UI Improvements We Made

### 1. Changed ZIP Code to Phone Number
**Why:** In Israel, we don't use ZIP codes for delivery. Phone number is more useful.

### 2. Order Timeline
Instead of just showing status text, we show a visual timeline:
```
📝 Placed → 👨‍🍳 Preparing → 🚗 On the Way → ✅ Delivered
```
Active steps are highlighted, so you see progress.

### 3. Status Filters
Buttons to filter orders:
- All Orders
- 🕐 Pending
- 👨‍🍳 Preparing
- 🚗 On the Way
- ✅ Delivered

Click a button, only those orders show.

## Security

- **Passwords:** Hashed with bcrypt (never stored plain text)
- **Authentication:** JWT tokens (stored in cookies)
- **Authorization:** Middleware checks token before protected routes

## What Could Be Better?

This is a learning project. In production, you'd add:

1. **Separate databases per service** - True microservices independence
2. **Message queue** (RabbitMQ) - Services communicate via events, not HTTP
3. **API rate limiting** - Prevent abuse
4. **Caching** (Redis) - Faster responses for menu
5. **Monitoring** (Prometheus) - Track performance
6. **Logging** (ELK stack) - Centralized logs
7. **Tests** - Unit and integration tests
8. **CI/CD** - Automatic deployment on code changes

But for learning microservices architecture, this project shows the core concepts well!
