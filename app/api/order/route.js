import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import mongoose from "mongoose";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";
import { successResponse, errorResponse } from "@/lib/api-utils";

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("Order body received:", JSON.stringify(body, null, 2));
    const { items, customer, subTotal, shippingCost, totalPrice, paymentMethod, notes } = body;

    if (!items || items.length === 0) {
      return errorResponse("No items in order", 400);
    }

    console.log("Connecting to DB...");
    await connectDB();
    
    // Validate customer data
    if (!customer?.phone || !customer?.name) {
      return errorResponse("Customer name and phone are required", 400);
    }

    // 1. Create or Update User based on phone
    console.log("Processing user...");
    let user;
    try {
      user = await User.findOne({ phone: customer.phone });
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
    } catch (err) {
      console.error("User management error:", err);
      return errorResponse("Failed to identify or create customer profile");
    }

    // 2. Generate Order ID
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const random = Math.floor(1000 + Math.random() * 9000);
    const orderId = `ORD-${dateStr}-${random}`;

    // 3. Validate items and prepare order
    const validatedItems = items.map(item => {
      if (!mongoose.Types.ObjectId.isValid(item.product)) {
        throw new Error(`Invalid product ID: ${item.product}`);
      }
      return {
        ...item,
        product: new mongoose.Types.ObjectId(item.product)
      };
    });

    // 4. Create Order
    console.log("Saving order...");
    const newOrder = await Order.create({
      orderId,
      items: validatedItems,
      customer,
      subTotal,
      shippingCost,
      totalPrice,
      paymentMethod: paymentMethod || "Cash on Delivery",
      notes,
      status: "Pending",
      paymentStatus: "Pending"
    });

    // 5. Update product stock (async but don't block response if possible, 
    // though here we'll keep it sequential for simplicity unless it's the bottleneck)
    console.log("Updating stock...");
    try {
      for (const item of validatedItems) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stockQuantity: -(item.quantity || 1) }
        });
      }
    } catch (err) {
      console.error("Stock update error (non-fatal for order):", err);
    }

    console.log("Order complete.");
    return successResponse(newOrder, "Order placed successfully");
  } catch (error) {
    console.error("Order completion failed:", error);
    return errorResponse(error.message || "Internal server error during order processing");
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
