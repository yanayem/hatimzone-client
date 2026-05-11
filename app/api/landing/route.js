import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import Settings from "@/models/Settings";
import { successResponse, errorResponse } from "@/lib/api-utils";

export async function GET() {
  try {
    await connectDB();

    // 1. Fetch featured or latest products
    // We'll prioritize featured, then top selling, then new arrivals
    const products = await Product.find({ 
      $or: [
        { isFeatured: true },
        { isTopSelling: true },
        { isNewArrival: true }
      ] 
    })
    .select("name price discountPrice cover slug brand")
    .sort({ createdAt: -1 })
    .limit(12)
    .lean();

    // 2. Fetch site settings
    let settings = await Settings.findOne().lean();
    if (!settings) {
      settings = await Settings.create({
        shippingInsideDhaka: 70,
        shippingOutsideDhaka: 130,
        contactNumber: "01700-000000",
        siteName: "Hatim Zone"
      });
    }

    return successResponse({
      products,
      settings
    });
  } catch (err) {
    console.error("Landing data fetch error:", err);
    return errorResponse(err.message);
  }
}
