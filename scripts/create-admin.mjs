import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables from .env
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import Model directly
const AdminSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    passwordChanged: { type: Boolean, default: true },
});

const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);

async function createAdmin() {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error("❌ MONGODB_URI not found in .env");
        process.exit(1);
    }

    try {
        await mongoose.connect(uri);
        console.log("📡 Connected to MongoDB...");

        // Take arguments from command line
        const [,, email, password] = process.argv;

        if (!email || !password) {
            console.log("\n🚀 Admin Creation Script (email-password)");
            console.log("Usage: node scripts/create-admin.mjs <email> <password>");
            console.log("Example: node scripts/create-admin.mjs admin@example.com mypassword\n");
            process.exit(0);
        }

        // Check if admin already exists
        const existing = await Admin.findOne({ email: email.toLowerCase().trim() });
        if (existing) {
            console.error("❌ Admin with this email already exists.");
            process.exit(1);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = new Admin({
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            passwordChanged: true
        });

        await newAdmin.save();
        console.log(`\n✅ Superuser created successfully!`);
        console.log(`Email: ${email}\n`);

    } catch (error) {
        console.error("❌ Error:", error.message);
    } finally {
        await mongoose.disconnect();
    }
}

createAdmin();
