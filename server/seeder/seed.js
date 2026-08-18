const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");
const Product = require("../models/product.model.js");
const Category = require("../models/category.model.js");

// Load .env from the correct location
dotenv.config({ path: path.join(__dirname, "../.env") });

if (!process.env.MONGO_URI) {
  process.exit(1);
}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const importProducts = async () => {
  try {
    await connectDB();

    // Read products.json
    const productsPath = path.join(__dirname, "../products.json");
    const products = JSON.parse(fs.readFileSync(productsPath, "utf-8"));
    // Clear old products
    await Product.deleteMany();

    // Fetch existing categories
    const categories = await Category.find();
    if (categories.length === 0) {
      process.exit(1);
    }

    // Create category map
    const categoryMap = {};
    categories.forEach((cat) => {
      categoryMap[cat.name.toLowerCase()] = cat._id;
      categoryMap[cat.slug.toLowerCase()] = cat._id;
    });

    // Map category names to IDs
    const mappedProducts = products.map((p) => {
      const catId = categoryMap[p.category?.toLowerCase()];
      if (!catId) {
        console.warn(`No category found for "${p.category}"`);
      }
      return { ...p, category: catId };
    });

    // Filter out products without a valid category
    const validProducts = mappedProducts.filter((p) => p.category);

    if (validProducts.length === 0) {
      console.error("No products with valid categories found!");
      process.exit(1);
    }

    // Insert products
    const inserted = await Product.insertMany(validProducts);
    console.log(`${inserted.length} products imported successfully!`);

    process.exit(0);
  } catch (error) {
    console.error("Error importing products:", error);
    process.exit(1);
  }
};

importProducts();
