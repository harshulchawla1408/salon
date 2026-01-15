import mongoose from "mongoose";

const bookingStatuses = ["booked", "completed", "cancelled"];

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    barberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    bookingDate: {
      type: Date,
      required: true,
      index: true,
    },
    slotStartTime: {
      type: String, // Format: "HH:MM"
      required: true,
    },
    slotEndTime: {
      type: String, // Format: "HH:MM"
      required: true,
    },
    status: {
      type: String,
      enum: bookingStatuses,
      default: "booked",
      required: true,
    },
    // Reference to the slot in BarberAvailability
    availabilityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BarberAvailability",
      required: true,
    },
    // Customer details (for walk-ins booked by receptionist)
    customerName: {
      type: String,
      default: "",
    },
    customerPhone: {
      type: String,
      default: "",
    },
    bookedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Receptionist who booked for walk-in
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
bookingSchema.index({ barberId: 1, date: 1, status: 1 });
bookingSchema.index({ userId: 1, date: 1, status: 1 });

export default mongoose.models.Booking || mongoose.model("Booking", bookingSchema);
export { bookingStatuses };
