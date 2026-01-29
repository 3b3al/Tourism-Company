const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tourism-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Tourism Company API is running',
    version: '1.0.0'
  });
});

// API Routes
const auth = require('./routes/auth');
const tours = require('./routes/tours');
const bookings = require('./routes/bookings');
const files = require('./routes/files');
const admin = require('./routes/admin'); // New route import

// Mount routers
app.use('/api/auth', auth);
app.use('/api/tours', tours);
app.use('/api/bookings', bookings);
app.use('/api/files', files);
app.use('/api/admin', admin); // New route mount

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start Server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

module.exports = app;
