const Movie = require("../models/Movie");
const cloudinary = require("../utils/cloudinary");

//CLOUDINARY STREAM HELPER //
const streamUpload = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    stream.end(buffer);
  });
};

// ADD MOVIE//
exports.addMovie = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Movie poster image is required",
      });
    }

   const isNewRelease = String(req.body.isNewRelease).toLowerCase() === "true";


    const uploadResult = await streamUpload(req.file.buffer, "movies");

    const movie = await Movie.create({
    title: req.body.title,
    genre: req.body.genre,
    language: req.body.language,
    duration: Number(req.body.duration),
    releaseDate: req.body.releaseDate,
    description: req.body.description,
    trailerUrl: req.body.trailer || req.body.trailerUrl || "",
    image: uploadResult.secure_url,
    isNewRelease,
});



    res.status(201).json({ success: true, data: movie });
  } catch (error) {
    console.error("ADD MOVIE ERROR:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// UPDATE MOVIE//
exports.updateMovie = async (req, res) => {
  try {
    const updateData = { ...req.body };

    // normalize trailer
    if (updateData.trailer !== undefined) {
      updateData.trailerUrl = updateData.trailer;
      delete updateData.trailer;
    }

    // normalize boolean
    if (updateData.isNewRelease !== undefined) {
      updateData.isNewRelease = updateData.isNewRelease === "true";
    }

    // normalize duration
    if (updateData.duration !== undefined) {
      updateData.duration = Number(updateData.duration);
    }

    // optional image update
    if (req.file) {
      const uploadResult = await streamUpload(req.file.buffer, "movies");
      updateData.image = uploadResult.secure_url;
    }

    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    res.json({ success: true, data: movie });
  } catch (error) {
    console.error("UPDATE MOVIE ERROR:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// GET ALL MOVIES //
exports.getMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    res.status(200).json({ success: true, data: movies });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET NEW RELEASES //
exports.getNewReleases = async (req, res) => {
  try {
    // Find movies marked as new releases
    const movies = await Movie.find({ isNewRelease: true }).sort({
      createdAt: -1,
    });
    
    console.log(`Found ${movies.length} new release movies`);
    
    res.status(200).json({ success: true, data: movies });
  } catch (error) {
    console.error("GET NEW RELEASES ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET MOVIE BY ID //
exports.getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    res.status(200).json({ success: true, data: movie });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE MOVIE //
exports.deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Movie deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
