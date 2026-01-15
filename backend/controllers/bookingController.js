import Booking from "../models/Booking.js";
import BarberAvailability from "../models/BarberAvailability.js";
import User from "../models/User.js";
import mongoose from "mongoose";

/**
 * Create booking (User or Receptionist)
 * POST /api/bookings
 * Body: { barberId, serviceId, date, startTime, endTime, customerName?, customerPhone? }
 */
export const createBooking = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { barberId, serviceId, date, startTime, endTime, customerName, customerPhone } =
      req.body;
    const currentUser = req.user;

    // Validate required fields
    if (!barberId || !serviceId || !date || !startTime || !endTime) {
      await session.abortTransaction();
      return res.status(400).json({
        message: "barberId, serviceId, date, startTime, and endTime are required",
      });
    }

    // Parse date
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    // Find availability for the barber and date
    const availability = await BarberAvailability.findOne({
      barberId,
      date: targetDate,
    }).session(session);

    if (!availability) {
      await session.abortTransaction();
      return res.status(404).json({
        message: "No availability found for this barber on this date",
      });
    }

    // Find the specific slot index
    const slotIndex = availability.slots.findIndex(
      (slot) => slot.startTime === startTime && slot.endTime === endTime
    );

    if (slotIndex === -1) {
      await session.abortTransaction();
      return res.status(404).json({
        message: "Slot not found in barber availability",
      });
    }

    // Atomic check: slot must not be booked
    if (availability.slots[slotIndex].isBooked) {
      await session.abortTransaction();
      return res.status(409).json({
        message: "This slot is already booked",
      });
    }

    // Determine booking user
    let bookingUserId = currentUser._id;
    let bookedByName = null;
    let bookedByPhone = null;

    // If receptionist is booking for walk-in customer
    if (currentUser.role === "receptionist") {
      if (!customerName || !customerPhone) {
        await session.abortTransaction();
        return res.status(400).json({
          message: "customerName and customerPhone are required for walk-in bookings",
        });
      }
      bookedByName = customerName.trim();
      bookedByPhone = customerPhone.trim();
      
      // For walk-ins, create or find a temporary user
      // Use phone number to find existing walk-in user, or create new one
      let walkInUser = await User.findOne({ phone: bookedByPhone, role: "user" }).session(session);
      
      if (!walkInUser) {
        // Create temporary user for walk-in (no Firebase UID)
        // Use a special format: "walkin_" + phone
        walkInUser = await User.create(
          [
            {
              uid: `walkin_${Date.now()}_${bookedByPhone.replace(/\D/g, "")}`,
              name: bookedByName,
              phone: bookedByPhone,
              email: "",
              role: "user",
              isActive: true,
            },
          ],
          { session }
        );
        bookingUserId = walkInUser[0]._id;
      } else {
        bookingUserId = walkInUser._id;
        // Update name if different
        if (walkInUser.name !== bookedByName) {
          walkInUser.name = bookedByName;
          await walkInUser.save({ session });
        }
      }
    }

    // Create booking
    const booking = await Booking.create(
      [
        {
          userId: bookingUserId,
          barberId,
          serviceId,
          bookingDate: targetDate,
          slotStartTime: startTime,
          slotEndTime: endTime,
          status: "booked",
          availabilityId: availability._id,
          customerName: bookedByName || currentUser.name,
          customerPhone: bookedByPhone || currentUser.phone,
          bookedBy: currentUser.role === "receptionist" ? currentUser._id : null,
        },
      ],
      { session }
    );

    // Mark slot as booked (atomic update)
    availability.slots[slotIndex].isBooked = true;
    availability.slots[slotIndex].bookedBy = bookingUserId;
    availability.slots[slotIndex].bookingId = booking[0]._id;

    await availability.save({ session });

    await session.commitTransaction();

    // Populate references
    const populatedBooking = await Booking.findById(booking[0]._id)
      .populate("barberId", "name")
      .populate("serviceId", "name duration price")
      .populate("userId", "name");

    return res.status(201).json(populatedBooking);
  } catch (error) {
    await session.abortTransaction();
    console.error("Error creating booking:", error);
    return next(error);
  } finally {
    session.endSession();
  }
};

