import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Category from "@/models/Category";
import jwt from "jsonwebtoken";

async function verifyAdmin(req) {
    const token = req.cookies.get('adminToken')?.value;
    if (!token) return false;
    try {
        jwt.verify(token, process.env.JWT_SECRET);
        return true;
    } catch (e) {
        return false;
    }
}

function generateSlug(text) {
    return text
        .trim()
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
}

export async function GET(req) {
    try {
        await connectDB();
        const categories = await Category.find().sort({ name: 1 });
        return NextResponse.json({ success: true, categories });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        if (!await verifyAdmin(req)) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const body = await req.json();
        const { name, subCategories } = body;

        if (!name) {
            return NextResponse.json({ success: false, message: "Category name is required" }, { status: 400 });
        }

        const slug = generateSlug(name);

        // Check if category or slug already exists
        const existing = await Category.findOne({
            $or: [{ name: name.trim() }, { slug }]
        });

        if (existing) {
            return NextResponse.json({ success: false, message: "Category already exists" }, { status: 400 });
        }

        const newCategory = await Category.create({
            name: name.trim(),
            slug,
            subCategories: subCategories || []
        });

        return NextResponse.json({ success: true, category: newCategory }, { status: 201 });
    } catch (error) {
        console.error("CATEGORY ERROR:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}