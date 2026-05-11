import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import Order from "@/models/Order";
import { checkAdminAuth, successResponse, errorResponse } from "@/lib/api-utils";

export async function GET(req) {
  try {
    const auth = await checkAdminAuth(req);
    if (!auth.valid) return errorResponse(auth.error, 401);

    await connectDB();

    // 1. Basic Counts
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: "Pending" });

    // 2. Revenue Calculation
    const orders = await Order.find({ status: { $ne: "Cancelled" } });
    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);

    // 3. Recent Orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    return successResponse({
      totalProducts,
      totalOrders,
      pendingOrders,
      totalRevenue,
      recentOrders
    });
  } catch (err) {
    return errorResponse(err.message);
  }
}
