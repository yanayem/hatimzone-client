import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { jwtVerify } from 'jose';

// Helper for Auth
async function verifyAdmin(req) {
    const token = req.cookies.get('adminToken')?.value;
    if (!token) return false;
    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        await jwtVerify(token, secret);
        return true;
    } catch (e) {
        return false;
    }
}

export async function DELETE(req, { params }) {
    try {
        if (!await verifyAdmin(req)) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const { id } = await params;

        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function GET(req, { params }) {
    try {
        await connectDB();
        const { id } = await params;
        const product = await Product.findById(id);
        if (!product) {
            return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
        }
        return NextResponse.json({ success: true, product });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
export async function PUT(req, { params }) {
    try {
        if (!await verifyAdmin(req)) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const { id } = await params;
        const body = await req.json();

        const { name, description, price, discountPrice, category, stockQuantity, stockStatus, sizes, tags, images, isNewArrival, isTopSelling, isFeatured } = body;

        const updatedProduct = await Product.findByIdAndUpdate(id, {
            name,
            description,
            price: Number(price),
            discountPrice: Number(discountPrice || 0),
            category,
            stockQuantity: Number(stockQuantity || 0),
            stockStatus,
            sizes: Array.isArray(sizes) ? sizes : String(sizes).split(',').map(s => s.trim()).filter(Boolean),
            tags: Array.isArray(tags) ? tags : [],
            images,
            isNewArrival: Boolean(isNewArrival),
            isTopSelling: Boolean(isTopSelling),
            isFeatured: Boolean(isFeatured),
        }, { new: true });

        if (!updatedProduct) {
            return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Product updated successfully", product: updatedProduct });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
