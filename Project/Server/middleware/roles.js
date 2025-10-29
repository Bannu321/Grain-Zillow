const { ROLES } = require("../config/constants");

/**
 * Role-Based Authorization Middleware
 * Restricts access based on user roles
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. ${req.user.role} role is not authorized to access this resource.`,
      });
    }

    next();
  };
};

/**
 * Self or Admin Authorization Middleware
 * Allows users to access their own data or admin to access any data
 */
const authorizeSelfOrAdmin = (paramName = "id") => {
  return (req, res, next) => {
    const requestedId = req.params[paramName] || req.body.userId;

    if (!requestedId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    if (req.user.role === "admin" || req.user._id.toString() === requestedId) {
      return next();
    }

    res.status(403).json({
      success: false,
      message: "Access denied. You can only access your own data.",
    });
  };
};

/**
 * Manager or Admin Authorization Middleware
 * Allows managers to access their managed resources or admin to access all
 */
const authorizeManagerOrAdmin = () => {
  return (req, res, next) => {
    if (req.user.role === "admin" || req.user.role === "manager") {
      return next();
    }

    res.status(403).json({
      success: false,
      message: "Access denied. Manager or Admin role required.",
    });
  };
};

module.exports = authorize;
