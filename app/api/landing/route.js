import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import Settings from "@/models/Settings";
import { successResponse, errorResponse } from "@/lib/api-utils";

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get("keyword");

    let query = {
      $or: [
        { isFeatured: true },
        { isTopSelling: true },
        { isNewArrival: true }
      ]
    };

    // If keyword is provided, search by tags or name
    if (keyword) {
      const safeKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escape regex special chars
      query = {
        $or: [
          { tags: { $regex: safeKeyword, $options: "i" } },
          { name: { $regex: safeKeyword, $options: "i" } },
          { category: { $regex: safeKeyword, $options: "i" } }
        ]
      };
    }

    // 1. Fetch featured or latest products
    const products = await Product.find(query)
    .select("name price discountPrice cover slug brand tags images description")
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
