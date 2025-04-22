const Post = require('../models/Post');
const User = require('../models/User');
const Category = require('../models/Category');

exports.getDashboardStats = async (req, res) => {
  try {
    const [totalPosts, totalUsers, totalCategories, recentPosts] = await Promise.all([
      Post.countDocuments(),
      User.countDocuments(),
      Category.countDocuments(),
      Post.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('author', 'name'),
    ]);

    const recent = recentPosts.map((post) => ({
      id: post._id.toString(), 
      title: post.title,
      author: post.author?.name || 'Unknown',
      date: post.createdAt,
      status: post.status,
    }));

    res.status(200).json({
      stats: {
        totalPosts,
        totalUsers,
        totalCategories,
      },
      recentPosts: recent,
    });
  } catch (error) {
    console.error('Dashboard Stats Error:', error); // optional
    res.status(500).json({ message: 'Dashboard stats fetch failed' });
  }
};