/**
 * Get user's bookings
 * GET /api/bookings
 */
export const getUserBookings = async (req, res, next) => {
  try {
    const currentUser = req.user;
    const { status, date } = req.query;

    const query = { userId: currentUser._id };
    if (status) {
      query.status = status;
    }
    if (date) {
      const targetDate = new Date(date);
      targetDate.setHours(0, 0, 0, 0);
      query.bookingDate = targetDate;
    }

    const bookings = await Booking.find(query)
      .populate("barberId", "name")
      .populate("serviceId", "name duration price")
      .sort({ bookingDate: 1, slotStartTime: 1 });

    return res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return next(error);
  }
};

/**
 * Get barber's bookings for a date
 * GET /api/bookings/barber/:barberId?date=YYYY-MM-DD
 */
export const getBarberBookings = async (req, res, next) => {
  try {
    const { barberId } = req.params;
    const { date } = req.query;
    const currentUser = req.user;

    // Verify barber is viewing their own bookings OR admin/receptionist is viewing
    if (
      currentUser.role !== "admin" &&
      currentUser.role !== "receptionist" &&
      currentUser._id.toString() !== barberId
    ) {
      return res.status(403).json({
        message: "You can only view your own bookings",
      });
    }

    const query = { barberId, status: "booked" };
    if (date) {
      const targetDate = new Date(date);
      targetDate.setHours(0, 0, 0, 0);
      query.bookingDate = targetDate;
    }

    const bookings = await Booking.find(query)
      .populate("userId", "name phone")
      .populate("serviceId", "name duration price")
      .sort({ slotStartTime: 1 });

    return res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching barber bookings:", error);
    return next(error);
  }
};

/**
 * Cancel booking
 * PATCH /api/bookings/:id/cancel
 */
export const cancelBooking = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const currentUser = req.user;

    const booking = await Booking.findById(id).session(session);
    if (!booking) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Booking not found" });
    }

    // Verify user can cancel (owner, admin, or receptionist)
    if (
      currentUser.role !== "admin" &&
      currentUser.role !== "receptionist" &&
      booking.userId.toString() !== currentUser._id.toString()
    ) {
      await session.abortTransaction();
      return res.status(403).json({
        message: "You can only cancel your own bookings",
      });
    }

    if (booking.status !== "booked") {
      await session.abortTransaction();
      return res.status(400).json({
        message: "Only booked appointments can be cancelled",
      });
    }

    // Update booking status
    booking.status = "cancelled";
    await booking.save({ session });

    // Free up the slot
    const availability = await BarberAvailability.findById(
      booking.availabilityId
    ).session(session);

    if (availability) {
      const slotIndex = availability.slots.findIndex(
        (slot) =>
          slot.startTime === booking.slotStartTime &&
          slot.endTime === booking.slotEndTime &&
          slot.bookingId?.toString() === booking._id.toString()
      );

      if (slotIndex !== -1) {
        availability.slots[slotIndex].isBooked = false;
        availability.slots[slotIndex].bookedBy = null;
        availability.slots[slotIndex].bookingId = null;
        await availability.save({ session });
      }
    }

    await session.commitTransaction();
    return res.status(200).json(booking);
  } catch (error) {
    await session.abortTransaction();
    console.error("Error cancelling booking:", error);
    return next(error);
  } finally {
    session.endSession();
  }
};

/**
 * Complete booking (Barber only)
 * PATCH /api/bookings/:id/complete
 */
export const completeBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const currentUser = req.user;

    if (currentUser.role !== "barber" && currentUser.role !== "admin") {
      return res.status(403).json({
        message: "Only barbers can mark bookings as complete",
      });
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Verify barber owns this booking
    if (
      currentUser.role !== "admin" &&
      booking.barberId.toString() !== currentUser._id.toString()
    ) {
      return res.status(403).json({
        message: "You can only complete your own bookings",
      });
    }

    if (booking.status !== "booked") {
      return res.status(400).json({
        message: "Only booked appointments can be completed",
      });
    }

    booking.status = "completed";
    await booking.save();

    return res.status(200).json(booking);
  } catch (error) {
    console.error("Error completing booking:", error);
    return next(error);
  }
};
