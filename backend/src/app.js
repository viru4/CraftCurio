import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
// Load environment variables
dotenv.config();
// Import routes
import categoryRoutes from './api/routes/categories.js';
import collectibleRoutes from './api/routes/collectibles.js';
import artisanProductRoutes from './api/routes/artisanProducts.js';
import seedRoutes from './api/routes/seed.js';
import authRouter from './api/routes/auth.routes.js';



const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));




// Basic routes
app.get('/', (req, res) => {
    res.json({ 
        message: 'CraftCurio Backend Server is running!', 
        status: 'success',
        port: process.env.PORT || 3000,
        database: 'Connected to MongoDB'
    });
});

app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        server: 'CraftCurio Backend',
        database: 'MongoDB Connected'
    });
});


// Use routes
app.use('/api/categories', categoryRoutes);
app.use('/api/collectibles', collectibleRoutes);
app.use('/api/artisan-products', artisanProductRoutes);
app.use('/api/seed', seedRoutes);
app.use('/api/auth', authRouter);

// Handle 404 for undefined routes
app.use((req, res) => {
    res.status(404).json({
        error: 'Route not found',
        message: `Cannot ${req.method} ${req.originalUrl}`
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Something went wrong!',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

export default app;