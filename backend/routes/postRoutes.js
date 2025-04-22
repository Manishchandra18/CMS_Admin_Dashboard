const express = require('express');
const {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} = require('../controllers/postController');

const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getPosts);
router.get('/:id', protect, getPostById);
router.post('/', protect, authorize('admin', 'editor'), createPost);
router.put('/:id', protect, authorize('admin', 'editor'), updatePost);
router.delete('/:id', protect, authorize('admin'), deletePost);

module.exports = router;
