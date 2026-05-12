import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET || "fallback";

const AdminSchema = new mongoose.Schema({
    email: String,
    password: String,
});

const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);

async function testLogin() {
    try {
        await mongoose.connect(MONGODB_URI);
        const identifier = "admin@gmail.com";
        const password = "admin"; // I am guessing the password was 'admin' during setup

        const admin = await Admin.findOne({ email: identifier });
        if (!admin) {
            console.log("Admin not found");
            process.exit(1);
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        console.log("isMatch:", isMatch);

        const token = jwt.sign(
            { id: admin._id.toString(), email: admin.email },
            JWT_SECRET,
            { expiresIn: "7d" }
        );
        console.log("Token generated successfully");

        process.exit(0);
    } catch (e) {
        console.error("Login test failed:", e);
        process.exit(1);
    }
}

testLogin();
