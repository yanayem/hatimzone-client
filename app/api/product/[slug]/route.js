import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import mongoose from "mongoose";

export async function GET(req, { params }) {
    try {
        const { slug } = await params;
        await connectDB();
        
        // Try finding by slug first, then by ID if slug is a valid ObjectId
        let product;
        product = await Product.findOne({ slug }).populate('relatedProducts').lean();

        if (!product && mongoose.Types.ObjectId.isValid(slug)) {
            product = await Product.findById(slug).populate('relatedProducts').lean();
        }

        if (!product) {
            return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
        }

        // Dynamically fetch other products from same category if relatedProducts is empty
        let related = product.relatedProducts || [];
        if (related.length < 4) {
            let extra = await Product.find({
                category: product.category,
                _id: { $ne: product._id }
            })
            .limit(4 - related.length)
            .select('name price discountPrice images slug category brand cover')
            .lean();
            
            // If still empty, fetch any latest products
            if (extra.length === 0) {
                extra = await Product.find({
                    _id: { $ne: product._id }
                })
                .sort({ createdAt: -1 })
                .limit(4)
                .select('name price discountPrice images slug category brand cover')
                .lean();
            }
            
            related = [...related, ...extra];
        }

        return NextResponse.json({ 
            success: true, 
            product,
            related: related.slice(0, 4)
        });
    } catch (error) {
        console.error("Fetch single product error:", error);
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
}
