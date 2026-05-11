import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema(
    {
        
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        passwordChanged: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

export default mongoose.models.Admin || mongoose.model("Admin", AdminSchema);
