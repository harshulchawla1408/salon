import mongoose from "mongoose";

const roles = ["admin", "barber", "user", "receptionist"];

const userSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: roles,
      default: "user",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure createdAt is set on creation
userSchema.pre("save", function (next) {
  if (this.isNew && !this.createdAt) {
    this.createdAt = new Date();
  }
  next();
});

export default mongoose.models.User || mongoose.model("User", userSchema);
export { roles };
