import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { jwtVerify } from 'jose';

export async function POST(req) {
    try {
        // Auth check (simple)
        const token = req.cookies.get('adminToken')?.value;
        if (!token) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        try {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET);
            await jwtVerify(token, secret);
        } catch (error) {
            return NextResponse.json({ success: false, message: "Invalid session" }, { status: 401 });
        }

        await connectDB();
        const body = await req.json();
        
        const { 
            name, 
            description, 
            price, 
            discountPrice, 
            category, 
            stockQuantity, 
            stockStatus, 
            sizes, 
            tags, 
            images 
        } = body;

        if (!name || !price || !images || images.length === 0) {
            return NextResponse.json({ 
                success: false, 
                message: "Missing required fields (name, price, or images)" 
            }, { status: 400 });
        }

        const newProduct = await Product.create({
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
        });

        return NextResponse.json({
            success: true,
            message: "Product added successfully!",
            product: newProduct,
        });
    } catch (error) {
        console.error("Add product error:", error);
        return NextResponse.json({ 
            success: false, 
            message: error.message || "Server error while adding product" 
        }, { status: 500 });
    }
}

// GET all products
export async function GET(req) {
    try {
        await connectDB();
        const products = await Product.find().sort({ createdAt: -1 });
        
        // Map old data to new format for display
        const sanitizedProducts = products.map(p => {
            const obj = p.toObject();
            return {
                ...obj,
                price: obj.price || 0,
                discountPrice: obj.discountPrice || 0,
                stockQuantity: obj.stockQuantity !== undefined ? obj.stockQuantity : (obj.stock !== undefined ? obj.stock : 0),
                tags: Array.isArray(obj.tags) ? obj.tags : [],
                images: Array.isArray(obj.images) ? obj.images : [],
                stockStatus: obj.stockStatus || ( (obj.stockQuantity ?? obj.stock ?? 0) > 0 ? "In Stock" : "Out of Stock" )
            };
        });

        return NextResponse.json({ success: true, products: sanitizedProducts });
    } catch (error) {
        return NextResponse.json({ success: false, message: "Failed to fetch products" }, { status: 500 });
    }
}
