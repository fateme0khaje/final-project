const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    min: 5,
    max: 75,
    required: true,
    trim: true,
  },
  body: {
    type: String,
    min: 100,
    max: 2100,
    required: true,
    trim: true,
  },
  image: { type: String, required: true },
  status: {
    type: String,
    enum: ['public', 'private'],
    default: 'public',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: 'Admin',
  },
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = { Blog };
