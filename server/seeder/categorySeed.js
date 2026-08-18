const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const Category = require("../models/category.model.js");

// Load .env from server folder
dotenv.config({ path: path.join(__dirname, "../.env") });

if (!process.env.MONGO_URI) {
  process.exit(1);
}

// Updated categories to match products.json
const categories = [
  {
    name: "Fruits",
    slug: "fruits",
  },
  {
    name: "Vegetables",
    slug: "vegetables",
  },
  {
    name: "Oil",
    slug: "oil",
  },
  {
    name: "Snacks",
    slug: "snacks",
  },
  {
    name: "Bread",
    slug: "bread",
  },
  {
    name: "Dairy",
    slug: "dairy",
  },
  {
    name: "Meat",
    slug: "meat",
  },
  {
    name: "Grains",
    slug: "grains",
  },
  {
    name: "Beverages",
    slug: "beverages",
  },
  {
    name: "Personal Care",
    slug: "personal-care",
  },
];

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    process.exit(1);
  }
};

const importCategories = async () => {
  try {
    await connectDB();

    // Clear existing categories
    await Category.deleteMany();

    // Insert new categories
    const inserted = await Category.insertMany(categories);

    process.exit(0);
  } catch (error) {
    process.exit(1);
  }
};

importCategories();
