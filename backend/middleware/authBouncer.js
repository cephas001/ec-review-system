// middleware/authBouncer.js

const requireAccess = (requiredType) => {
  return (req, res, next) => {
    // 1. Ensure the user is actually logged in (assuming your JWT middleware runs before this)
    const user = req.user;
    if (!user)
      return res.status(401).json({ error: "Unauthorized. Please log in." });

    // 2. The Super Admin Override (God Mode)
    // Super admins bypass all department checks.
    if (user.role === "super_admin") {
      return next();
    }

    // 3. The Department Check
    // If they are a standard admin, check if their 'type' matches the route they are trying to access
    if (user.role === "admin" && user.type === requiredType) {
      return next();
    }

    // 4. Access Denied
    return res.status(403).json({
      error: `Forbidden: You do not have permission to manage ${requiredType} applications.`,
    });
  };
};

module.exports = { requireAccess };
