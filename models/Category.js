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
CategorySchema.pre("save", function () {
  if (this.isModified("name")) {
    this.slug = this.name
      .trim()
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
  }
});

const Category =
  mongoose.models.Category ||
  mongoose.model("Category", CategorySchema);

export default Category;