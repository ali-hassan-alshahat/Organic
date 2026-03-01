const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

console.log("🚀 SERVER.JS IS LOADING ON VERCEL");
console.log("📁 Current directory:", process.cwd());
console.log("📦 Node version:", process.version);
console.log("🔧 NODE_ENV:", process.env.NODE_ENV);

dotenv.config();
console.log("✅ Dotenv configured");

const app = express();
console.log("✅ Express app created");

// Log all requests
app.use((req, res, next) => {
  console.log(`🔥 ${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log(`   Path: ${req.path}`);
  console.log(`   OriginalUrl: ${req.originalUrl}`);
  next();
});

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://organic-psi-blue.vercel.app",
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        console.log("Blocked origin:", origin);
        return callback(new Error("CORS policy blocked"), false);
      }
      return callback(null, true);
    },
    credentials: true,
  }),
);
console.log("✅ CORS configured");

app.use(express.json());
console.log("✅ JSON parser configured");

// SIMPLE TEST ROUTE - THIS MUST WORK
app.get("/api/test", (req, res) => {
  console.log("✅ Test route hit!");
  res.json({
    success: true,
    message: "API is working!",
    timestamp: new Date().toISOString(),
  });
});

// Your routes
app.use("/api/categories", require("./routes/category.routes"));
app.use("/api/products", require("./routes/products.routes"));
app.use("/api/users", require("./routes/users.routes"));
app.use("/api/admin", require("./routes/admin.routes"));
app.use("/api/users", require("./routes/wishlist.routes"));
app.use("/api/orders", require("./routes/order.routes"));

app.get("/", (req, res) => {
  console.log("✅ Root route hit");
  res.send("Server is running successfully 🚀");
});

app.get("/api/health", (req, res) => {
  console.log("✅ Health route hit");
  res.json({
    status: "OK",
    message: "Server is running",
    environment: process.env.NODE_ENV || "development",
  });
});

// Error handlers
const { notFound, errorHandler } = require("./middleware/error.middleware");
app.use(notFound);
app.use(errorHandler);

console.log("✅ All routes registered");
console.log("📋 Registered routes:");
app._router.stack.forEach((r) => {
  if (r.route && r.route.path) {
    console.log(`   ${Object.keys(r.route.methods)} ${r.route.path}`);
  }
});

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI);
      console.log("✅ Connected to MongoDB");
    }
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
  }
};

connectDB();

console.log("✅ Server.js initialization complete");
module.exports = app;
