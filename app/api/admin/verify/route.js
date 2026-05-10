import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import Admin from "@/models/Admin";

export async function GET(req) {
    try {
        const token = req.cookies.get('adminToken')?.value;
        if (!token) {
            return NextResponse.json({ success: false }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        await connectDB();
        const admin = await Admin.findById(decoded.id);

        if (!admin) {
            return NextResponse.json({ success: false }, { status: 401 });
        }

        return NextResponse.json({ 
            success: true, 
            admin: {
                id: admin._id,
                username: admin.username,
                phone: admin.phone,
                isTempPassword: admin.isTempPassword,
                passwordChanged: admin.passwordChanged
            }
        });
    } catch (error) {
        console.error("Verify error:", error);
        return NextResponse.json({ success: false }, { status: 401 });
    }
}
