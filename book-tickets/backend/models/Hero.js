const mongoose = require("mongoose")

const heroSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subtitle: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    backgroundImage: {
      type: String,
    },
    ctaText: {
      type: String,
      default: "Explore More",
    },
    ctaLink: {
      type: String,
      default: "#",
    },

    // 🔥 ADD THIS
    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model("Hero", heroSchema)