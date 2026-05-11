import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema(
  {
    shippingInsideDhaka: {
      type: Number,
      default: 70,
    },
    shippingOutsideDhaka: {
      type: Number,
      default: 130,
    },
    contactNumber: {
      type: String,
      default: "01700-000000",
    },
    siteName: {
      type: String,
      default: "Hatim Zone",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Settings || mongoose.model("Settings", SettingsSchema);
