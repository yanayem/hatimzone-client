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

        const cleanPhone = String(phone).trim();
        const admin = await Admin.findOne({ phone: cleanPhone });

        if (!admin) {
            return NextResponse.json({
                success: false,
                message: "❌ Phone number not found in system. Please check and try again.",
            });
        }

        // Generate a random temporary password
        const tempPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(tempPassword, 10);

        await Admin.findByIdAndUpdate(admin._id, {
            password: hashedPassword,
            isTempPassword: true, // Mark as temporary so they are forced to change it
            passwordChanged: false,
        });

        return NextResponse.json({
            success: true,
            message: `✅ Password reset successfully! Your new temporary password is: ${tempPassword}\n\nPlease login and change it immediately in settings.`,
            tempPassword, // Return it so the UI can show it if needed, but the message already has it
        });
    } catch (error) {
        console.error("Forgot password error:", error);
        return NextResponse.json({ success: false, message: "Server error" });
    }
}

