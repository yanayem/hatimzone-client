import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { checkAdminAuth, errorResponse, successResponse } from "@/lib/api-utils";

export async function GET(req) {
  try {
    const auth = await checkAdminAuth(req);
    if (!auth.valid) {
      return errorResponse(auth.error, 401);
    }

    await connectDB();
    const orders = await Order.find().sort({ createdAt: -1 });

    return successResponse(orders);
  } catch (error) {
    console.error("Admin fetch orders error:", error);
    return errorResponse("Server error");
  }
}

export async function PATCH(req) {
  try {
    const auth = await checkAdminAuth(req);
    if (!auth.valid) {
      return errorResponse(auth.error, 401);
    }

    const { id, status, paymentStatus } = await req.json();

    await connectDB();
    const order = await Order.findByIdAndUpdate(
      id,
      { status, paymentStatus },
      { new: true }
    );

    if (!order) {
      return errorResponse("Order not found", 404);
    }

    return successResponse(order);
  } catch (error) {
    console.error("Admin update order error:", error);
    return errorResponse("Server error");
  }
}
