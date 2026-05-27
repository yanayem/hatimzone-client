import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Admin from "@/models/Admin";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export async function POST(req) {
    try {
        console.log("LOGIN ATTEMPT START");
        await connectDB();
        console.log("DB CONNECTED");

        let body;
        try {
            body = await req.json();
            console.log("BODY PARSED", { identifier: body.identifier });
        } catch (e) {
            console.error("JSON PARSE ERROR", e);
            return NextResponse.json({ success: false, message: "Invalid JSON body" }, { status: 400 });
        }

        const { identifier, password } = body; 

        if (!identifier || !password) {
            console.log("MISSING CREDENTIALS");
            return NextResponse.json({
                success: false,
                message: "Email and password required",
            });
        }

        const cleanEmail = String(identifier).trim().toLowerCase();
        console.log("LOOKING FOR ADMIN", cleanEmail);
        const admin = await Admin.findOne({ email: cleanEmail }).lean();

        if (!admin) {
            console.log("ADMIN NOT FOUND");
            return NextResponse.json({
                success: false,
                message: "Invalid credentials",
            });
        }

        console.log("COMPARING PASSWORD");
        const isMatch = await bcrypt.compare(String(password), admin.password);
        if (!isMatch) {
            console.log("PASSWORD MISMATCH");
            return NextResponse.json({
                success: false,
                message: "Invalid credentials",
            });
        }

        console.log("GENERATING TOKEN");
        const secret = process.env.JWT_SECRET || "fallback_secret";
        const token = jwt.sign(
            { id: admin._id.toString(), email: admin.email },
            secret,
            { expiresIn: "7d" }
        );

        console.log("SETTING COOKIE");
        const cookieStore = await cookies();
        cookieStore.set('adminToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60,
            path: '/',
        });

        console.log("LOGIN SUCCESSFUL");
        return NextResponse.json({
            success: true,
            passwordChanged: admin.passwordChanged,
        });
    } catch (error) {
        console.error("CRITICAL LOGIN ERROR:", error);
        return NextResponse.json({
            success: false,
            message: "Server error during login: " + error.message,
        }, { status: 500 });
    }
}
