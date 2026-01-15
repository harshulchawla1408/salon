import { findOrCreateUser } from "../utils/userMatching.js";
import User from "../models/User.js";

/**
 * Login endpoint - Verifies Firebase token and syncs/creates MongoDB user
 * This is called after Firebase authentication succeeds
 * Returns the user's role for dashboard redirection
 */
export const login = async (req, res, next) => {
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

    // Update active session token (invalidate previous session)
    // Get token from Authorization header
    const token = req.headers.authorization?.replace("Bearer ", "").trim();
    user.activeSessionToken = token;
    await user.save();

    // Return only role for dashboard redirection
    return res.status(200).json({
      role: user.role,
    });
  } catch (error) {
    console.error("Login error:", error);

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

/**
 * Get current user session
 * Returns full user profile
 */
export const getCurrentUser = async (req, res) => {
  const user = req.user;

  return res.status(200).json({
    id: user._id,
    uid: user.uid,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    isActive: user.isActive,
  });
};

/**
 * Logout endpoint - Clear active session token
 */
export const logout = async (req, res, next) => {
  try {
    const user = req.user;
    user.activeSessionToken = null;
    await user.save();

    return res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return next(error);
  }
};
