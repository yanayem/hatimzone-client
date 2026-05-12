import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

const AdminSchema = new mongoose.Schema({
    email: String,
});

const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);

async function check() {
    try {
        await mongoose.connect(MONGODB_URI);
        const count = await Admin.countDocuments();
        console.log("Admin count:", count);
        const admins = await Admin.find({});
        console.log("Admins:", admins);
        process.exit(0);
    } catch (e) {
        console.error("Error:", e);
        process.exit(1);
    }
}

check();
