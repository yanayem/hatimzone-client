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

export async function PUT(req, { params }) {
    try {
        if (!await verifyAdmin(req)) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const { id } = await params;
        const { name, subCategories } = await req.json();

        const updatedCategory = await Category.findByIdAndUpdate(
            id,
            { name, subCategories },
            { new: true }
        );

        if (!updatedCategory) {
            return NextResponse.json({ success: false, message: "Category not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, category: updatedCategory });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        if (!await verifyAdmin(req)) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const { id } = await params;
        await Category.findByIdAndDelete(id);

        return NextResponse.json({ success: true, message: "Category deleted" });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
