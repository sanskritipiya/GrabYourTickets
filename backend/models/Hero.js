const mongoose = require('mongoose');

const heroSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  subtitle: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  backgroundImage: {
    type: String, 
    required: false
  },
  ctaText: {
    type: String, // Call-to-action button text
    default: 'Learn More'
  },
  ctaLink: {
    type: String, // Link for the CTA button
    default: '#'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Hero', heroSchema);

