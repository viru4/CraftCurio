import dotenv from 'dotenv';
import connectDB from './src/config/dbConfig.js';
import app from './src/app.js';

// Load environment variables
dotenv.config();

const port = process.env.PORT || 8000;

// Connect to database first, then start server
const startServer = async () => {
  try {
    // Wait for database connection
    await connectDB();
    
    // Start server only after successful DB connection
    app.listen(port, () => {
      console.log(`🚀 Server is running on port ${port}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📊 Database: MongoDB`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();