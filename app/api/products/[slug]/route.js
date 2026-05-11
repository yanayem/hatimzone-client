import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";

export async function GET(req, { params }) {
    try {
        const { slug } = params;
        await connectDB();
        
        const product = await Product.findOne({ slug }).populate('relatedProducts');

        if (!product) {
            return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, product });
    } catch (error) {
        console.error("Fetch single product error:", error);
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
}
