import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import Admin from "@/models/Admin";

export async function POST(req) {
    try {
        await connectDB();

        const token = req.cookies.get("adminToken")?.value;
        if (!token) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

        let decoded;
        try {
            const secret = process.env.JWT_SECRET || "fallback_secret";
            decoded = jwt.verify(token, secret);
        } catch (err) {
            return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
        }

        const body = await req.json().catch(() => null);
        if (!body) return NextResponse.json({ success: false, message: "Invalid body" }, { status: 400 });

        const { email, password } = body;
        const updateData = {};

        if (email && email.trim() !== "") {
            updateData.email = email.trim().toLowerCase();
        }

        if (password && password.trim() !== "") {
            updateData.password = await bcrypt.hash(password, 10);
            updateData.passwordChanged = true;
        }

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ success: false, message: "Nothing to update" });
        }

        const updatedAdmin = await Admin.findByIdAndUpdate(decoded.id, updateData, { new: true });

        return NextResponse.json({
            success: true,
            message: "Profile updated successfully",
            admin: {
                email: updatedAdmin.email,
            }
        });

    } catch (error) {
        console.error("Update profile error:", error);
        return NextResponse.json({ success: false, message: "Server error" });
    }
}
