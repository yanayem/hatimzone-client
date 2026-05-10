import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Admin from "@/models/Admin";
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

        const { phone } = body;

        if (!phone) {
            return NextResponse.json({
                success: false,
                message: "Phone number is required",
            });
        }

        const admin = await Admin.findOne({ phone: phone.trim() });

        if (!admin) {
            return NextResponse.json({
                success: false,
                message: "Admin with this phone number not found",
            });
        }

        // 2. generate temp password (reliable 8-char string)
        const tempPass = Math.random().toString(36).substring(2, 10).toUpperCase();
        const hashedPassword = await bcrypt.hash(tempPass, 10);

        await Admin.findByIdAndUpdate(admin._id, {
            password: hashedPassword,
            isTempPassword: true,
            passwordChanged: false,
        });

        return NextResponse.json({
            success: true,
            message: `Temporary password for admin "${admin.username}" is: ${tempPass}`,
            tempPassword: tempPass,
            username: admin.username,
        });
    } catch (error) {
        console.error("Forgot password error:", error);
        return NextResponse.json({ success: false, message: "Server error" });
    }
}
