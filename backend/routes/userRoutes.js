const express = require('express');
const {
  getUsers,
  updateUserRole,
  updateUserStatus,
} = require('../controllers/userController'); 

const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();


router.get('/', protect, authorize('admin'), getUsers);
router.patch('/:id/role', protect, authorize('admin'), updateUserRole);
router.patch('/:id/status', protect, authorize('admin'), updateUserStatus);

module.exports = router;
