import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";
import { successResponse, errorResponse } from "@/lib/api-utils";

export async function POST(req) {
  try {
    const body = await req.json();
    const { items, customer, subTotal, shippingCost, totalPrice, paymentMethod, notes } = body;

    if (!items || items.length === 0) {
      return errorResponse("No items in order", 400);
    }

    await connectDB();

    // 1. Create or Update User based on phone
    let user = await User.findOne({ phone: customer.phone });
    if (!user) {
      user = await User.create({
        name: customer.name,
        phone: customer.phone,
        address: customer.address,
        city: customer.city
      });
    } else {
      user.name = customer.name;
      user.address = customer.address;
      user.city = customer.city;
      await user.save();
    }

    // 2. Generate Order ID
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
    const random = Math.floor(1000 + Math.random() * 9000);
    const orderId = `ORD-${dateStr}-${random}`;

    // 3. Create Order
    const newOrder = await Order.create({
      orderId,
      items,
      customer,
      subTotal,
      shippingCost,
      totalPrice,
      paymentMethod,
      notes,
      status: "Pending",
      paymentStatus: "Pending"
    });

    // 4. Update product stock
    for (const item of items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stockQuantity: -item.quantity }
      });
    }

    return successResponse(newOrder, "Order placed successfully");
  } catch (error) {
    console.error("Order creation error:", error);
    return errorResponse("Failed to place order");
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const phone = searchParams.get("phone");

    if (!phone) {
      return errorResponse("Phone number required", 400);
    }

    await connectDB();
    const orders = await Order.find({ "customer.phone": phone }).sort({ createdAt: -1 });

    return successResponse(orders);
  } catch (error) {
    console.error("Fetch user orders error:", error);
    return errorResponse("Server error");
  }
}

export async function PATCH(req) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("id");
    const action = searchParams.get("action");

    if (!orderId || action !== "cancel") {
      return errorResponse("Invalid request", 400);
    }

    await connectDB();
    const order = await Order.findById(orderId);

    if (!order) {
      return errorResponse("Order not found", 404);
    }

    if (order.status !== "Pending") {
      return errorResponse("Only pending orders can be cancelled", 400);
    }

    // 1. Update order status
    order.status = "Cancelled";
    await order.save();

    // 2. Restore stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stockQuantity: item.quantity }
      });
    }

    return successResponse(order, "Order cancelled successfully");
  } catch (error) {
    console.error("Cancel order error:", error);
    return errorResponse("Failed to cancel order");
  }
}
