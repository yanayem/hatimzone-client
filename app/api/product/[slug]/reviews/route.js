import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { successResponse, errorResponse } from "@/lib/api-utils";

/**
 * POST: Submit a review for a product
 */
export async function POST(req, { params }) {
  try {
    await connectDB();
    const { slug } = await params;
    const { userName, rating, comment } = await req.json();

    if (!userName || !rating || !comment) {
      return errorResponse("All fields are required for a review", 400);
    }

    // Find product by ID or Slug
    let product = await Product.findOne({ slug });
    if (!product && mongoose.Types.ObjectId.isValid(slug)) {
      product = await Product.findById(slug);
    }

    if (!product) {
      return errorResponse("Product not found", 404);
    }

    // Add review
    const newReview = { userName, rating: Number(rating), comment, date: new Date() };
    product.reviews.push(newReview);
    
    // The Product model has a pre-save hook that updates averageRating and totalReviews
    await product.save();

    return successResponse(newReview, "Review submitted successfully!");
  } catch (err) {
    console.error("REVIEW API ERROR:", err);
    return errorResponse(err.message);
  }
}
