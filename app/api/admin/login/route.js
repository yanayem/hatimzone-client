import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Admin from "@/models/Admin";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export async function POST(req) {
    try {
        await connectDB();

        let body;
        try {
            body = await req.json();
        } catch (e) {
            return NextResponse.json({ success: false, message: "Invalid JSON body" }, { status: 400 });
        }

        const { identifier, password } = body;

        if (!identifier || !password) {
            return NextResponse.json({
                success: false,
                message: "Username/Phone and password required",
            });
        }

        const cleanIdentifier = String(identifier).trim();
        const admin = await Admin.findOne({
            $or: [
                { username: cleanIdentifier },
                { phone: cleanIdentifier }
            ]
        });

        if (!admin) {
            return NextResponse.json({
                success: false,
                message: "Invalid credentials",
            });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return NextResponse.json({
                success: false,
                message: "Invalid credentials",
            });
        }

        const token = jwt.sign(
            { id: admin._id, username: admin.username },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Set Cookie
        const response = NextResponse.json({
            success: true,
            isTempPassword: admin.isTempPassword,
            passwordChanged: admin.passwordChanged,
            token, // User's code used localStorage.setItem("adminToken", data.token);
        });

        response.cookies.set('adminToken', token, {
            httpOnly: true,
            secure: false, // Set to false for development ease, or use process.env.NODE_ENV === 'production'
            sameSite: 'lax', // Changed from 'strict' to 'lax' for better cross-page behavior
            maxAge: 7 * 24 * 60 * 60, // 7 days
            path: '/',
        });

        return response;
    } catch (error) {
        console.error("Login error detail:", error);
        return NextResponse.json({
            success: false,
            message: error.message || "Server error during login",
        }, { status: 500 });
    }
}
