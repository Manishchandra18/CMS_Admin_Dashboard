const Category = require('../models/Category');
const Post = require('../models/Post');

// @desc Get all categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    const normalized = categories.map((cat) => ({
      id: cat._id.toString(),
      name: cat.name,
    }));
    res.json(normalized);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc Create category
exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const exists = await Category.findOne({ name });

    if (exists) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const category = await Category.create({ name });
    res.status(201).json({
      id: category._id.toString(),
      name: category.name,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc Update category
exports.updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );

    if (!category) return res.status(404).json({ message: 'Category not found' });

    res.json({
      id: category._id.toString(),
      name: category.name,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc Delete category
exports.deleteCategory = async (req, res) => {
  try {
    const inUse = await Post.findOne({ category: req.params.id });

    if (inUse) {
      return res.status(400).json({ message: 'Category is in use by a post' });
    }

    const deleted = await Category.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Category not found' });

    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
