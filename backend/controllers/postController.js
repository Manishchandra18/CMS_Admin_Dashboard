const Post = require('../models/Post');


exports.getPosts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = (page - 1) * limit;

  try {
    const total = await Post.countDocuments();
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const normalizedPosts = posts.map(post => ({
      ...post.toObject(),
      id: post._id.toString(),
    }));

    res.status(200).json({
      data: normalizedPosts,
      total,
    });
  } catch (error) {
    console.error('Get Posts Error:', error);
    res.status(500).json({ message: 'Failed to fetch posts' });
  }
};

//  Get single post by ID
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    res.status(200).json({
      ...post.toObject(),
      id: post._id.toString(),
    });
  } catch (error) {
    console.error('Get Post By ID Error:', error);
    res.status(500).json({ message: 'Failed to fetch post' });
  }
};

// Create new post
exports.createPost = async (req, res) => {
  try {
    const newPost = new Post(req.body);
    await newPost.save();

    res.status(201).json({
      ...newPost.toObject(),
      id: newPost._id.toString(),
    });
  } catch (error) {
    console.error('Create Post Error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Update post
exports.updatePost = async (req, res) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedPost) return res.status(404).json({ message: 'Post not found' });

    res.status(200).json({
      ...updatedPost.toObject(),
      id: updatedPost._id.toString(),
    });
  } catch (error) {
    console.error('Update Post Error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Delete post
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    res.status(204).end(); // No content
  } catch (error) {
    console.error('Delete Post Error:', error);
    res.status(500).json({ error: error.message });
  }
};
