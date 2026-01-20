import chatbotService from '../../services/chatbotService.js';
import huggingfaceService from '../../services/huggingfaceService.js';
import { chatbotConfig } from '../../config/chatbot.config.js';
import { v4 as uuidv4 } from 'uuid';

// In-memory rate limiting (for production, use Redis)
const rateLimitStore = new Map();

/**
 * Rate limit check
 */
const checkRateLimit = (identifier) => {
  const now = Date.now();
  const windowMs = chatbotConfig.messageRateLimit.windowMs;
  const maxRequests = chatbotConfig.messageRateLimit.maxRequests;

  if (!rateLimitStore.has(identifier)) {
    rateLimitStore.set(identifier, []);
  }

  const requests = rateLimitStore.get(identifier);
  
  // Remove old requests outside the window
  const validRequests = requests.filter(time => now - time < windowMs);
  
  if (validRequests.length >= maxRequests) {
    return false;
  }

  validRequests.push(now);
  rateLimitStore.set(identifier, validRequests);
  
  return true;
};

/**
 * Send a message to the chatbot
 * POST /api/chatbot/message
 */
export const sendMessage = async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Message is required'
      });
    }

    // Check if Hugging Face API is available
    if (!huggingfaceService.isAvailable()) {
      return res.status(503).json({
        success: false,
        error: 'Chatbot service is currently unavailable. Please try again later.'
      });
    }

    // Generate or validate sessionId
    const validSessionId = sessionId || uuidv4();
    const userId = req.user?.id || null;
    const identifier = userId || req.ip;

    // Rate limiting check
    if (!checkRateLimit(identifier)) {
      return res.status(429).json({
        success: false,
        error: 'Too many messages. Please wait a moment and try again.'
      });
    }

    // Get user context
    const userContext = {
      userAgent: req.headers['user-agent'],
      ipAddress: req.ip
    };

    // Process message
    const response = await chatbotService.processMessage(
      validSessionId,
      message,
      userId,
      userContext
    );

    res.status(200).json({
      success: true,
      data: {
        sessionId: validSessionId,
        message: response.message,
        suggestedActions: response.suggestedActions,
        quickReplies: response.quickReplies,
        products: response.products,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Send Message Error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to process message. Please try again.'
    });
  }
};

/**
 * Get greeting message to start a conversation
 * GET /api/chatbot/greeting
 */
export const getGreeting = async (req, res) => {
  try {
    const greeting = chatbotService.getGreeting();
    const sessionId = uuidv4();

    res.status(200).json({
      success: true,
      data: {
        sessionId,
        message: greeting,
        quickReplies: chatbotConfig.quickReplies
      }
    });
  } catch (error) {
    console.error('Get Greeting Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get greeting'
    });
  }
};

/**
 * Clear chat history for a session
 * DELETE /api/chatbot/history/:sessionId
 */
export const clearHistory = async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        error: 'Session ID is required'
      });
    }

    await chatbotService.clearHistory(sessionId);

    res.status(200).json({
      success: true,
      message: 'Chat history cleared'
    });
  } catch (error) {
    console.error('Clear History Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to clear history'
    });
  }
};

/**
 * Get chat statistics (for admin/analytics)
 * GET /api/chatbot/stats
 */
export const getStats = async (req, res) => {
  try {
    const userId = req.user?.id;
    const stats = await chatbotService.getStats(userId);

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get Stats Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get statistics'
    });
  }
};

/**
 * Check chatbot health status
 * GET /api/chatbot/health
 */
export const healthCheck = async (req, res) => {
  try {
    const isAvailable = huggingfaceService.isAvailable();

    res.status(isAvailable ? 200 : 503).json({
      success: isAvailable,
      status: isAvailable ? 'operational' : 'unavailable',
      message: isAvailable 
        ? 'Chatbot service is running' 
        : 'Chatbot service is unavailable. Please check HUGGINGFACE_API_KEY configuration.'
    });
  } catch (error) {
    console.error('Health Check Error:', error);
    res.status(500).json({
      success: false,
      status: 'error',
      message: error.message
    });
  }
};
