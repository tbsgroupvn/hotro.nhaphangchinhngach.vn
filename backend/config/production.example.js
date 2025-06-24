// Production Environment Variables for Railway
// Copy this to Railway's environment variables section

module.exports = {
  // MongoDB Atlas Connection
  MONGODB_URI: 'mongodb+srv://username:password@cluster.mongodb.net/hotro-nhaphang?retryWrites=true&w=majority',
  
  // Server Configuration
  PORT: '5000',
  NODE_ENV: 'production',
  
  // CORS Origins (Netlify URL)
  CORS_ORIGIN: 'https://hotro-nhaphang.netlify.app',
  
  // JWT Secret (generate a secure random string)
  JWT_SECRET: 'your-super-secure-jwt-secret-key-here',
  
  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: '900000',
  RATE_LIMIT_MAX_REQUESTS: '100'
}; 