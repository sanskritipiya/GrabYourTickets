const Cinema = require("../models/Cinema");
const Show = require("../models/Show");


/// GET ALL CINEMAS (SAFE LOCATION FILTER)
exports.getAllCinemas = async (req, res) => {
  try {
    const filter = {};

    if (req.query.location && req.query.location !== "All") {
      const location = decodeURIComponent(req.query.location).trim();

      // Use case-insensitive regex without word boundaries
      filter.location = {
        $regex: new RegExp(location, "i")
      };
    }

    const cinemas = await Cinema.find(filter).sort({ name: 1 });

    res.status(200).json({
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

// GET CINEMA BY ID
exports.getCinemaById = async (req, res) => {
  try {
    const cinema = await Cinema.findById(req.params.id);

    if (!cinema) {
      return res.status(404).json({
        success: false,
        message: "Cinema not found"
      });
    }

    res.status(200).json({
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

// GET CINEMA WITH ITS SHOWS
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
      .populate("movieId", "title poster duration genre")
      .sort({ showDate: 1, time: 1 });

    res.status(200).json({
      success: true,
      data: { cinema, shows }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ADMIN SIDE//

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

    res.status(200).json({
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

exports.deleteCinema = async (req, res) => {
  try {
    const cinema = await Cinema.findByIdAndDelete(req.params.id);

    if (!cinema) {
      return res.status(404).json({
        success: false,
        message: "Cinema not found"
      });
    }

    await Show.deleteMany({ cinemaId: cinema._id });

    res.status(200).json({
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
