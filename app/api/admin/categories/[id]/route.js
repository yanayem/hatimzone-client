import { connectDB } from "@/lib/db";
import Category from "@/models/Category";
import { 
  checkAdminAuth, 
  successResponse, 
  errorResponse,
  validators 
} from "@/lib/api-utils";

/**
 * PUT: Update a category (Admin Only)
 */
export async function PUT(req, { params }) {
  try {
    // 1. Auth Check
    const auth = await checkAdminAuth(req);
    if (!auth.valid) return errorResponse(auth.error, 401);

    await connectDB();
    const { id } = await params;
    const body = await req.json();

    // 2. Validation
    if (body.name && !validators.isValidString(body.name, 2)) {
      return errorResponse("Category name must be at least 2 characters", 400);
    }

    // 3. Update
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { ...body },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return errorResponse("Category not found", 404);
    }

    return successResponse(updatedCategory, "Category updated successfully");
  } catch (err) {
    return errorResponse(err.message);
  }
}

/**
 * DELETE: Remove a category (Admin Only)
 */
export async function DELETE(req, { params }) {
  try {
    // 1. Auth Check
    const auth = await checkAdminAuth(req);
    if (!auth.valid) return errorResponse(auth.error, 401);

    await connectDB();
    const { id } = await params;

    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) {
      return errorResponse("Category not found", 404);
    }

    return successResponse(null, "Category deleted successfully");
  } catch (err) {
    return errorResponse(err.message);
  }
}
