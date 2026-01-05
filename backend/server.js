import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import xssClean from "xss-clean";

import connectDB from "./config/db.js";
import { verifyFirebaseToken } from "./middleware/verifyFirebaseToken.js";
import { attachAppUser } from "./middleware/attachAppUser.js";
import {
  syncUserFromFirebase,
  getActiveSession,
} from "./controllers/authController.js";

const app = express();
const port = process.env.PORT || 5001;
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
app.use(xssClean());
app.use(morgan("dev"));

app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.post(
  "/api/auth/sync",
  authLimiter,
  verifyFirebaseToken,
  syncUserFromFirebase
);

app.get(
  "/api/auth/session",
  verifyFirebaseToken,
  attachAppUser,
  getActiveSession
);

app.get(
  "/auth/me",
  verifyFirebaseToken,
  attachAppUser,
  (req, res) => {
    const user = req.appUser;
    res.json({
      id: user._id,
      role: user.role,
      phone: user.phoneNumber,
    });
  }
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
