import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { connectDB } from './db.js';
import http from 'http';
import { Server as SocketIO } from 'socket.io';


import authRoutes from './routes/auth.js';
import menuRoutes from './routes/menu.js';
import orderRoutes from './routes/orders.js';
import userRoutes from './routes/users.js';
import reviewRoutes from './routes/reviews.js';
import couponRoutes from './routes/coupons.js';
import addonRoutes from './routes/addons.js';
import categoryRoutes from './routes/categories.js';
import adminRoutes from './routes/admin.js';
import paymentRoutes from './routes/payment.js';
import welcomeRoute from './routes/welcome.js';

const app = express();
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const allowedOrigins = (process.env.CLIENT_URL || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.length === 0) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    const error = new Error(`Origin ${origin} not allowed by CORS`);
    error.status = 403;
    error.code = 'CORS_NOT_ALLOWED';
    error.publicMessage = 'CORS blocked: add your frontend URL to CLIENT_URL.';
    return callback(error);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
  credentials: true,
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());

let io;
let server;

app.use('/', welcomeRoute);
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/addons', addonRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found', message: 'Route not found' });
});

app.use((err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  const message = err.publicMessage || err.message || 'Internal Server Error';
  const response = { error: message, message };
  if (err.code) response.code = err.code;
  res.status(status).json(response);
});

if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5000;
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/stillhungry';
  connectDB(mongoUri).then(() => {
    server = http.createServer(app);
    io = new SocketIO(server, {
      cors: {
        origin: allowedOrigins.length > 0 ? allowedOrigins : true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        credentials: true
      }
    });
    app.set('io', io);
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  });
} else {
  const testUri = process.env.MONGO_URI_TEST || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/stillhungry_test';
  connectDB(testUri).then(() => {
    console.log('Connected to test database');
  });
}

export default app;
