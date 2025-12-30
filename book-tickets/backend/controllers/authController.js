const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Generate JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "5d" }); 
};

// Register a new user
exports.register = async (req, res) => {
  try {
    console.log("Register request body:", req.body);

    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({
      name: name.trim(),
      email: email.trim(),
      password: password.trim(), // For production, hash passwords!
      role: role || "user",
    });

    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Login for user or admin
exports.login = async (req, res) => {
  try {
    console.log("Login request body:", req.body);

    let { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: "Email, password, and role are required" });
    }

    email = email.trim();
    password = password.trim();
    role = role.trim();

    // Admin login
    if (role === "admin") {
      if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
        return res.status(403).json({ message: "Invalid admin credentials" });
      }

      return res.status(200).json({
        id: "admin",
        name: "Admin",
        email: process.env.ADMIN_EMAIL,
        role: "admin",
        token: generateToken("admin", "admin"),
      });
    }

    // User login
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (user.role !== "user") {
      return res.status(403).json({ message: "Access denied. This is a user login." });
    }

    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};