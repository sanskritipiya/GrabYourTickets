const Hero = require("../models/Hero");

// Create hero (Admin only)
exports.addHero = async (req, res) => {
  try {
    const imagePath = req.file ? req.file.path : req.body.image;

    const hero = await Hero.create({
      title: req.body.title,
      subtitle: req.body.subtitle,
      image: imagePath,
      ctaText: req.body.ctaText || req.body.callToAction || "",
      ctaLink: req.body.ctaLink || "",
      isActive: req.body.isActive !== undefined ? req.body.isActive : true,
    });
    res.status(201).json({ success: true, data: hero });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all heroes (public)
exports.getHeroes = async (_req, res) => {
  try {
    const heroes = await Hero.find();
    res.status(200).json({ success: true, data: heroes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update hero (Admin only)
exports.updateHero = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.file) {
      updateData.image = req.file.path;
    }

    if (updateData.callToAction && !updateData.ctaText) {
      updateData.ctaText = updateData.callToAction;
      delete updateData.callToAction;
    }

    const hero = await Hero.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!hero) return res.status(404).json({ success: false, message: "Hero not found" });
    res.status(200).json({ success: true, data: hero });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete hero (Admin only)
exports.deleteHero = async (req, res) => {
  try {
    const hero = await Hero.findByIdAndDelete(req.params.id);
    if (!hero) return res.status(404).json({ success: false, message: "Hero not found" });
    res.status(200).json({ success: true, message: "Hero deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

