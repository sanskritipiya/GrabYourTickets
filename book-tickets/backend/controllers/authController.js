const User = require("../models/User");
const jwt = require("jsonwebtoken");

// ================= JWT =================
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "5d",
  });
};

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ================= REGISTER =================
exports.register = async (req, res) => {
  try {
    console.log("Register request body:", req.body);

    let { name, email, password, role } = req.body;

    // Trim whitespace
    name = name?.trim();
    email = email?.trim()?.toLowerCase();
    password = password?.trim();

    // Required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Better email validation
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid email format",
      });
    }

    // ❌ Duplicate email
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const user = await User.create({
      name,
      email,
      password, // ⚠️ Hash in production with bcrypt
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
    res.status(500).json({
      message: "Server error",
    });
  }
};

// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    console.log("Login request body:", req.body);

    let { email, password, role } = req.body;

    // Trim whitespace
    email = email?.trim()?.toLowerCase();
    password = password?.trim();
    role = role?.trim();

    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Email, password, and role are required",
      });
    }

    // ================= ADMIN LOGIN =================
    if (role === "admin") {
      const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
      const adminPassword = process.env.ADMIN_PASSWORD;

      if (email !== adminEmail || password !== adminPassword) {
        return res.status(403).json({
          message: "Invalid admin credentials",
        });
      }

      // Find or create admin user
      let adminUser = await User.findOne({
        email: adminEmail,
        role: "admin",
      });

      if (!adminUser) {
        console.log("Creating admin user in database...");
        adminUser = await User.create({
          name: "Admin",
          email: adminEmail,
          password: adminPassword,
          role: "admin",
        });
        console.log("Admin user created successfully");
      }

      return res.status(200).json({
        id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role,
        token: generateToken(adminUser._id, adminUser.role),
      });
    }

    // ================= USER LOGIN =================
    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    if (user.role !== "user") {
      return res.status(403).json({
        message: "Access denied. This is a user login.",
      });
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
    res.status(500).json({
      message: "Server error",
    });
  }
};