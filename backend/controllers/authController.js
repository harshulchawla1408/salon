import User from "../models/User.js";

const ensureAustralianNumber = (phoneNumber) => {
  if (!phoneNumber?.startsWith("+61")) {
    throw new Error("ONLY_AUSTRALIA");
  }
};

export const syncUserFromFirebase = async (req, res, next) => {
  try {
    const { uid, phone_number: phoneNumber } = req.firebaseUser;

    ensureAustralianNumber(phoneNumber);

    let user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      user = await User.create({
        firebaseUid: uid,
        phoneNumber,
      });
    } else if (user.phoneNumber !== phoneNumber) {
      user.phoneNumber = phoneNumber;
      await user.save();
    }

    return res.status(200).json({
      user: {
        id: user._id,
        firebaseUid: user.firebaseUid,
        phoneNumber: user.phoneNumber,
        role: user.role,
      },
    });
  } catch (error) {
    if (error.message === "ONLY_AUSTRALIA") {
      return res
        .status(400)
        .json({ message: "Only Australian (+61) numbers are supported." });
    }
    return next(error);
  }
};

export const getActiveSession = async (req, res) => {
  const user = req.appUser;

  return res.status(200).json({
    user: {
      id: user._id,
      firebaseUid: user.firebaseUid,
      phoneNumber: user.phoneNumber,
      role: user.role,
    },
  });
};
