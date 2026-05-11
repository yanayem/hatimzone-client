import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Category from "@/models/Category";
import { jwtVerify } from 'jose';

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
        const { name, subCategories } = await req.json();

        if (!name) {
            return NextResponse.json({ success: false, message: "Category name is required" }, { status: 400 });
        }

        const newCategory = await Category.create({
            name,
            subCategories: subCategories || []
        });

        return NextResponse.json({ success: true, category: newCategory });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
