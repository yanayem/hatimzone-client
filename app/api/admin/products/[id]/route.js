import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { 
  checkAdminAuth, 
  successResponse, 
  errorResponse,
  validators 
} from "@/lib/api-utils";

/**
 * GET: Fetch a single product by ID
 */
export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    
    const product = await Product.findById(id).lean();
    if (!product) {
      return errorResponse("Product not found", 404);
    }
    
    return successResponse(product);
  } catch (err) {
    return errorResponse(err.message);
  }
}

/**
 * PUT: Update a product (Admin Only)
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
    if (body.name && !validators.isValidString(body.name, 3)) {
      return errorResponse("Product name must be at least 3 characters", 400);
    }
    if (body.price !== undefined && !validators.isValidPrice(body.price)) {
      return errorResponse("Price must be a positive number", 400);
    }

    // 3. Handle Cover Image (New Field) Fallback
    if (body.images && (!body.cover || (Array.isArray(body.cover) && body.cover.length === 0))) {
      body.cover = Array.isArray(body.images) ? [body.images[0]] : [body.images];
    }

    // 3. Update
    // Note: The pre-save hook in Product model will handle slug and rating updates if needed
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { ...body },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return errorResponse("Product not found", 404);
    }

    return successResponse(updatedProduct, "Product updated successfully");
  } catch (err) {
    return errorResponse(err.message);
  }
}

/**
 * DELETE: Remove a product (Admin Only)
 */
export async function DELETE(req, { params }) {
  try {
    // 1. Auth Check
    const auth = await checkAdminAuth(req);
    if (!auth.valid) return errorResponse(auth.error, 401);

    await connectDB();
    const { id } = await params;

    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return errorResponse("Product not found", 404);
    }

    return successResponse(null, "Product deleted successfully");
  } catch (err) {
    return errorResponse(err.message);
  }
}
