// backend/index.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';

// Routes
import authRoutes from "./src/routes/authRoutes.js";
import productRoutes from "./src/routes/productRoutes.js";
import rentalRoutes from "./src/routes/rentalRoutes.js";
import orderRoutes from "./src/routes/orderRoutes.js";
import maintenanceRoutes from "./src/routes/maintenanceRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";
import Product from "./src/models/Product.js";
import Rental from "./src/models/Rental.js";

// ES Module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================
// CORS CONFIGURATION
// ============================================
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

// ============================================
// MIDDLEWARE
// ============================================
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Request logging (development only)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`🔹 ${req.method} ${req.url}`);
    next();
  });
}

// ============================================
// DATABASE CONNECTION
// ============================================
const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb://127.0.0.1:27017/rentease";

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");
    console.log(`📦 Database: ${mongoose.connection.name}`);
    console.log(`🔗 Host: ${mongoose.connection.host}`);
    seedDemoProducts();
    removeLegacyRentalIndex();
  })
  .catch((err) => {
    console.error("❌ MongoDB Error:", err.message);
    process.exit(1);
  });

const seedDemoProducts = async () => {
  if (await Product.exists({})) return;

  await Product.insertMany([
    {
      productId: '1',
      name: 'Queen Size Bed',
      description: 'Comfortable queen size bed with premium wooden frame',
      category: 'furniture',
      subCategory: 'bed',
      monthlyRent: 999,
      securityDeposit: 1999,
      availableQuantity: 5,
      images: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400'],
      status: 'available',
      isActive: true,
    },
    {
      productId: '2',
      name: 'Premium Sofa Set',
      description: '3-seater fabric sofa with premium cushions',
      category: 'furniture',
      subCategory: 'sofa',
      monthlyRent: 1499,
      securityDeposit: 2999,
      availableQuantity: 3,
      images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400'],
      status: 'available',
      isActive: true,
    },
    {
      productId: '3',
      name: 'Double Door Refrigerator',
      description: '240L double door refrigerator with energy-efficient cooling',
      category: 'appliance',
      subCategory: 'fridge',
      monthlyRent: 1299,
      securityDeposit: 3999,
      availableQuantity: 4,
      images: ['https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400'],
      status: 'available',
      isActive: true,
    },
    {
      productId: '4',
      name: 'Washing Machine',
      description: 'Fully automatic washing machine with smart features',
      category: 'appliance',
      subCategory: 'washing_machine',
      monthlyRent: 999,
      securityDeposit: 2999,
      availableQuantity: 2,
      images: ['https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=400'],
      status: 'available',
      isActive: true,
    },
  ]);
  console.log('✅ Demo products seeded');
};

const removeLegacyRentalIndex = async () => {
  try {
    await Rental.collection.dropIndex('productId_1');
    console.log('✅ Removed legacy unique rental product index');
  } catch (error) {
    if (error.code !== 27) {
      console.error('❌ Rental index cleanup failed:', error.message);
    }
  }
};

// ============================================
// API ROUTES
// ============================================

// Test Routes
app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "API Working 🚀",
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: "/api/auth",
      products: "/api/products",
      rentals: "/api/rentals",
      orders: "/api/orders",
      maintenance: "/api/maintenance",
      admin: "/api/admin",
    }
  });
});

// Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    database:
      mongoose.connection.readyState === 1
        ? "Connected"
        : "Disconnected",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    memory: process.memoryUsage(),
  });
});

