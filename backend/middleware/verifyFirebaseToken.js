import admin from "../config/firebase.js";

export const verifyFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers.authorization || "";

  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing Authorization header." });
  }

  const idToken = authHeader.replace("Bearer ", "").trim();

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.firebaseUser = decodedToken;
    return next();
  } catch (error) {
    console.error("Firebase token verification failed:", error);

    return res.status(401).json({
      message: "Invalid or expired session. Please login again.",
    });
  }
};
