import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    userName: String,

    rating: {
      type: Number,
      min: 1,
      max: 5,
    },

    comment: String,
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
    },

    additionalPrice: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
);

const ProductSchema = new mongoose.Schema(
  {
    // BASIC INFO
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    brand: {
      type: String,
      default: "Generic",
    },

    description: {
      type: String,
      required: true,
    },

    // PRICE
    price: {
      type: Number,
      required: true,
    },

    discountPrice: {
      type: Number,
      default: 0,
    },

    // CATEGORY
    category: {
      type: String,
      required: true,
    },

    subCategory: {
      type: String,
      default: "",
    },

    // GALLERY IMAGES
    images: {
      type: [String],
      required: true,
    },

    // PRODUCT VIDEOS
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
    },

    stockStatus: {
      type: String,
      enum: ["In Stock", "Out of Stock"],
      default: "In Stock",
    },

    // SPECIFICATIONS
    specifications: {
      type: Map,
      of: String,
      default: {},
    },

    // USAGE INSTRUCTIONS
    usageInstructions: {
      type: [String],
      default: [],
    },

    // PRODUCT DETAILS
    material: {
      type: String,
      default: "Metal / Glass / Wood",
    },

    color: {
      type: String,
      default: "Black",
    },

    bulbType: {
      type: String,
      default: "LED",
    },

    wattage: {
      type: String,
      default: "",
    },

    powerSource: {
      type: String,
      default: "Electric",
    },

    warranty: {
      type: String,
      default: "1 Year Warranty",
    },

    dimensions: {
      length: String,
      width: String,
      height: String,
    },

    // SHIPPING
    deliveryCost: {
      insideDhaka: {
        type: Number,
        default: 60,
      },

      outsideDhaka: {
        type: Number,
        default: 120,
      },
    },

    // TAGS
    tags: {
      type: [String],
      default: [],
    },

    // PROMOTION
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

    // REVIEWS
    reviews: {
      type: [ReviewSchema],
      default: [],
    },

    averageRating: {
      type: Number,
      default: 0,
    },

    totalReviews: {
      type: Number,
      default: 0,
    },

    // RELATED PRODUCTS
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

// AUTO SLUG + STOCK
ProductSchema.pre("save", function () {
  // SLUG
  if (this.isModified("name") || !this.slug) {
    const random = Math.random()
      .toString(36)
      .substring(2, 7);

    this.slug =
      this.name
        .trim()
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-") +
      "-" +
      random;
  }

  // STOCK STATUS
  this.stockStatus =
    this.stockQuantity > 0
      ? "In Stock"
      : "Out of Stock";

  // REVIEW CALCULATION
  if (this.reviews.length > 0) {
    const total = this.reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );

    this.averageRating =
      total / this.reviews.length;

    this.totalReviews =
      this.reviews.length;
  }
});

const Product =
  mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);

export default Product;