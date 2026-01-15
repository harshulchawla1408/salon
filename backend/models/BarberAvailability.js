import mongoose from "mongoose";

// Slot schema embedded in BarberAvailability
const slotSchema = new mongoose.Schema(
  {
    startTime: {
      type: String, // Format: "HH:MM" (e.g., "10:00")
      required: true,
    },
    endTime: {
      type: String, // Format: "HH:MM" (e.g., "10:30")
      required: true,
    },
    isBooked: {
      type: Boolean,
      default: false,
    },
    bookedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      default: null,
    },
  },
  { _id: false }
);

const barberAvailabilitySchema = new mongoose.Schema(
  {
    barberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    slots: [slotSchema],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient queries
barberAvailabilitySchema.index({ barberId: 1, date: 1 }, { unique: true });

export default mongoose.models.BarberAvailability ||
  mongoose.model("BarberAvailability", barberAvailabilitySchema);
