// API Gateway - Central entry point for all microservices
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(morgan('dev')); // HTTP request logger
app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'API Gateway is running',
    timestamp: new Date().toISOString()
  });
});

// Service URLs from environment
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:3001';
const MENU_SERVICE_URL = process.env.MENU_SERVICE_URL || 'http://localhost:3002';
const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || 'http://localhost:3003';

// Proxy configuration options
const proxyOptions = {
  changeOrigin: true,
  logLevel: 'debug',
  timeout: 60000, // 60 second timeout
  proxyTimeout: 60000, // 60 second proxy timeout
  onProxyReq: (proxyReq, req, res) => {
    console.log(`[Proxy] ${req.method} ${req.originalUrl} -> ${proxyReq.path}`);

    // Re-stream body for POST/PUT requests
    if (req.body && (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH')) {
      const bodyData = JSON.stringify(req.body);
      proxyReq.setHeader('Content-Type', 'application/json');
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    }
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`[Proxy] Response: ${proxyRes.statusCode} from ${req.originalUrl}`);
  },
  onError: (err, req, res) => {
    console.error(`[Proxy Error] ${err.message}`);
    res.status(500).json({
      success: false,
      message: 'Service temporarily unavailable',
      error: err.message
    });
  }
};

// Route: Auth Service
// Handles: /api/auth/login, /api/auth/register
app.use('/api/auth', createProxyMiddleware({
  target: AUTH_SERVICE_URL,
  ...proxyOptions
}));

// Route: Menu Service
// Handles: /api/menu (GET, POST, PUT, DELETE)
app.use('/api/menu', createProxyMiddleware({
  target: MENU_SERVICE_URL,
  ...proxyOptions
}));

// Route: Order Service
// Handles: /api/orders (GET, POST, PUT, DELETE)
app.use('/api/orders', createProxyMiddleware({
  target: ORDER_SERVICE_URL,
  ...proxyOptions
}));

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found in API Gateway`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Gateway Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal Gateway Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on http://localhost:${PORT}`);
  console.log(`📡 Proxying to:`);
  console.log(`   - Auth Service: ${AUTH_SERVICE_URL}`);
  console.log(`   - Menu Service: ${MENU_SERVICE_URL}`);
  console.log(`   - Order Service: ${ORDER_SERVICE_URL}`);
});
