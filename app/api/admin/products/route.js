import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import jwt from "jsonwebtoken";

export async function POST(req) {
    try {
        const token = req.cookies.get('adminToken')?.value;
        if (!token) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

        try {
            jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            return NextResponse.json({ success: false, message: "Invalid session" }, { status: 401 });
        }

        await connectDB();
        const body = await req.json();
        
        const { 
            name, brand, description, price, discountPrice, 
            category, subCategory, stockQuantity, 
            specifications, material, color, bulbType, wattage, powerSource, warranty,
            dimensions, deliveryCost, tags, images, videos, variants, usageInstructions,
            isNewArrival, isTopSelling, isFeatured, relatedProducts
        } = body;

        if (!name || !price || !images || images.length === 0) {
            return NextResponse.json({ 
                success: false, 
                message: "Missing required fields (name, price, or images)" 
            }, { status: 400 });
        }

        const newProduct = await Product.create({
            name,
            brand: brand || "Generic",
            description,
            price: Number(price),
            discountPrice: Number(discountPrice || 0),
            category,
            subCategory: subCategory || "",
            stockQuantity: Number(stockQuantity || 0),
            specifications: specifications || {},
            material: material || "Metal / Glass / Wood",
            color: color || "Black",
            bulbType: bulbType || "LED",
            wattage: wattage || "",
            powerSource: powerSource || "Electric",
            warranty: warranty || "1 Year Warranty",
            dimensions: dimensions || { length: "", width: "", height: "" },
            deliveryCost: deliveryCost || { insideDhaka: 60, outsideDhaka: 120 },
            tags: Array.isArray(tags) ? tags : [],
            images,
            videos: Array.isArray(videos) ? videos : [],
            variants: Array.isArray(variants) ? variants : [],
            usageInstructions: Array.isArray(usageInstructions) ? usageInstructions : [],
            relatedProducts: Array.isArray(relatedProducts) ? relatedProducts : [],
            isNewArrival: Boolean(isNewArrival),
            isTopSelling: Boolean(isTopSelling),
            isFeatured: Boolean(isFeatured),
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

export async function GET(req) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const limit = searchParams.get("limit");
        const category = searchParams.get("category");
        const isFeatured = searchParams.get("featured");

        let query = {};
        if (category) query.category = category;
        if (isFeatured === "true") query.isFeatured = true;

        let findQuery = Product.find(query).sort({ createdAt: -1 });
        if (limit) findQuery = findQuery.limit(Number(limit));

        const products = await findQuery;
        
        return NextResponse.json({ success: true, products });
    } catch (error) {
        console.error("Fetch products error:", error);
        return NextResponse.json({ success: false, message: "Failed to fetch products" }, { status: 500 });
    }
}
