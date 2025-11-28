import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Load environment variables
dotenv.config();

// Import routes
import categoryRoutes from './api/routes/categories.js';
import collectibleRoutes from './api/routes/collectibles.js';
import auctionRoutes from './api/routes/auction.js';
import artisanProductRoutes from './api/routes/artisanProducts.js';
import artisanRoutes from './api/routes/artisans.js';
import collectorRoutes from './api/routes/collectors.js';
import seedRoutes from './api/routes/seed.js';
import authRouter from './api/routes/auth.routes.js';
import orderRoutes from './api/routes/orders.js';
import wishlistRoutes from './api/routes/wishlist.js';
import cartRoutes from './api/routes/cart.js';
import adminRouter from './api/routes/admin.routes.js';
import messageRoutes from './api/routes/message.routes.js';
import verificationRoutes from './api/routes/verification.routes.js';
import reviewRoutes from './api/routes/reviews.js';
import questionRoutes from './api/routes/questions.js';
import aboutUsRoutes from './api/routes/aboutUsRoutes.js';
import uploadRoutes from './api/routes/upload.routes.js';

const app = express();

// Security Middleware
app.use(helmet());

// Rate Limiting - Stricter for auth endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

// General API rate limiter (more lenient)
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // Limit each IP to 200 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

app.use('/api/auth/', authLimiter);
app.use('/api/', apiLimiter);

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug middleware to log all requests (only in development)
if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.url}`);
        next();
    });
}

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
app.use('/api/auction', auctionRoutes);
app.use('/api/artisan-products', artisanProductRoutes);
app.use('/api/artisans', artisanRoutes);
app.use('/api/collectors', collectorRoutes);
app.use('/api/seed', seedRoutes);
app.use('/api/auth', authRouter);
app.use('/api/orders', orderRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/admin', adminRouter);
app.use('/api/messages', messageRoutes);
app.use('/api/verification', verificationRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/about-us', aboutUsRoutes);
app.use('/api/upload', uploadRoutes);

// Handle 404 for undefined routes
app.use((req, res) => {
    res.status(404).json({
        error: 'Route not found',
        message: `Cannot ${req.method} ${req.originalUrl}`
    });
});

// Import error handler middleware
import errorHandler from './middleware/errorHandler.js';

// Global error handler (must be last)
app.use(errorHandler);

export default app;