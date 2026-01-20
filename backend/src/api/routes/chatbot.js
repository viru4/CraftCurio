import express from 'express';
import {
  sendMessage,
  getGreeting,
  clearHistory,
  getStats,
  healthCheck
} from '../controllers/chatbotController.js';
import { optionalAuth } from '../../middleware/authMiddleware.js';

const router = express.Router();

/**
 * Chatbot Routes
 * Base Path: /api/chatbot
 */

// Health check (public)
router.get('/health', healthCheck);

// Get greeting to start chat (public)
router.get('/greeting', getGreeting);

// Send message (works for both authenticated and guest users)
router.post('/message', optionalAuth, sendMessage);

// Clear chat history (optional auth)
router.delete('/history/:sessionId', optionalAuth, clearHistory);

// Get chat statistics (optional auth - shows user-specific stats if authenticated)
router.get('/stats', optionalAuth, getStats);

export default router;
