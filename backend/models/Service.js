import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    duration: {
      type: Number, // Duration in minutes
      required: true,
      min: 15,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    gender: {
      type: String,
      enum: ["male", "female", "unisex"],
      default: "unisex",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Service || mongoose.model("Service", serviceSchema);
