const Show = require("../models/Show");

// Add show (Admin only)
exports.addShow = async (req, res) => {
  try {
    const show = await Show.create(req.body);
    res.status(201).json({
      success: true,
      data: show
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get all shows
exports.getShows = async (req, res) => {
  try {
    const shows = await Show.find().populate("movieId");
    res.status(200).json({
      success: true,
      data: shows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get show by ID
exports.getShowById = async (req, res) => {
  try {
    const show = await Show.findById(req.params.id).populate("movieId");
    if (!show) {
      return res.status(404).json({
        success: false,
        message: "Show not found"
      });
    }
    res.status(200).json({
      success: true,
      data: show
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update show (Admin only)
exports.updateShow = async (req, res) => {
  try {
    const show = await Show.findById(req.params.id);
    if (!show) return res.status(404).json({ success: false, message: "Show not found" });

    Object.keys(req.body).forEach(key => {
      show[key] = req.body[key];
    });

    const updatedShow = await show.save();
    await updatedShow.populate("movieId");

    res.status(200).json({ success: true, data: updatedShow });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};


// Delete show (Admin only)
exports.deleteShow = async (req, res) => {
  try {
    const show = await Show.findByIdAndDelete(req.params.id);
    if (!show) {
      return res.status(404).json({
        success: false,
        message: "Show not found"
      });
    }
    res.status(200).json({
      success: true,
      message: "Show deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

