// backend/middleware/auth.js
const jwt = require("jsonwebtoken");

// 1. Basic Token Verification (Are they logged in?)
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token)
    return res.status(401).json({ error: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Contains id, role, and type
    next();
  } catch (err) {
    res.status(403).json({ error: "Invalid or expired token." });
  }
};

// 2. Strict Super Admin Check (For registering new users)
const requireSuperAdmin = (req, res, next) => {
  if (req.user && req.user.role === "super_admin") {
    return next();
  }
  return res
    .status(403)
    .json({ error: "Forbidden: Only Super Admins can perform this action." });
};

// 3. Dynamic Type Check (Matches route params like /api/applications/:type)
const requireDynamicTypeAccess = (req, res, next) => {
  const requiredType = req.params.type; // Will be 'dinner' or 'merch'
  const user = req.user;

  // Super Admins bypass the type check
  if (user.role === "super_admin") return next();

  // Regular Admins must have a type that matches the route
  if (
    user.role === "admin" &&
    (user.type === requiredType || user.type === "all")
  ) {
    return next();
  }

  return res.status(403).json({
    error: `Forbidden: You do not have permission to manage ${requiredType} applications.`,
  });
};

module.exports = { verifyToken, requireSuperAdmin, requireDynamicTypeAccess };
