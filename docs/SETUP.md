# Setup Guide

How to run the Pizza Microservices project on your computer.

## What You Need

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **MongoDB Atlas Account** - [Sign up free](https://www.mongodb.com/cloud/atlas)
- **Docker Desktop** (optional) - [Download here](https://www.docker.com/products/docker-desktop/)

## Method 1: Local Development (Easiest)

### Step 1: Get the Code
```bash
git clone https://github.com/YOUR_USERNAME/Pizza-Microservices.git
cd Pizza-Microservices
```

### Step 2: Setup MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create account
2. Create a free cluster
3. Create database user (username + password)
4. Allow connections from anywhere (IP: `0.0.0.0/0`)
5. Get connection string - looks like:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/
   ```

### Step 3: Install Dependencies

```bash
cd auth-service && npm install && cd ..
cd menu-service && npm install && cd ..
cd order-service && npm install && cd ..
cd api-gateway && npm install && cd ..
cd webapp && npm install && cd ..
```

### Step 4: Create .env Files

Create these files with your MongoDB connection string:

**auth-service/.env**
```env
PORT=3001
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/pizza-microservices?retryWrites=true&w=majority
JWT_SECRET=my-super-secret-key
NODE_ENV=development
```

**menu-service/.env**
```env
PORT=3002
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/pizza-microservices?retryWrites=true&w=majority
NODE_ENV=development
```

**order-service/.env**
```env
PORT=3003
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/pizza-microservices?retryWrites=true&w=majority
NODE_ENV=development
```

**api-gateway/.env**
```env
PORT=4000
AUTH_SERVICE_URL=http://localhost:3001
MENU_SERVICE_URL=http://localhost:3002
ORDER_SERVICE_URL=http://localhost:3003
NODE_ENV=development
```

**webapp/.env**
```env
PORT=3005
AUTH_SERVICE_URL=http://localhost:4000/api/auth
MENU_SERVICE_URL=http://localhost:4000/api/menu
ORDER_SERVICE_URL=http://localhost:4000/api/orders
NODE_ENV=development
```

### Step 5: Start Services

Open **5 terminal windows** and run:

```bash
# Terminal 1
cd auth-service
npm start

# Terminal 2
cd menu-service
npm start

# Terminal 3
cd order-service
npm start

# Terminal 4
cd api-gateway
npm start

# Terminal 5
cd webapp
npm start
```

### Step 6: Use the App

Open browser: `http://localhost:3005`

---

## Method 2: Docker Compose

### Step 1: Install Docker Desktop
Download and install [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### Step 2: Update docker-compose.yml
Edit `docker-compose.yml` and replace all MongoDB URIs with your Atlas connection string.

### Step 3: Run
```bash
docker-compose up
```

Open browser: `http://localhost:3005`

---

## Method 3: Kubernetes

### Step 1: Enable Kubernetes
1. Open Docker Desktop
2. Settings → Kubernetes → Enable Kubernetes
3. Apply & Restart

### Step 2: Update K8s Configs
Edit these files and add your MongoDB Atlas URI:
- `k8s/auth-service-deployment.yaml`
- `k8s/menu-service-deployment.yaml`
- `k8s/order-service-deployment.yaml`

### Step 3: Build Images
```bash
docker build -t pizza-auth-service:latest ./auth-service
docker build -t pizza-menu-service:latest ./menu-service
docker build -t pizza-order-service:latest ./order-service
docker build -t pizza-api-gateway:latest ./api-gateway
docker build -t pizza-webapp:latest ./webapp
```

### Step 4: Deploy
```bash
kubectl apply -f k8s/auth-service-deployment.yaml
kubectl apply -f k8s/menu-service-deployment.yaml
kubectl apply -f k8s/order-service-deployment.yaml
kubectl apply -f k8s/api-gateway-deployment.yaml
kubectl apply -f k8s/webapp-deployment.yaml
```

### Step 5: Check Status
```bash
kubectl get pods     # Should show all pods running
kubectl get services # Should show all services
```

Open browser: `http://localhost:30005`

---

## Adding Sample Data

Use MongoDB Compass to add pizzas:

1. Connect to your Atlas cluster
2. Go to `pizza-microservices` database
3. Add to `pizzas` collection:

```json
[
  {
    "name": "Margherita",
    "description": "Fresh tomatoes, mozzarella, basil",
    "price": 45,
    "image": "https://images.unsplash.com/photo-1574071318508-1cdbab80d002",
    "category": "Classic",
    "available": true
  },
  {
    "name": "Pepperoni",
    "description": "Pepperoni, mozzarella, tomato sauce",
    "price": 55,
    "image": "https://images.unsplash.com/photo-1628840042765-356cda07504e",
    "category": "Classic",
    "available": true
  }
]
```

---

## Troubleshooting

### Port Already in Use
**Windows:**
```bash
netstat -ano | findstr :3001
taskkill /F /PID <process_id>
```

**Mac/Linux:**
```bash
lsof -i :3001
kill -9 <process_id>
```

### MongoDB Connection Error
- Check your connection string
- Verify IP is whitelisted (use `0.0.0.0/0` for testing)
- Replace `<password>` with your actual password
- Special characters in password? Use URL encoding

### Kubernetes Pod Not Starting
```bash
# Check pod status
kubectl get pods

# See what's wrong
kubectl describe pod <pod-name>

# Check logs
kubectl logs <pod-name>
```

Common issues:
- Image not found → Check `imagePullPolicy: Never` in YAML
- CrashLoopBackOff → Check logs for errors
- Wrong MongoDB URI → Update deployment YAML

---

## Next Steps

Once running:
1. Sign up for an account
2. Browse the menu
3. Place an order
4. Track your order on the Orders page
5. Try the status filters!