// API Documentation
app.get("/api/docs", (req, res) => {
  res.json({
    name: "RentEase API",
    version: "1.0.0",
    description: "Furniture & Appliance Rental Platform API",
    baseUrl: `http://localhost:${PORT}/api`,
    endpoints: {
      auth: {
        register: { method: "POST", url: "/api/auth/register" },
        login: { method: "POST", url: "/api/auth/login" },
        profile: { method: "GET", url: "/api/auth/profile" },
        logout: { method: "POST", url: "/api/auth/logout" },
        changePassword: { method: "PUT", url: "/api/auth/change-password" },
        forgotPassword: { method: "POST", url: "/api/auth/forgot-password" },
        resetPassword: { method: "POST", url: "/api/auth/reset-password/:token" },
        verifyEmail: { method: "POST", url: "/api/auth/verify-email/:token" },
      },
      products: {
        getAll: { method: "GET", url: "/api/products" },
        getById: { method: "GET", url: "/api/products/:id" },
        getFeatured: { method: "GET", url: "/api/products/featured" },
        getByCategory: { method: "GET", url: "/api/products/category/:category" },
        create: { method: "POST", url: "/api/products" },
        update: { method: "PUT", url: "/api/products/:id" },
        delete: { method: "DELETE", url: "/api/products/:id" },
      },
      rentals: {
        create: { method: "POST", url: "/api/rentals" },
        getActive: { method: "GET", url: "/api/rentals/active" },
        getHistory: { method: "GET", url: "/api/rentals/history" },
        getById: { method: "GET", url: "/api/rentals/:id" },
        extend: { method: "PUT", url: "/api/rentals/:id/extend" },
        cancel: { method: "PUT", url: "/api/rentals/:id/cancel" },
        return: { method: "PUT", url: "/api/rentals/:id/return" },
        stats: { method: "GET", url: "/api/rentals/stats" },
      },
      orders: {
        create: { method: "POST", url: "/api/orders" },
        getMyOrders: { method: "GET", url: "/api/orders/my-orders" },
        getById: { method: "GET", url: "/api/orders/:id" },
        cancel: { method: "PUT", url: "/api/orders/:id/cancel" },
      },
      maintenance: {
        create: { method: "POST", url: "/api/maintenance" },
        getMyRequests: { method: "GET", url: "/api/maintenance/my-requests" },
        getById: { method: "GET", url: "/api/maintenance/:id" },
      },
      admin: {
        dashboard: { method: "GET", url: "/api/admin/dashboard" },
        users: { method: "GET", url: "/api/admin/users" },
        products: { method: "GET", url: "/api/admin/products" },
        orders: { method: "GET", url: "/api/admin/orders" },
        rentals: { method: "GET", url: "/api/admin/rentals" },
        analytics: { method: "GET", url: "/api/admin/analytics" },
      },
    },
    authentication: {
      type: "Bearer Token",
      header: "Authorization: Bearer <your_token>",
    },
  });
});

// Main Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/rentals", rentalRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use("/api/admin", adminRoutes);

// Root Route
app.get("/", (req, res) => {
  res.json({
    message: "🏠 RentEase API Running",
    version: "1.0.0",
    status: "OK",
    timestamp: new Date().toISOString(),
    documentation: `/api/docs`,
    health: `/api/health`,
    test: `/api/test`,
  });
});

// ============================================
// 404 HANDLER
// ============================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    availableEndpoints: {
      auth: "/api/auth",
      products: "/api/products",
      rentals: "/api/rentals",
      orders: "/api/orders",
      maintenance: "/api/maintenance",
      admin: "/api/admin",
      docs: "/api/docs",
      health: "/api/health",
      test: "/api/test",
    },
  });
});

// ============================================
// GLOBAL ERROR HANDLER
// ============================================
app.use((err, req, res, next) => {
  console.error("❌ Error:", err);

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errors,
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(400).json({
      success: false,
      message: `Duplicate value for ${field}. Please use a different value.`,
    });
  }

  // JWT error
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Invalid token. Please log in again.",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Token expired. Please log in again.",
    });
  }

  // Default error
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// ============================================
// UNHANDLED REJECTIONS
// ============================================
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err);
  // Graceful shutdown
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
  // Graceful shutdown
  process.exit(1);
});

// ============================================
// START SERVER
// ============================================
const server = app.listen(PORT, () => {
  console.log("=".repeat(50));
  console.log("🚀 RentEase API Server Started");
  console.log("=".repeat(50));
  console.log(`📍 Port: ${PORT}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(`📚 API Docs: http://localhost:${PORT}/api/docs`);
  console.log(`💚 Health: http://localhost:${PORT}/api/health`);
  console.log(`🧪 Test: http://localhost:${PORT}/api/test`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log("=".repeat(50));
  console.log("✅ Server is ready to handle requests");
});

// ============================================
// GRACEFUL SHUTDOWN
// ============================================
const gracefulShutdown = () => {
  console.log("🛑 Shutting down gracefully...");
  server.close(() => {
    console.log("✅ Server closed");
    mongoose.connection.close(false, () => {
      console.log("✅ MongoDB connection closed");
      process.exit(0);
    });
  });
};

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);

export default app;