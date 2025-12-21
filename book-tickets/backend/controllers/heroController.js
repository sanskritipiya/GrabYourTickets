const Hero = require("../models/Hero");

// Add Hero (Admin only)
exports.addHero = async (req, res) => {
  try {
    const { title, subtitle, description, backgroundImage, ctaText, ctaLink, isActive } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: "Title is required" });
    }

    const hero = new Hero({ title, subtitle, description, backgroundImage, ctaText, ctaLink, isActive });
    await hero.save();

    res.status(201).json({ success: true, data: hero });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all heroes (Public)
exports.getAllHeroes = async (req, res) => {
  try {
    const heroes = await Hero.find({ isActive: true }); // Only active heroes
    res.json({ success: true, data: heroes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get single hero by ID (Public)
exports.getHeroById = async (req, res) => {
  try {
    const hero = await Hero.findById(req.params.id);
    if (!hero || !hero.isActive) return res.status(404).json({ success: false, message: "Hero not found" });
    res.json({ success: true, data: hero });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update hero (Admin only)
exports.updateHero = async (req, res) => {
  try {
    const hero = await Hero.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!hero) return res.status(404).json({ success: false, message: "Hero not found" });
    res.json({ success: true, data: hero });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete hero (Admin only)
exports.deleteHero = async (req, res) => {
  try {
    const hero = await Hero.findByIdAndDelete(req.params.id);
    if (!hero) return res.status(404).json({ success: false, message: "Hero not found" });
    res.json({ success: true, message: "Hero deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
