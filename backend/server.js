import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import connectDB from "./config/db.js";
import { verifyFirebaseToken } from "./middleware/verifyFirebaseToken.js";
import { attachAppUser } from "./middleware/attachAppUser.js";
import {
  login,
  getCurrentUser,
  logout,
} from "./controllers/authController.js";
import {
  getServices,
  getService,
  createService,
  updateService,
} from "./controllers/serviceController.js";
import {
  getBarbers,
  getBarbersWithAvailability,
  getBarberAvailability,
  setBarberAvailability,
} from "./controllers/availabilityController.js";
import {
  createBooking,
  getUserBookings,
  getBarberBookings,
  cancelBooking,
  completeBooking,
} from "./controllers/bookingController.js";
import {
  getUsers,
  updateUserRole,
  updateUser,
} from "./controllers/userController.js";
import { requireRole } from "./middleware/requireRole.js";

const app = express();
const port = process.env.PORT || 5000;
const allowedOrigins = process.env.CLIENT_ORIGIN
  ? process.env.CLIENT_ORIGIN.split(",").map((origin) => origin.trim())
  : ["http://localhost:3000"];

app.set("trust proxy", 1);

const corsOptions = {
  origin(origin, callback) {
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
};

const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: "Too many auth requests. Try again in a minute.",
});

app.use(cors(corsOptions));
app.use(helmet());
app.use(hpp());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Login endpoint - verifies Firebase token and returns role
app.post(
  "/api/auth/login",
  authLimiter,
  verifyFirebaseToken,
  login
);

// Get current user profile
app.get(
  "/auth/me",
  verifyFirebaseToken,
  attachAppUser,
  getCurrentUser
);

// Logout endpoint
app.post(
  "/api/auth/logout",
  verifyFirebaseToken,
  attachAppUser,
  logout
);

// ==================== SERVICES ====================
// Get all services (public)
app.get("/api/services", getServices);

// Get single service (public)
app.get("/api/services/:id", getService);

// Create service (Admin only)
app.post(
  "/api/services",
  verifyFirebaseToken,
  attachAppUser,
  requireRole("admin"),
  createService
);

// Update service (Admin only)
app.patch(
  "/api/services/:id",
  verifyFirebaseToken,
  attachAppUser,
  requireRole("admin"),
  updateService
);

// ==================== BARBERS ====================
// Get all barbers (public)
app.get("/api/barbers", getBarbers);

// Get barbers with availability (Receptionist/Admin)
app.get(
  "/api/barbers/with-availability",
  verifyFirebaseToken,
  attachAppUser,
  requireRole("receptionist", "admin"),
  getBarbersWithAvailability
);

// ==================== AVAILABILITY ====================
// Get barber availability (public)
app.get("/api/availability/:barberId", getBarberAvailability);

// Set barber availability (Barber or Admin)
app.post(
  "/api/availability",
  verifyFirebaseToken,
  attachAppUser,
  requireRole("barber", "admin"),
  setBarberAvailability
);

// ==================== BOOKINGS ====================
// Create booking (User or Receptionist)
app.post(
  "/api/bookings",
  verifyFirebaseToken,
  attachAppUser,
  requireRole("user", "receptionist"),
  createBooking
);

// Get user's bookings
app.get(
  "/api/bookings",
  verifyFirebaseToken,
  attachAppUser,
  requireRole("user", "receptionist", "admin"),
  getUserBookings
);

// Get barber's bookings
app.get(
  "/api/bookings/barber/:barberId",
  verifyFirebaseToken,
  attachAppUser,
  requireRole("barber", "admin", "receptionist"),
  getBarberBookings
);

// Cancel booking
app.patch(
  "/api/bookings/:id/cancel",
  verifyFirebaseToken,
  attachAppUser,
  cancelBooking
);

// Complete booking (Barber only)
app.patch(
  "/api/bookings/:id/complete",
  verifyFirebaseToken,
  attachAppUser,
  requireRole("barber", "admin"),
  completeBooking
);

// ==================== USERS (Admin only) ====================
// Get all users
app.get(
  "/api/users",
  verifyFirebaseToken,
  attachAppUser,
  requireRole("admin"),
  getUsers
);

// Update user role
app.patch(
  "/api/users/:id/role",
  verifyFirebaseToken,
  attachAppUser,
  requireRole("admin"),
  updateUserRole
);

// Update user
app.patch(
  "/api/users/:id",
  verifyFirebaseToken,
  attachAppUser,
  requireRole("admin"),
  updateUser
);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.statusCode || 500;
  res.status(status).json({
    message: err.message || "Internal server error",
  });
});

const startServer = async () => {
  await connectDB();

  app.listen(port, () => {
    console.log(`🚀 API ready on http://localhost:${port}`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
