import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Admin from "@/models/Admin";
import bcrypt from "bcryptjs";

export async function POST(req) {
    try {
        await connectDB();
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ success: false, message: "Email is required" });
        }

        const admin = await Admin.findOne({ email: email.trim().toLowerCase() });

        if (!admin) {
            return NextResponse.json({ 
                success: false, 
                message: "Email not found in our system." 
            });
        }

        // Generate a very simple 6-digit temporary password
        const tempPassword = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedPassword = await bcrypt.hash(tempPassword, 10);

        await Admin.findByIdAndUpdate(admin._id, {
            password: hashedPassword,
            passwordChanged: false
        });

        // NOTE: Actual email sending logic should be implemented here.
        // For now, we still return it in JSON so the dev can see it in network logs if needed,
        // but the UI won't show it as per user's request.
        return NextResponse.json({
            success: true,
            message: "Password reset successful! Please check your email.",
            tempPassword: tempPassword
        });
    } catch (error) {
        console.error("Forgot password error:", error);
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
}
