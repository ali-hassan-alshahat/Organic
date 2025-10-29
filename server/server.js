const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const productRoutes = require("./routes/products.routes");
const categoryRoutes = require("./routes/category.routes");
const usersRoutes = require("./routes/users.routes");
const wishlistRoutes = require("./routes/wishlist.routes");
const { notFound, errorHandler } = require("./middleware/error.middleware");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/wishlist", wishlistRoutes);

// Health
app.get("/", (req, res) => res.send("Server is running successfully 🚀"));

// Error middlewares (catch all)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });
