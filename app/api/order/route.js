import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { successResponse, errorResponse } from "@/lib/api-utils";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { productId, quantity, variant, customer } = body;

    // 1. Validate Input
    if (!productId || !customer?.name || !customer?.phone || !customer?.address) {
      return errorResponse("Missing required order information", 400);
    }

    // 2. Fetch Product to calculate price
    const product = await Product.findById(productId);
    if (!product) {
      return errorResponse("Product not found", 404);
    }

    // 3. Calculate Total Price
    const basePrice = product.discountPrice > 0 ? product.discountPrice : product.price;
    const additionalPrice = variant?.additionalPrice || 0;
    const totalPrice = (basePrice + additionalPrice) * quantity;

    // 4. Create Order
    const newOrder = await Order.create({
      product: productId,
      quantity,
      variant,
      customer,
      totalPrice,
    });

    // 5. Optional: Decrease stock
    if (product.stockQuantity >= quantity) {
      product.stockQuantity -= quantity;
      await product.save();
    }

    return successResponse(newOrder, "Order placed successfully! We will contact you soon.", 201);
  } catch (err) {
    console.error("ORDER API ERROR:", err);
    return errorResponse(err.message);
  }
}
