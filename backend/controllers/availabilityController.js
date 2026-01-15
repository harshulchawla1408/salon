import BarberAvailability from "../models/BarberAvailability.js";
import User from "../models/User.js";
import Booking from "../models/Booking.js";

/**
 * Get barber availability for a specific date
 * GET /api/availability/:barberId?date=YYYY-MM-DD
 */
export const getBarberAvailability = async (req, res, next) => {
  try {
    const { barberId } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: "Date parameter is required" });
    }

    // Parse date and set to start of day
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    // Verify barber exists and has barber role
    const barber = await User.findById(barberId);
    if (!barber || barber.role !== "barber") {
      return res.status(404).json({ message: "Barber not found" });
    }

    let availability = await BarberAvailability.findOne({
      barberId,
      date: targetDate,
    });

    // If no availability exists, return empty slots
    if (!availability) {
      return res.status(200).json({
        barberId,
        date: targetDate,
        slots: [],
      });
    }

    return res.status(200).json(availability);
  } catch (error) {
    console.error("Error fetching availability:", error);
    return next(error);
  }
};

/**
 * Set barber availability for a date (Barber only)
 * POST /api/availability
 * Body: { barberId, date, slots: [{ startTime, endTime }] }
 */
export const setBarberAvailability = async (req, res, next) => {
  try {
    const { barberId, date, slots } = req.body;
    const currentUser = req.user;

    // Verify barber is setting their own availability OR admin is setting it
    if (currentUser.role !== "admin" && currentUser._id.toString() !== barberId) {
      return res.status(403).json({
        message: "You can only set your own availability",
      });
    }

    // Verify barber exists and has barber role
    const barber = await User.findById(barberId);
    if (!barber || barber.role !== "barber") {
      return res.status(404).json({ message: "Barber not found" });
    }

    if (!date || !Array.isArray(slots)) {
      return res.status(400).json({
        message: "Date and slots array are required",
      });
    }

    // Parse date and set to start of day
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    // Validate slots
    for (const slot of slots) {
      if (!slot.startTime || !slot.endTime) {
        return res.status(400).json({
          message: "Each slot must have startTime and endTime",
        });
      }
    }

    // Check if any slots are already booked
    const existingAvailability = await BarberAvailability.findOne({
      barberId,
      date: targetDate,
    });

    if (existingAvailability) {
      // Check for booked slots
      const bookedSlots = existingAvailability.slots.filter((s) => s.isBooked);
      if (bookedSlots.length > 0) {
        return res.status(400).json({
          message: "Cannot modify availability with existing bookings",
        });
      }

      // Update existing availability
      existingAvailability.slots = slots.map((slot) => ({
        startTime: slot.startTime,
        endTime: slot.endTime,
        isBooked: false,
        bookedBy: null,
        bookingId: null,
      }));

      await existingAvailability.save();
      return res.status(200).json(existingAvailability);
    }

    // Create new availability
    const availability = await BarberAvailability.create({
      barberId,
      date: targetDate,
      slots: slots.map((slot) => ({
        startTime: slot.startTime,
        endTime: slot.endTime,
        isBooked: false,
        bookedBy: null,
        bookingId: null,
      })),
      isActive: true,
    });

    return res.status(201).json(availability);
  } catch (error) {
    console.error("Error setting availability:", error);
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Availability already exists for this date",
      });
    }
    return next(error);
  }
};

/**
 * Get all barbers (for selection in booking)
 */
export const getBarbers = async (req, res, next) => {
  try {
    const barbers = await User.find({
      role: "barber",
      isActive: true,
    }).select("name email phone _id");

    return res.status(200).json(barbers);
  } catch (error) {
    console.error("Error fetching barbers:", error);
    return next(error);
  }
};

/**
 * Get barbers with today's availability and bookings (for Receptionist/Admin)
 * GET /api/barbers/with-availability?date=YYYY-MM-DD
 */
export const getBarbersWithAvailability = async (req, res, next) => {
  try {
    const { date } = req.query;
    const targetDate = date ? new Date(date) : new Date();
    targetDate.setHours(0, 0, 0, 0);

    // Get all active barbers
    const barbers = await User.find({
      role: "barber",
      isActive: true,
    }).select("name email phone _id");

    // Get availability and bookings for each barber
    const barbersWithData = await Promise.all(
      barbers.map(async (barber) => {
        const availability = await BarberAvailability.findOne({
          barberId: barber._id,
          date: targetDate,
        });

        const bookings = await Booking.find({
          barberId: barber._id,
          bookingDate: targetDate,
          status: "booked",
        })
          .populate("userId", "name phone")
          .populate("serviceId", "name duration price")
          .sort({ slotStartTime: 1 });

        const totalSlots = availability?.slots.length || 0;
        const bookedSlots = availability?.slots.filter((s) => s.isBooked).length || 0;
        const freeSlots = totalSlots - bookedSlots;

        return {
          ...barber.toObject(),
          availability: availability || null,
          bookings: bookings,
          stats: {
            totalSlots,
            bookedSlots,
            freeSlots,
            utilization: totalSlots > 0 ? Math.round((bookedSlots / totalSlots) * 100) : 0,
          },
        };
      })
    );

    return res.status(200).json(barbersWithData);
  } catch (error) {
    console.error("Error fetching barbers with availability:", error);
    return next(error);
  }
};
