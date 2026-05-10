import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        slug: {
            type: String,
            unique: true,
            sparse: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        discountPrice: {
            type: Number,
            default: 0,
        },
        category: {
            type: String,
            required: true,
        },
        stockQuantity: {
            type: Number,
            required: true,
            default: 0,
        },
        stockStatus: {
            type: String,
            enum: ["In Stock", "Out of Stock"],
            default: "In Stock",
        },
        sizes: {
            type: [String],
            default: [],
        },
        tags: {
            type: [String],
            default: [],
        },
        images: {
            type: [String],
            required: true,
        },
        isNewArrival: {
            type: Boolean,
            default: false,
        },
        isTopSelling: {
            type: Boolean,
            default: false,
        },
        isFeatured: {
            type: Boolean,
            default: false,
        },
        isAvailable: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

// Pre-save hook to generate slug
ProductSchema.pre("save", function (next) {
    if (this.isModified("name") || !this.slug) {
        this.slug = this.name
            .toLowerCase()
            .replace(/[^\w ]+/g, "")
            .replace(/ +/g, "-") + "-" + Math.random().toString(36).substring(2, 7);
    }
    next();
});

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
