import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import Admin from "@/models/Admin";

export async function POST(req) {
    try {
        await connectDB();

        // 🔐 Get token
        const token = req.cookies.get("adminToken")?.value;

        if (!token) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return NextResponse.json(
                { success: false, message: "Invalid or expired token" },
                { status: 401 }
            );
        }

        // 📦 body parse
        const body = await req.json().catch(() => null);

        if (!body) {
            return NextResponse.json(
                { success: false, message: "Invalid request body" },
                { status: 400 }
            );
        }

        const { username, phone, password } = body;

        // 🧠 update object
        const updateData = {};

        if (username && username.trim() !== "") {
            updateData.username = username.trim();
        }

        if (phone && phone.trim() !== "") {
            updateData.phone = phone.trim();
        }

        // 🔐 password update
        if (password && password.trim() !== "") {
            updateData.password = await bcrypt.hash(password, 10);
            updateData.isTempPassword = false;
            updateData.passwordChanged = true;
        }

        // ❌ nothing to update check
        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({
                success: false,
                message: "Nothing to update",
            });
        }

        // 💾 update DB
        const updatedAdmin = await Admin.findByIdAndUpdate(decoded.id, updateData, {
            new: true,
        });

        return NextResponse.json({
            success: true,
            message: "Profile updated successfully",
            admin: {
                username: updatedAdmin.username,
                phone: updatedAdmin.phone,
            }
        });

    } catch (error) {
        console.error("Update profile error:", error);

        // JWT errors
        if (
            error.name === "JsonWebTokenError" ||
            error.name === "TokenExpiredError"
        ) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        // duplicate key error
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern || {})[0];
            return NextResponse.json({
                success: false,
                message: `${field} already exists`,
            });
        }

        return NextResponse.json({
            success: false,
            message: "Server error",
        });
    }
}
