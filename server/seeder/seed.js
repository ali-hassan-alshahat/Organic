import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/product.model.js";
import Category from "../models/category.model.js";
import fs from "fs";
import { connect } from "http2";

const products = JSON.parse(
  fs.readFileSync(new URL("../products.json", import.meta.url)),
);

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};
await connectDB();
const importProducts = async () => {
  try {
    console.log("🧹 Clearing old products...");
    await Product.deleteMany();

    // 🗂 Fetch existing categories from DB
    const categories = await Category.find();
    if (categories.length === 0) {
      console.error("⚠️ No categories found! Please add categories first.");
      process.exit(1);
    }

    // 🧭 Map category names/slugs to IDs
    const categoryMap = {};
    categories.forEach((cat) => {
      categoryMap[cat.name.toLowerCase()] = cat._id;
      categoryMap[cat.slug.toLowerCase()] = cat._id;
    });

    // 🧱 Replace category names in products.json with actual category IDs
    const mappedProducts = products.map((p) => {
      const catId = categoryMap[p.category.toLowerCase()];
      if (!catId) {
        console.warn(`⚠️ No category found for "${p.category}"`);
      }
      return { ...p, category: catId };
    });

    // 💾 Insert products
    await Product.insertMany(mappedProducts);
    console.log("✅ Products imported successfully!");

    process.exit();
  } catch (error) {
    console.error("❌ Error importing products:", error);
    process.exit(1);
  }
};

importProducts();
