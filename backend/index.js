const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const postRoutes = require('./routes/postRoutes');
const UserRoutes = require('../Backend/routes/UserRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/posts', postRoutes);
app.use('/api/users', UserRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/dashboard', dashboardRoutes)

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error(err));
  const authRoutes = require('./routes/authRoutes');

  app.use('/api/auth', authRoutes);
  app.use('/api/posts', require('./routes/postRoutes'));
  