import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './src/config/dbConfig.js';
import app from './src/app.js';
import { initializeAuctionSockets } from './src/sockets/auctionSocket.js';
import { validateCloudinaryConfig } from './src/services/uploadService.js';
import { initializeChatSockets } from './src/sockets/chatSocket.js';

// Load environment variables
dotenv.config();

const port = process.env.PORT || 8000;

// Create HTTP server
const httpServer = createServer(app);

// Initialize Socket.io with CORS
const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    methods: ['GET', 'POST'],
    credentials: true
  },
  pingTimeout: 60000,
  pingInterval: 25000
});

// Initialize auction socket handlers
initializeAuctionSockets(io);

// Initialize chat socket handlers
initializeChatSockets(io);

// Connect to database first, then start server
const startServer = async () => {
  try {
    // Ensure Cloudinary has the credentials it needs before serving uploads
    validateCloudinaryConfig();

    // Wait for database connection
    await connectDB();

    // Start server only after successful DB connection
    httpServer.listen(port, () => {
      console.log(`🚀 Server is running on port ${port}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📊 Database: MongoDB Connected`);
      console.log(`⚡ Socket.io: Real-time features enabled`);
      console.log(`🔨 Auction System: Active`);
      console.log(`💬 Chat System: Active`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();