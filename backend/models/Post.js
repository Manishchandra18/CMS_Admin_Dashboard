const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, required: true },
  status: { type: String, enum: ['Draft', 'Published'], default: 'Draft' },
  tags: { type: [String], default: [] },
  author: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Post', postSchema);
