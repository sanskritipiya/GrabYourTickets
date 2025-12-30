const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protect routes
exports.protect = async (req, res, next) => {
  console.log("AUTH HEADER:", req.headers.authorization);

  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const token = authHeader.split(" ")[1];

    // ✅ VERIFY TOKEN (do NOT ignore expiration)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🟢 FAKE ADMIN FROM ENV (SAFE)
    if (
      decoded.email === process.env.ADMIN_EMAIL ||
      decoded.role === "admin"
    ) {
      req.user = {
        id: process.env.ADMIN_ID, // MUST be valid ObjectId
        role: "admin",
        email: process.env.ADMIN_EMAIL,
        name: "Admin",
      };
      return next();
    }

    // 🟢 NORMAL USER
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }


    req.user = {
      id: user._id.toString(),
      role: user.role,
      email: user.email,
      name: user.name,
    };

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({ message: "Authentication failed" });
  }
};

// Admin only middleware (UNCHANGED)
exports.admin = (req, res, next) => {
  if (req.user?.role === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Admin access only" });
};