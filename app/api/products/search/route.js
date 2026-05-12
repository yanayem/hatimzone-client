import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const q = searchParams.get("q");

        if (!q) {
            return NextResponse.json({ success: true, data: [] });
        }

        await connectDB();
        
        const products = await Product.find({
            $or: [
                { name: { $regex: q, $options: "i" } },
                { category: { $regex: q, $options: "i" } },
                { tags: { $in: [new RegExp(q, "i")] } }
            ]
        })
        .select("name cover")
        .limit(5)
        .lean();

        return NextResponse.json({ success: true, data: products });
    } catch (error) {
        console.error("Search API Error:", error);
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
}
