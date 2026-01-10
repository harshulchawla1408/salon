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

    const { uid, email, phone_number: phoneNumber, name } = req.firebaseUser;

    // Find existing user by Firebase UID
    let user = await User.findOne({ uid });

    if (!user) {
      // Create new MongoDB user if doesn't exist
      // Default role is 'user' unless predefined (admin/barber/receptionist)
      // Predefined roles should be set manually in MongoDB by admin
      try {
        user = await User.create({
          uid,
          email: email || "",
          phone: phoneNumber || "",
          name: name || "",
          role: "user",
          isActive: true,
        });
        console.log(`✅ Created new MongoDB user for Firebase UID: ${uid}`);
      } catch (createError) {
        // Handle duplicate key errors
        if (createError.code === 11000) {
          // User might have been created between findOne and create
          user = await User.findOne({ uid });
          if (!user) {
            throw createError;
          }
        } else {
          throw createError;
        }
      }
    } else {
      // Update user info from Firebase if changed
      const updates = {};
      if (email && user.email !== email) {
        updates.email = email;
      }
      if (phoneNumber && user.phone !== phoneNumber) {
        updates.phone = phoneNumber;
      }
      if (name && user.name !== name) {
        updates.name = name;
      }
      
      if (Object.keys(updates).length > 0) {
        Object.assign(user, updates);
        await user.save();
      }
    }

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
