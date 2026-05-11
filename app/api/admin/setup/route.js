import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Admin from "@/models/Admin";
import bcrypt from "bcryptjs";

export async function GET() {
    try {
        await connectDB();
        const count = await Admin.countDocuments();
        return NextResponse.json({ success: true, count });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        await connectDB();
        
        const count = await Admin.countDocuments();
        if (count > 0) {
            return NextResponse.json({ 
                success: false, 
                message: "Setup already completed." 
            }, { status: 403 });
        }

        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ 
                success: false, 
                message: "Email and password are required" 
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = new Admin({
            email: email.trim().toLowerCase(),
            password: hashedPassword,
            passwordChanged: true
        });

        await newAdmin.save();

        return NextResponse.json({ 
            success: true, 
            message: "Initial Admin created successfully!" 
        });

    } catch (error) {
        console.error("Setup error:", error);
        return NextResponse.json({ 
            success: false, 
            message: "Server error during setup" 
        }, { status: 500 });
    }
}
