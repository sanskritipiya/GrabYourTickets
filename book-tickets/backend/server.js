const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const movieRoutes = require("./routes/movieRoutes");

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);     // Login/Register
app.use("/api/movies", movieRoutes);  // Public & Admin movie routes

// Default route
app.get("/", (req, res) => {
  res.send("GrabYourTickets API is running!");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
