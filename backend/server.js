import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './src/config/dbConfig.js';
// import app from './src/app.js';
// import authRouter from './src/api/routes/auth.routes.js';
import categoryRoutes from './src/api/routes/categories.js';
import collectibleRoutes from './src/api/routes/collectibles.js';
import artisanProductRoutes from './src/api/routes/artisanProducts.js';
import artisanRoutes from './src/api/routes/artisans.js';
import collectorRoutes from './src/api/routes/collectors.js';
import seedRoutes from './src/api/routes/seed.js';
import authRouter from './src/api/routes/auth.routes.js';

// Load environment variables
dotenv.config();
const app = express();
// Connect to database
connectDB();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 8000;

// app.use("/api/auth", authRouter)
app.use('/api/categories', categoryRoutes);
app.use('/api/collectibles', collectibleRoutes);
app.use('/api/artisan-products', artisanProductRoutes);
app.use('/api/artisans', artisanRoutes);
app.use('/api/collectors', collectorRoutes);
app.use('/api/seed', seedRoutes);
app.use('/api/auth', authRouter);

// Start server
app.listen(port, () => {
    console.log(`🚀 Server is running on port ${port}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📊 Database: MongoDB`);
});