import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        isTempPassword: {
            type: Boolean,
            default: true,
        },
        passwordChanged: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

export default mongoose.models.Admin || mongoose.model("Admin", AdminSchema);
