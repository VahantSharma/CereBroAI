const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Protect routes - middleware to verify token and grant access
 */
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Get token from header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      // Set token from Bearer token in header
      token = req.headers.authorization.split(" ")[1];
    }

    // Make sure token exists
    if (!token) {
      return res.status(401).json({
        status: "fail",
        message: "Not authorized to access this route",
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return res.status(401).json({
          status: "fail",
          message: "User no longer exists",
        });
      }

      // Add user to request object
      req.user = currentUser;
      next();
    } catch (err) {
      return res.status(401).json({
        status: "fail",
        message: "Not authorized to access this route",
      });
    }
  } catch (err) {
    next(err);
  }
};

/**
 * Authorize by role
 */
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: "fail",
        message: `Role '${req.user.role}' is not authorized to access this route`,
      });
    }
    next();
  };
};
