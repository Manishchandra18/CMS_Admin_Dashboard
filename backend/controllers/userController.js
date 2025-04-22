const User = require('../models/User');

// @desc Get all users (admin only)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');

    const formatted = users.map((user) => ({
      id: user._id.toString(), 
      name: user.name,
      email: user.email,
      role: user.role,
      active: user.active,
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc Update user role
exports.updateUserRole = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { role } = req.body;
    const validRoles = ['admin', 'editor'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    user.role = role;
    await user.save();

    res.json({ message: 'User role updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc Enable / Disable user account
exports.updateUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.active = req.body.active;
    await user.save();

    res.json({ message: 'User status updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
