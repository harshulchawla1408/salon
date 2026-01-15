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
      index: true,
      sparse: true,
    },
    phone: {
      type: String,
      default: "",
      index: true,
      sparse: true,
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
    activeSessionToken: {
      type: String,
      default: null,
      index: true,
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

// ✅ CORRECT: async-style hook WITHOUT next
userSchema.pre("save", function () {
  if (this.isNew && !this.createdAt) {
    this.createdAt = new Date();
  }
});

export default mongoose.models.User || mongoose.model("User", userSchema);
export { roles };
