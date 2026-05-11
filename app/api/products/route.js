import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { successResponse, errorResponse } from "@/lib/api-utils";

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    
    const category = searchParams.get("category");
    const isTopSelling = searchParams.get("isTopSelling") === "true";
    const isNewArrival = searchParams.get("isNewArrival") === "true";
    const isFeatured = searchParams.get("isFeatured") === "true";
    const limit = Number(searchParams.get("limit")) || 10;
    
    const filter = {};
    if (category) filter.category = category;
    if (isTopSelling) filter.isTopSelling = true;
    if (isNewArrival) filter.isNewArrival = true;
    if (isFeatured) filter.isFeatured = true;
    
    const products = await Product.find(filter).limit(limit).sort({ createdAt: -1 });
    
    return successResponse(products);
  } catch (err) {
    return errorResponse(err.message);
  }
}
