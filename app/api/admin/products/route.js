import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import { 
  checkAdminAuth, 
  successResponse, 
  errorResponse, 
  getPaginationParams, 
  buildPaginationResponse,
  validators 
} from "@/lib/api-utils";

/**
 * GET: List products with pagination and filters
 */
export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const { page, limit, skip } = getPaginationParams(req);

    // Filters
    const query = {};
    const category = searchParams.get("category");
    const subCategory = searchParams.get("subCategory");
    const search = searchParams.get("search");
    const isNewArrival = searchParams.get("isNewArrival") === "true";
    const isTopSelling = searchParams.get("isTopSelling") === "true";
    const isFeatured = searchParams.get("isFeatured") === "true";

    if (category) query.category = category;
    if (subCategory) query.subCategory = subCategory;
    if (isNewArrival) query.isNewArrival = true;
    if (isTopSelling) query.isTopSelling = true;
    if (isFeatured) query.isFeatured = true;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } }
      ];
    }

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Product.countDocuments(query);

    return successResponse(buildPaginationResponse(products, total, page, limit));
  } catch (err) {
    return errorResponse(err.message);
  }
}

/**
 * POST: Create a new product (Admin Only)
 */
export async function POST(req) {
  try {
    // 1. Auth Check
    const auth = await checkAdminAuth(req);
    if (!auth.valid) return errorResponse(auth.error, 401);

    await connectDB();
    const body = await req.json();

    // 2. Validation
    if (!validators.isValidString(body.name, 3)) {
      return errorResponse("Product name must be at least 3 characters", 400);
    }
    if (!validators.isValidPrice(body.price)) {
      return errorResponse("Price must be a positive number", 400);
    }
    if (!validators.isValidImageArray(body.images)) {
      return errorResponse("At least one valid image URL is required", 400);
    }
    if (!body.category) {
      return errorResponse("Category is required", 400);
    }

    // 3. Verify Category Exists
    const categoryExists = await Category.findOne({ name: body.category });
    if (!categoryExists) {
      return errorResponse(`Category '${body.category}' does not exist`, 400);
    }

    // 4. Generate Slug manually to ensure it's present before validation
    const baseSlug = body.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    
    const random = Math.random().toString(36).substring(2, 7);
    body.slug = `${baseSlug}-${random}`;

    // 5. Create Product
    const product = await Product.create(body);

    return successResponse(product, "Product created successfully", 201);
  } catch (err) {
    return errorResponse(err.message);
  }
}
