import { connectDB } from "@/lib/db";
import Category from "@/models/Category";
import { 
  checkAdminAuth, 
  successResponse, 
  errorResponse,
  validators 
} from "@/lib/api-utils";

function generateSlug(text) {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

/**
 * GET: List all categories
 */
export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find().sort({ name: 1 }).lean();
    return successResponse(categories);
  } catch (err) {
    return errorResponse(err.message);
  }
}

/**
 * POST: Create a new category (Admin Only)
 */
export async function POST(req) {
  try {
    // 1. Auth Check
    const auth = await checkAdminAuth(req);
    if (!auth.valid) return errorResponse(auth.error, 401);

    await connectDB();
    const body = await req.json();
    const { name, subCategories } = body;

    // 2. Validation
    if (!validators.isValidString(name, 2)) {
      return errorResponse("Category name must be at least 2 characters", 400);
    }

    const slug = generateSlug(name);

    // 3. Check Uniqueness
    const existing = await Category.findOne({
      $or: [{ name: name.trim() }, { slug }]
    });

    if (existing) {
      return errorResponse("A category with this name or slug already exists", 400);
    }

    // 4. Create
    const newCategory = await Category.create({
      name: name.trim(),
      slug,
      subCategories: subCategories || []
    });

    return successResponse(newCategory, "Category created successfully", 201);
  } catch (err) {
    return errorResponse(err.message);
  }
}