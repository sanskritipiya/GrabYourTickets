const Show = require("../models/Show");

exports.getAllShows = async (req, res) => {
  try {
    const { movieId } = req.query;

    const filter = {};
    if (movieId) {
      filter.movieId = movieId;
    }

    const shows = await Show.find(filter)
      .populate("cinemaId", "name location")
      .populate("movieId", "title")
      .sort({ showDate: 1, time: 1 });

    res.json({ success: true, data: shows });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


exports.getShowById = async (req, res) => {
  try {
    const show = await Show.findById(req.params.id)
      .populate("cinemaId", "name")
      .populate("movieId", "title");

    if (!show) {
      return res.status(404).json({
        success: false,
        message: "Show not found"
      });
    }

    res.json({ success: true, data: show });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.addShow = async (req, res) => {
  try {
    const { cinemaId, movieId, showDate, time } = req.body;

    if (!cinemaId || !movieId || !showDate || !time) {
      return res.status(400).json({
        success: false,
        message: "cinemaId, movieId, showDate and time are required"
      });
    }

    const show = await Show.create({
      cinemaId,
      movieId,
      showDate,
      time
    });

    res.status(201).json({
      success: true,
      data: show
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};


exports.updateShow = async (req, res) => {
  try {
    const show = await Show.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!show) {
      return res.status(404).json({
        success: false,
        message: "Show not found"
      });
    }

    res.json({ success: true, data: show });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteShow = async (req, res) => {
  try {
    const show = await Show.findByIdAndDelete(req.params.id);

    if (!show) {
      return res.status(404).json({
        success: false,
        message: "Show not found"
      });
    }

    res.json({ success: true, message: "Show deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
