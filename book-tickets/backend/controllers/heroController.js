const Hero = require("../models/Hero")
const cloudinary = require("../utils/cloudinary")

// CLOUDINARY STREAM HELPER
const streamUpload = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (result) resolve(result)
        else reject(error)
      }
    )
    stream.end(buffer)
  })
}


// ADD HERO SECTION//
exports.addHero = async (req, res) => {
  try {
    const {
      title,
      subtitle,
      description,
      ctaText,
      ctaLink,
      isActive,
      movieId, // 🔥 ADDED
    } = req.body

    if (!title || !movieId) {
      return res.status(400).json({
        success: false,
        message: "Title and movieId are required",
      })
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Background image is required",
      })
    }

    const uploadResult = await streamUpload(req.file.buffer, "heroes")

    const hero = await Hero.create({
      title,
      subtitle,
      description,
      ctaText,
      ctaLink,
      isActive,
      movieId, // 🔥 SAVED
      backgroundImage: uploadResult.secure_url,
    })

    res.status(201).json({
      success: true,
      data: hero,
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    })
  }
}


// GET ALL ACTIVE HEROES//
exports.getAllHeroes = async (req, res) => {
  try {
    const heroes = await Hero.find({ isActive: true }).lean()
    // Ensure movieId is converted to string for each hero
    const heroesWithStringIds = heroes.map(hero => ({
      ...hero,
      movieId: hero.movieId ? String(hero.movieId) : null
    }))
    res.json({
      success: true,
      data: heroesWithStringIds,
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    })
  }
}

// ============================
// GET HERO BY ID
// ============================
exports.getHeroById = async (req, res) => {
  try {
    const hero = await Hero.findById(req.params.id)

    if (!hero || !hero.isActive) {
      return res.status(404).json({
        success: false,
        message: "Hero not found",
      })
    }

    res.json({
      success: true,
      data: hero,
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    })
  }
}


// UPDATE HERO//

exports.updateHero = async (req, res) => {
  try {
    const hero = await Hero.findById(req.params.id)

    if (!hero) {
      return res.status(404).json({
        success: false,
        message: "Hero not found",
      })
    }

    const fields = [
      "title",
      "subtitle",
      "description",
      "ctaText",
      "ctaLink",
      "isActive",
      "movieId", // 🔥 ADDED
    ]

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        hero[field] = req.body[field]
      }
    })

    // Upload new image (old image NOT deleted)
    if (req.file) {
      const uploadResult = await streamUpload(req.file.buffer, "heroes")
      hero.backgroundImage = uploadResult.secure_url
    }

    await hero.save()

    res.status(200).json({
      success: true,
      message: "Hero updated successfully",
      data: hero,
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    })
  }
}


// DELETE HERO//
exports.deleteHero = async (req, res) => {
  try {
    const hero = await Hero.findByIdAndDelete(req.params.id)

    if (!hero) {
      return res.status(404).json({
        success: false,
        message: "Hero not found",
      })
    }

    res.json({
      success: true,
      message:
        "Hero deleted successfully (image not removed from Cloudinary)",
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    })
  }
}