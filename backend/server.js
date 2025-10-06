import dotenv from 'dotenv';
import connectDB from './src/config/dbConfig.js';
import app from './src/app.js';
import authRouter from './src/api/routes/auth.routes.js';

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const port = process.env.PORT || 3000;

app.use("/api/auth", authRouter)

// Start server
app.listen(port, () => {
    console.log(`🚀 Server is running on port ${port}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📊 Database: MongoDB`);
});