/**
 * Middleware to require specific role(s)
 * Must be used after verifyFirebaseToken and attachAppUser
 * 
 * @param {...string} allowedRoles - One or more allowed roles
 * @returns {Function} Express middleware
 */
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    // User should already be attached by attachAppUser middleware
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    // Check if user has required role
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Required role: ${allowedRoles.join(" or ")}`,
      });
    }

    // Check if user is active
    if (!req.user.isActive) {
      return res.status(403).json({
        message: "Account is deactivated. Please contact administrator.",
      });
    }

    return next();
  };
};
