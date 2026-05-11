import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        slug: { type: String, unique: true, sparse: true },
        brand: { type: String, default: "Generic" },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        discountPrice: { type: Number, default: 0 },
        
        // Product Details
        material: { type: String, default: "Solid Wood / Laminated Board" },
        warranty: { type: String, default: "1 Year Service Warranty" },
        dimensions: {
            length: { type: String },
            width: { type: String },
            height: { type: String }
        },

        // Shipping Info
        deliveryCost: {
            insideDhaka: { type: Number, default: 60 },
            outsideDhaka: { type: Number, default: 120 }
        },

        specifications: {
            type: Map,
            of: String,
            default: {}
        },

        category: { type: String, required: true },
        stockQuantity: { type: Number, required: true, default: 0 },
        stockStatus: { type: String, enum: ["In Stock", "Out of Stock"], default: "In Stock" },
        
        images: { type: [String], required: true },
        tags: { type: [String], default: [] },
        
        // Filtering & Promotion
        isNewArrival: { type: Boolean, default: false },
        isTopSelling: { type: Boolean, default: false },
        isFeatured: { type: Boolean, default: false },
        
        averageRating: { type: Number, default: 0 },
        totalReviews: { type: Number, default: 0 },
    },
    { timestamps: true }
);

ProductSchema.pre("save", async function () {
    if (this.isModified("name") || !this.slug) {
        this.slug = this.name
            .toLowerCase()
            .replace(/[^\w ]+/g, "")
            .replace(/ +/g, "-") + "-" + Math.random().toString(36).substring(2, 7);
    }
});

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);