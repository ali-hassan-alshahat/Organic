const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const productRoutes = require("./routes/products.routes");
const categoryRoutes = require("./routes/category.routes");
const usersRoutes = require("./routes/users.routes");
const adminRoutes = require("./routes/admin.routes");
const wishlistRoutes = require("./routes/wishlist.routes");
const orderRoutes = require("./routes/order.routes");
const { notFound, errorHandler } = require("./middleware/error.middleware");

dotenv.config();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://organic-psi-blue.vercel.app",
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1) {
        console.log("Blocked origin:", origin);
        const msg = "CORS policy blocked this request";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Handle preflight requests

app.use(express.json());

// Routes
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", wishlistRoutes);
app.use("/api/orders", orderRoutes);

app.get("/", (req, res) => res.send("Server is running successfully 🚀"));
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Server is running",
    environment: process.env.NODE_ENV || "development",
  });
});

app.use((req, res, next) => {
  console.log("📨 Request received:", {
    method: req.method,
    url: req.url,
    path: req.path,
    originalUrl: req.originalUrl,
  });
  next();
});

// Error middlewares
app.use(notFound);
app.use(errorHandler);

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI);
      console.log("✅ Connected to MongoDB");
    }
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }
};

connectDB();

module.exports = app;

// LOCAL DEVELOPMENT ONLY
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running locally on port ${PORT}`);
  });
}
