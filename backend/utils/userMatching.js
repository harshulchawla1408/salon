import User from "../models/User.js";

/**
 * Find or create user with priority matching:
 * 1. Firebase UID (uid)
 * 2. Phone number (phone)
 * 3. Email address (email)
 * 
 * Prevents duplicate users and preserves role assignments
 * 
 * @param {Object} firebaseUser - Decoded Firebase token data
 * @param {string} firebaseUser.uid - Firebase UID (required)
 * @param {string} [firebaseUser.email] - Email address
 * @param {string} [firebaseUser.phone_number] - Phone number
 * @param {string} [firebaseUser.name] - User name
 * @returns {Promise<Object>} MongoDB user document
 */
export async function findOrCreateUser(firebaseUser) {
  const { uid, email, phone_number: phoneNumber, name } = firebaseUser;

  if (!uid) {
    throw new Error("Firebase UID is required");
  }

  // Priority 1: Match by Firebase UID (most reliable)
  let user = await User.findOne({ uid });

  if (user) {
    // Update user info from Firebase while preserving role
    const updates = {};
    if (email && email.trim() && user.email !== email) {
      updates.email = email.trim();
    }
    if (phoneNumber && phoneNumber.trim() && user.phone !== phoneNumber) {
      updates.phone = phoneNumber.trim();
    }
    if (name && name.trim() && user.name !== name) {
      updates.name = name.trim();
    }

    if (Object.keys(updates).length > 0) {
      Object.assign(user, updates);
      await user.save();
    }

    return user;
  }

  // Priority 2: Match by phone number (if provided and not empty)
  if (phoneNumber && phoneNumber.trim()) {
    user = await User.findOne({ phone: phoneNumber.trim() });

    if (user) {
      // Link Firebase UID to existing user (user logged in with different method)
      // Preserve existing role - CRITICAL: never overwrite role
      // Only update uid if it's not already set (prevents conflicts)
      if (!user.uid) {
        // Check if uid is already assigned to another user (prevent duplicate)
        const existingUidUser = await User.findOne({ uid });
        if (existingUidUser && existingUidUser._id.toString() !== user._id.toString()) {
          // UID conflict - return the existing user with that UID instead
          return existingUidUser;
        }
        
        user.uid = uid;
      } else if (user.uid !== uid) {
        // User already has different UID - return that user instead
        // This means the phone number is linked to a different Firebase account
        return user;
      }
      
      // Update other fields if changed
      if (email && email.trim() && user.email !== email.trim().toLowerCase()) {
        user.email = email.trim().toLowerCase();
      }
      if (name && name.trim() && user.name !== name.trim()) {
        user.name = name.trim();
      }

      await user.save();
      return user;
    }
  }

  // Priority 3: Match by email (if provided and not empty)
  if (email && email.trim()) {
    user = await User.findOne({ email: email.trim().toLowerCase() });

    if (user) {
      // Link Firebase UID to existing user (user logged in with different method)
      // Preserve existing role - CRITICAL: never overwrite role
      // Only update uid if it's not already set (prevents conflicts)
      if (!user.uid) {
        // Check if uid is already assigned to another user (prevent duplicate)
        const existingUidUser = await User.findOne({ uid });
        if (existingUidUser && existingUidUser._id.toString() !== user._id.toString()) {
          // UID conflict - return the existing user with that UID instead
          return existingUidUser;
        }
        
        user.uid = uid;
      } else if (user.uid !== uid) {
        // User already has different UID - return that user instead
        // This means the email is linked to a different Firebase account
        return user;
      }
      
      // Update other fields if changed
      if (phoneNumber && phoneNumber.trim() && user.phone !== phoneNumber.trim()) {
        user.phone = phoneNumber.trim();
      }
      if (name && name.trim() && user.name !== name.trim()) {
        user.name = name.trim();
      }

      await user.save();
      return user;
    }
  }

  // No match found - create new user
  // Use atomic operation to prevent race conditions
  try {
    user = await User.create({
      uid,
      email: email ? email.trim().toLowerCase() : "",
      phone: phoneNumber ? phoneNumber.trim() : "",
      name: name ? name.trim() : "",
      role: "user", // Default role
      isActive: true,
    });

    return user;
  } catch (createError) {
    // Handle race condition: user might have been created by concurrent request
    if (createError.code === 11000) {
      // Try to find by uid again (most likely scenario)
      user = await User.findOne({ uid });
      if (user) {
        return user;
      }

      // If still not found, try phone/email one more time
      if (phoneNumber && phoneNumber.trim()) {
        user = await User.findOne({ phone: phoneNumber.trim() });
        if (user) {
          user.uid = uid;
          if (email && email.trim()) user.email = email.trim().toLowerCase();
          if (name && name.trim()) user.name = name.trim();
          await user.save();
          return user;
        }
      }

      if (email && email.trim()) {
        user = await User.findOne({ email: email.trim().toLowerCase() });
        if (user) {
          user.uid = uid;
          if (phoneNumber && phoneNumber.trim()) user.phone = phoneNumber.trim();
          if (name && name.trim()) user.name = name.trim();
          await user.save();
          return user;
        }
      }

      // If we still can't find the user, throw the original error
      throw createError;
    }

    throw createError;
  }
}
