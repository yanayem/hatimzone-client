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
                message: "Email and password required",
            });
        }

        const cleanEmail = String(identifier).trim().toLowerCase();
        const admin = await Admin.findOne({ email: cleanEmail });

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
            { id: admin._id, email: admin.email },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        const response = NextResponse.json({
            success: true,
            passwordChanged: admin.passwordChanged,
            token,
        });

        response.cookies.set('adminToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60,
            path: '/',
        });

        return response;
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({
            success: false,
            message: "Server error during login",
        }, { status: 500 });
    }
}
