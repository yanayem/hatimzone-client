import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    subCategories: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// AUTO GENERATE SLUG
CategorySchema.pre("validate", async function () {
  if (this.isModified("name") && !this.slug) {
    this.slug = this.name
      .trim()
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
  }
});

if (process.env.NODE_ENV === "development") {
  delete mongoose.models.Category;
}
const Category =
  mongoose.models.Category ||
  mongoose.model("Category", CategorySchema);

export default Category;
