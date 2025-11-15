import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
// Load environment variables
dotenv.config();
// Import routes
import categoryRoutes from './api/routes/categories.js';
import collectibleRoutes from './api/routes/collectibles.js';
import artisanProductRoutes from './api/routes/artisanProducts.js';
import artisanRoutes from './api/routes/artisans.js';
import collectorRoutes from './api/routes/collectors.js';
import seedRoutes from './api/routes/seed.js';
import authRouter from './api/routes/auth.routes.js';
import orderRoutes from './api/routes/orders.js';



const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug middleware to log all requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});




// Basic routes
app.get('/', (req, res) => {
    res.json({ 
        message: 'CraftCurio Backend Server is running!', 
        status: 'success',
        port: process.env.PORT || 8000,
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
app.use('/api/artisans', artisanRoutes);
app.use('/api/collectors', collectorRoutes);
app.use('/api/seed', seedRoutes);
app.use('/api/auth', authRouter);
app.use('/api/orders', orderRoutes);

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