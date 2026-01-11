import { findOrCreateUser } from "../utils/userMatching.js";

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
