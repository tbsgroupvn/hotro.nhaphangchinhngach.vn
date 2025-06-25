const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Only try to connect if MONGODB_URI is properly configured
    if (!process.env.MONGODB_URI || process.env.MONGODB_URI.includes('localhost')) {
      console.log('🔧 MongoDB: Using development mode (no database)');
      return;
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 5000,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('⚠️ Continuing in development mode without MongoDB');
    // Don't exit in development
  }
};

module.exports = connectDB; 