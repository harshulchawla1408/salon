import User from "../models/User.js";

/**
 * Get all users (Admin only)
 * GET /api/users
 */
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({})
      .select("name email phone role isActive createdAt")
      .sort({ createdAt: -1 });

    return res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return next(error);
  }
};

/**
 * Update user role (Admin only)
 * PATCH /api/users/:id/role
 */
export const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!["admin", "barber", "receptionist", "user"].includes(role)) {
      return res.status(400).json({
        message: "Invalid role",
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = role;
    await user.save();

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error updating user role:", error);
    return next(error);
  }
};

/**
 * Update user (Admin only)
 * PATCH /api/users/:id
 */
export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isActive, role } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (isActive !== undefined) {
      user.isActive = isActive;
    }
    if (role && ["admin", "barber", "receptionist", "user"].includes(role)) {
      user.role = role;
    }

    await user.save();
    return res.status(200).json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    return next(error);
  }
};
