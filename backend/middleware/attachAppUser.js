import { findOrCreateUser } from "../utils/userMatching.js";

/**
 * Middleware to fetch MongoDB user using Firebase UID
 * Auto-creates user if not found using priority matching (uid → phone → email)
 * Attaches MongoDB user to req.user
 */
export const attachAppUser = async (req, res, next) => {
  try {
    // Firebase user should already be attached by verifyFirebaseToken middleware
    if (!req.firebaseUser || !req.firebaseUser.uid) {
      return res.status(401).json({ 
        message: "Firebase authentication required" 
      });
    }

    // Find or create user using priority matching (uid → phone → email)
    const user = await findOrCreateUser(req.firebaseUser);

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({
        message: "Account is deactivated. Please contact administrator.",
      });
    }

    // Verify session token matches (prevent multiple active sessions)
    const token = req.headers.authorization?.replace("Bearer ", "").trim();
    if (user.activeSessionToken && user.activeSessionToken !== token) {
      return res.status(401).json({
        message: "Another session is active. Please logout and login again.",
      });
    }

    // Attach MongoDB user to request
    req.user = user;
    return next();
  } catch (error) {
    console.error("Error attaching app user:", error);
    
    // Handle MongoDB errors
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Invalid user data",
        errors: Object.values(error.errors).map(e => e.message),
      });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        message: "User account conflict. Please try again.",
      });
    }

    return next(error);
  }
};
