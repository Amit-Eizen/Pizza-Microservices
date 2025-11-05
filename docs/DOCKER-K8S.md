# Docker & Kubernetes Explained

Simple explanation of how we use Docker and Kubernetes in this project.

## What is Docker?

**Docker** packages your app with everything it needs into a "container".

**Think of it like this:**
- Regular way: "Install Node.js, install npm packages, run the app" (different on every computer)
- Docker way: "Run this container" (same everywhere)

**What's in a container?**
- Linux operating system (Alpine - super small)
- Node.js
- Your code
- All npm packages
- Instructions to run

### Our Dockerfiles

Each service has a `Dockerfile` that says how to build its container:

```dockerfile
FROM node:18-alpine          # Start with Node.js 18 on Alpine Linux
WORKDIR /app                 # Work in /app folder
COPY package*.json ./        # Copy package files first
RUN npm ci --only=production # Install dependencies (production only)
COPY . .                     # Copy all code
EXPOSE 3001                  # Open port 3001
CMD ["node", "server.js"]    # Start the server
```

### Building Images

```bash
# Build = Create the container image
docker build -t pizza-auth-service:latest ./auth-service

# What this does:
# 1. Reads Dockerfile
# 2. Downloads node:18-alpine if needed
# 3. Copies your code
# 4. Installs packages
# 5. Creates an image tagged "pizza-auth-service:latest"
```

### Running Containers

```bash
# Run = Start a container from an image
docker run -p 3001:3001 pizza-auth-service:latest

# -p 3001:3001 = Map port 3001 on your computer to port 3001 in container
```

---

## What is Kubernetes?

**Kubernetes** (K8s) manages your containers.

**What it does:**
1. **Runs multiple copies** - We run 2 copies of each service
2. **Restarts crashed containers** - If auth-service crashes, K8s starts a new one
3. **Load balancing** - Distributes requests across the 2 copies
4. **Networking** - Services can find each other by name

### Kubernetes Components

**Pod** = The smallest unit. Usually one container.
- `auth-service-674cc4c98d-sxqn8` = One pod running auth service

**Deployment** = Manages pods. Says "run 2 pods of auth-service"
- If a pod crashes, Deployment creates a new one
- Want 5 copies? Change replicas to 5

**Service** = Network endpoint for pods
- `http://auth-service:3001` always works
- Even if pods restart and get new IPs

### Our Kubernetes Setup

**Each service has:**
1. **Deployment** - Runs 2 replicas (copies) of the service
2. **Service** - Provides stable network name

**Example:** `auth-service-deployment.yaml`
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: auth-service
spec:
  replicas: 2  # Run 2 copies
  template:
    spec:
      containers:
      - name: auth-service
        image: pizza-auth-service:latest  # Use our Docker image
        ports:
        - containerPort: 3001
        env:  # Environment variables
        - name: MONGODB_URI
          value: "mongodb+srv://..."
---
apiVersion: v1
kind: Service  # Network endpoint
metadata:
  name: auth-service
spec:
  type: ClusterIP  # Internal only
  ports:
  - port: 3001
  selector:
    app: auth-service  # Connect to auth-service pods
```

### How Services Find Each Other

**In Kubernetes**, services use service names:

```javascript
// api-gateway talking to auth-service
const AUTH_SERVICE_URL = 'http://auth-service:3001';
```

Kubernetes DNS resolves `auth-service` to the right IP automatically!

---

## The Problem We Solved

### API Gateway Body Issue

When we first set up the gateway, POST requests failed. Here's why:

**Problem:**
```javascript
app.use(express.json());  // Express reads the body
app.use('/api/auth', proxy({
  target: 'http://auth-service:3001'
}));
// Body is already consumed! Proxy has nothing to send
```

**Solution:**
```javascript
app.use('/api/auth', proxy({
  target: 'http://auth-service:3001',
  onProxyReq: (proxyReq, req, res) => {
    // Re-send the body
    if (req.body && req.method === 'POST') {
      const bodyData = JSON.stringify(req.body);
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);  // Write body again
    }
  }
}));
```

---

## Docker Compose

**Docker Compose** = Run multiple containers together with one command.

Our `docker-compose.yml`:
```yaml
services:
  mongodb:
    image: mongo:7
    ports:
      - "27017:27017"

  auth-service:
    build: ./auth-service
    ports:
      - "3001:3001"
    depends_on:
      - mongodb  # Start after MongoDB

  # ... more services ...
```

**One command to start everything:**
```bash
docker-compose up
```

---

## Kubernetes vs Docker Compose

**Docker Compose:**
- Good for development
- One computer only
- Simple configuration

**Kubernetes:**
- Good for production
- Multiple computers (cluster)
- Auto-healing, scaling, load balancing
- More complex but more powerful

---

## Useful Commands

### Docker
```bash
# Build image
docker build -t my-service:latest ./my-service

# Run container
docker run -p 3001:3001 my-service

# List running containers
docker ps

# Stop container
docker stop <container-id>

# View logs
docker logs <container-id>

# Remove stopped containers
docker container prune
```

### Docker Compose
```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# Stop all
docker-compose down

# View logs
docker-compose logs -f auth-service
```

### Kubernetes
```bash
# Deploy
kubectl apply -f k8s/auth-service-deployment.yaml

# List pods
kubectl get pods

# List services
kubectl get services

# View logs
kubectl logs <pod-name>

# Describe (detailed info)
kubectl describe pod <pod-name>

# Restart deployment
kubectl rollout restart deployment/auth-service

# Scale up/down
kubectl scale deployment auth-service --replicas=5

# Delete
kubectl delete -f k8s/auth-service-deployment.yaml
```

---

## Why We Did It This Way

### MongoDB Atlas (Cloud)
**Why not MongoDB in Kubernetes?**
- MongoDB needs persistent storage
- Data shouldn't disappear if pod restarts
- Atlas is managed - automatic backups, security, monitoring
- Free tier works great for learning

### Shared Database
**Why not separate databases?**
- Simpler for learning project
- No complex data syncing needed
- Still demonstrates microservices separation
- Each service uses different collections

In production, you'd use separate databases for true independence.

### ImagePullPolicy: Never
**Why?**
```yaml
imagePullPolicy: Never  # Don't pull from Docker Hub
```
- Our images are built locally
- Not pushed to Docker Hub
- Kubernetes would fail trying to download them
- `Never` = use local images only

### Health Checks
**Why?**
```yaml
livenessProbe:  # Is container alive?
  httpGet:
    path: /health
    port: 3001
```
- Kubernetes checks `/health` every 10 seconds
- If it fails, Kubernetes restarts the pod
- Keeps services healthy automatically

---

## What's Next?

To make this production-ready:

1. **Push images to registry** (Docker Hub, AWS ECR)
2. **Use Secrets** for passwords (not plain text in YAML)
3. **Add resource limits** (CPU, memory)
4. **Setup Ingress** for HTTPS
5. **Add monitoring** (Prometheus, Grafana)
6. **Setup logging** (ELK stack)
7. **CI/CD pipeline** (GitHub Actions)

But for learning? This setup is perfect!
