import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const VariantSchema = new mongoose.Schema(
  {
    size: String,
    color: String,
    material: String,
    stock: {
      type: Number,
      default: 0,
      min: 0
    },
    additionalPrice: {
      type: Number,
      default: 0,
      min: 0
    },
  },
  { _id: false }
);

const ProductSchema = new mongoose.Schema(
  {
    // BASIC INFO
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      index: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    },
    brand: {
      type: String,
      default: "Generic",
      index: true
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
    },

    // PRICE
    price: {
      type: Number,
      required: [true, "Base price is required"],
      min: [0, "Price cannot be negative"]
    },
    discountPrice: {
      type: Number,
      default: 0,
      min: [0, "Discount price cannot be negative"]
    },

    // CATEGORY
    category: {
      type: String,
      required: [true, "Category is required"],
      index: true
    },

    // GALLERY
    images: {
      type: [String],
      required: [true, "At least one image is required"],
      validate: [(val) => val.length > 0, "At least one image is required"]
    },
    videos: {
      type: [String],
      default: [],
    },

    // VARIANTS
    variants: {
      type: [VariantSchema],
      default: [],
    },

    // STOCK
    stockQuantity: {
      type: Number,
      default: 0,
      min: [0, "Stock cannot be negative"]
    },
    stockStatus: {
      type: String,
      enum: ["In Stock", "Out of Stock"],
      default: "In Stock",
    },

    // SPECS
    specifications: {
      type: Map,
      of: String,
      default: {},
    },
    usageInstructions: {
      type: [String],
      default: [],
    },
    material: String,
    color: String,
    bulbType: String,
    wattage: String,
    powerSource: String,
    warranty: String,
    dimensions: {
      length: String,
      width: String,
      height: String,
    },

    // SHIPPING
    deliveryCost: {
      insideDhaka: { type: Number, default: 60 },
      outsideDhaka: { type: Number, default: 120 },
    },

    // TAGS & PROMO
    tags: [String],
    isNewArrival: { type: Boolean, default: false, index: true },
    isTopSelling: { type: Boolean, default: false, index: true },
    isFeatured: { type: Boolean, default: false, index: true },

    // REVIEWS & RATINGS
    reviews: [ReviewSchema],
    averageRating: { type: Number, default: 0, index: true },
    totalReviews: { type: Number, default: 0 },

    // RELATIONS
    relatedProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes for faster searching and filtering
ProductSchema.index({ createdAt: -1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ name: 'text', description: 'text' });

// Pre-validate Middleware
ProductSchema.pre("validate", async function () {
  // 1. Generate Slug if needed
  if (this.isModified("name") || !this.slug) {
    let baseSlug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    
    // Add unique suffix
    const random = Math.random().toString(36).substring(2, 7);
    this.slug = `${baseSlug}-${random}`;
  }

  // 2. Update Stock Status
  this.stockStatus = this.stockQuantity > 0 ? "In Stock" : "Out of Stock";

  // 3. Recalculate Rating
  if (this.isModified("reviews")) {
    if (this.reviews?.length > 0) {
      const sum = this.reviews.reduce((acc, rev) => acc + rev.rating, 0);
      this.averageRating = Number((sum / this.reviews.length).toFixed(1));
      this.totalReviews = this.reviews.length;
    } else {
      this.averageRating = 0;
      this.totalReviews = 0;
    }
  }
});

if (process.env.NODE_ENV === "development") {
  delete mongoose.models.Product;
}
const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

export default Product;
