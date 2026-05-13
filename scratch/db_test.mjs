import { connectDB } from "../lib/db.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

async function test() {
  try {
    console.log("Connecting to:", process.env.MONGODB_URI);
    await connectDB();
    console.log("Connected successfully");
    
    // Check models
    const Product = mongoose.models.Product || mongoose.model("Product", new mongoose.Schema({}));
    const count = await Product.countDocuments();
    console.log("Product count:", count);
    
    process.exit(0);
  } catch (err) {
    console.error("Test failed:", err);
    process.exit(1);
  }
}

test();
