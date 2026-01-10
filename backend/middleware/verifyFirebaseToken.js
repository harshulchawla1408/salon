import admin from "../config/firebase.js";

/**
 * Middleware to verify Firebase ID token
 * Only verifies token and attaches decoded Firebase user to req.firebaseUser
 */
export const verifyFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers.authorization || "";

  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ 
      message: "Missing or invalid Authorization header. Expected format: Bearer <token>" 
    });
  }

  const idToken = authHeader.replace("Bearer ", "").trim();

  if (!idToken) {
    return res.status(401).json({ 
      message: "Token is required" 
    });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    
    // Extract user info from Firebase token
    // For phone auth: phone_number is in token.phone_number
    // For email auth: email is in token.email
    // For OAuth (Google/Apple): name and email are in token
    // uid is always present
    req.firebaseUser = {
      uid: decodedToken.uid,
      email: decodedToken.email || null,
      phone_number: decodedToken.phone_number || null,
      name: decodedToken.name || null,
    };
    
    return next();
  } catch (error) {
    console.error("Firebase token verification failed:", error.code, error.message);

    // Provide specific error messages based on error type
    if (error.code === "auth/id-token-expired") {
      return res.status(401).json({
        message: "Session expired. Please login again.",
      });
    }

    if (error.code === "auth/argument-error") {
      return res.status(401).json({
        message: "Invalid token format.",
      });
    }

    return res.status(401).json({
      message: "Invalid or expired session. Please login again.",
    });
  }
};
