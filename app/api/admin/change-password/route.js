import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import Admin from "@/models/Admin";

export async function POST(req) {
    try {
        await connectDB();

        const token = req.cookies.get('adminToken')?.value;
        if (!token) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { password } = await req.json();

        if (!password) {
            return NextResponse.json({ success: false, message: "Password required" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await Admin.findByIdAndUpdate(decoded.id, {
            password: hashedPassword,
            isTempPassword: false,
            passwordChanged: true,
        });

        return NextResponse.json({ success: true, message: "Password updated" });
    } catch (error) {
        console.error("Change password error:", error);
        return NextResponse.json({
            success: false,
            message: "Invalid request",
        });
    }
}
