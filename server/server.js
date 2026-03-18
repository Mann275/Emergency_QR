const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const dns = require("dns");
require("dotenv").config();

// Use Google DNS to fix SRV lookup failures on restricted networks
dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const app = express();
const PORT = process.env.PORT || 5000;
const API_RATE_LIMIT_MAX = 200;
const DB_RETRY_DELAY_MS = 10000;
const mongoUri =
  (process.env.MONGODB_URI || "").trim() ||
  "mongodb://127.0.0.1:27017/emergencyqr";
let isDatabaseConnected = false;

// CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      process.env.FRONTEND_URL || "http://localhost:5173",
      "http://localhost:5173",
      "https://emergencyqr-gen.vercel.app",
    ];

    if (
      allowedOrigins.indexOf(origin) !== -1 ||
      allowedOrigins.some((allowed) => origin.includes(allowed))
    ) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all origins for now (you can restrict this later)
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

// Middleware
app.use(cors(corsOptions));
app.use(
  helmet({
    crossOriginResourcePolicy: false,
    crossOriginOpenerPolicy: false,
  }),
);
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: API_RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many requests. Please try again later.",
  },
});

app.use("/api", apiLimiter);

// MongoDB Connection
const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.warn(
        "MONGODB_URI not set. Falling back to local MongoDB at mongodb://127.0.0.1:27017/emergencyqr",
      );
    }

    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    isDatabaseConnected = true;
  } catch (error) {
    isDatabaseConnected = false;

    if (
      error.code === "ESERVFAIL" ||
      String(error.hostname || "").includes("_mongodb._tcp")
    ) {
      console.error(
        "Database connection error: Atlas SRV DNS lookup failed. Check network DNS/VPN/firewall or use a non-SRV Mongo URI.",
      );
    }

    console.error("Database connection error:", error);
    console.warn(
      `Retrying database connection in ${DB_RETRY_DELAY_MS / 1000}s...`,
    );
    setTimeout(connectDB, DB_RETRY_DELAY_MS);
  }
};

// Routes
app.use("/api/users", require("./routes/users"));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    message: "Emergency QR API is running!",
    timestamp: new Date().toISOString(),
    database: isDatabaseConnected ? "connected" : "disconnected",
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(500).json({
    error: "Something went wrong!",
    message:
      process.env.NODE_ENV === "development"
        ? error.message
        : "Internal server error",
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Emergency QR API ready at http://localhost:${PORT}`);
});

// Connect to database in background with retries.
connectDB();

module.exports = app;
