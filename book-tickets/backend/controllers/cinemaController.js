const Cinema = require("../models/Cinema");
const Show = require("../models/Show");


// PUBLIC: Get all cinemas (optionally by location)
exports.getAllCinemas = async (req, res) => {
  try {
    const filter = {};

    // Optional location filter
    if (req.query.location) {
      filter.location = req.query.location;
    }

    const cinemas = await Cinema.find(filter);

    res.json({
      success: true,
      data: cinemas
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// PUBLIC: Get cinema by ID
exports.getCinemaById = async (req, res) => {
  try {
    const cinema = await Cinema.findById(req.params.id);

    if (!cinema) {
      return res.status(404).json({
        success: false,
        message: "Cinema not found"
      });
    }

    res.json({
      success: true,
      data: cinema
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// PUBLIC: Get cinema with its shows
exports.getCinemaWithShows = async (req, res) => {
  try {
    const cinema = await Cinema.findById(req.params.id);

    if (!cinema) {
      return res.status(404).json({
        success: false,
        message: "Cinema not found"
      });
    }

    const shows = await Show.find({ cinemaId: cinema._id })
      .populate("movieId", "title")
      .sort({ showDate: 1, time: 1 });

    res.json({
      success: true,
      data: {
        cinema,
        shows
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* ================= ADMIN ================= */

// ADMIN: Add cinema
exports.addCinema = async (req, res) => {
  try {
    const cinema = await Cinema.create(req.body);

    res.status(201).json({
      success: true,
      data: cinema
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// ADMIN: Update cinema
exports.updateCinema = async (req, res) => {
  try {
    const cinema = await Cinema.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!cinema) {
      return res.status(404).json({
        success: false,
        message: "Cinema not found"
      });
    }

    res.json({
      success: true,
      data: cinema
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// ADMIN: Delete cinema (also deletes its shows)
exports.deleteCinema = async (req, res) => {
  try {
    const cinema = await Cinema.findByIdAndDelete(req.params.id);

    if (!cinema) {
      return res.status(404).json({
        success: false,
        message: "Cinema not found"
      });
    }

    // Delete related shows
    await Show.deleteMany({ cinemaId: cinema._id });

    res.json({
      success: true,
      message: "Cinema and related shows deleted"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};