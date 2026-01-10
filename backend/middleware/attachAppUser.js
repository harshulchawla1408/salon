import User from "../models/User.js";

/**
 * Middleware to fetch MongoDB user using Firebase UID
 * Auto-creates user if not found (for walk-in customers or first-time login)
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

    const { uid, email, phone_number: phoneNumber, name } = req.firebaseUser;
    
    // Find existing user by Firebase UID
    let user = await User.findOne({ uid });

    if (!user) {
      // Auto-create user if not found in MongoDB
      // This ensures all authenticated users exist in MongoDB
      // Default role is 'user' - admin/barber/receptionist roles should be set manually
      try {
        user = await User.create({
          uid,
          email: email || "",
          phone: phoneNumber || "",
          name: name || "",
          role: "user", // Default role
          isActive: true,
        });
        console.log(`✅ Auto-created MongoDB user for Firebase UID: ${uid}`);
      } catch (createError) {
        // Handle duplicate key errors (shouldn't happen with uid, but handle email/phone conflicts)
        if (createError.code === 11000) {
          // Try to find user by alternative unique field
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
      
      // Only update if there are changes
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

    return next(error);
  }
};
