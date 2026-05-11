import { connectDB } from "@/lib/db";
import Review from "@/models/Review";
import { successResponse, errorResponse } from "@/lib/api-utils";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return errorResponse("Product ID is required", 400);
    }

    await connectDB();
    const reviews = await Review.find({ product: productId }).sort({ createdAt: -1 });
    
    return successResponse(reviews);
  } catch (err) {
    return errorResponse(err.message);
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { productId, name, phone, rating, comment, images } = body;

    if (!productId || !name || !phone || !rating || !comment) {
      return errorResponse("All fields are required", 400);
    }

    const newReview = await Review.create({
      product: productId,
      user: { name, phone },
      rating,
      comment,
      images: images || [],
    });

    return successResponse(newReview, "Review submitted successfully", 201);
  } catch (err) {
    return errorResponse(err.message);
  }
}
