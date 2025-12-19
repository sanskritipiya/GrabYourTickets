const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");

// User & Admin routes (same API handles role-based login)
router.post("/register", register);
router.post("/login", login);

module.exports = router;
