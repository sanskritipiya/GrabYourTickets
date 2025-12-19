const Movie = require("../models/Movie");

// Add movie (Admin only)
exports.addMovie = async (req, res) => {
  try {
    // Map frontend fields (trailer -> trailerUrl) and ensure numeric fields are numbers
    const movieData = {
      title: req.body.title,
      genre: req.body.genre,
      language: req.body.language,
      duration: Number(req.body.duration),
      rating: Number(req.body.rating),
      releaseDate: req.body.releaseDate,
      description: req.body.description,
      trailerUrl: req.body.trailer || req.body.trailerUrl || "",
      image: req.body.image
    };
    
    const movie = await Movie.create(movieData);
    res.status(201).json({
      success: true,
      data: movie
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get all movies
exports.getMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    res.status(200).json({
      success: true,
      data: movies
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get movie by ID
exports.getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found"
      });
    }
    res.status(200).json({
      success: true,
      data: movie
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update movie (Admin only)
exports.updateMovie = async (req, res) => {
  try {
    // Map frontend fields (trailer -> trailerUrl)
    const updateData = { ...req.body };
    if (req.body.trailer !== undefined) {
      updateData.trailerUrl = req.body.trailer;
      delete updateData.trailer;
    }
    
    // Convert numeric fields if they exist
    if (updateData.duration) updateData.duration = Number(updateData.duration);
    if (updateData.rating) updateData.rating = Number(updateData.rating);
    
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found"
      });
    }
    res.status(200).json({
      success: true,
      data: movie
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Delete movie (Admin only)
exports.deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found"
      });
    }
    res.status(200).json({
      success: true,
      message: "Movie deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

