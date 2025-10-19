import dotenv from "dotenv";
import Product from "../models/product.model.js";
import Category from "../models/category.model.js";
import mongoose from "mongoose";

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
const destroyData = async () => {
  try {
    await Product.deleteMany();
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

destroyData();
