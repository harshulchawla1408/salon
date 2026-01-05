import User from "../models/User.js";

export const attachAppUser = async (req, res, next) => {
  try {
    const { uid } = req.firebaseUser;
    const user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      return res.status(404).json({ message: "User profile not found." });
    }

    req.appUser = user;
    return next();
  } catch (error) {
    return next(error);
  }
};
