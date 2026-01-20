import ChatMessage from '../models/ChatMessage.js';
import ArtisanProduct from '../models/ArtisanProduct.js';
import Collectible from '../models/Collectible.js';
import Order from '../models/Order.js';
import ArtisanProductCategory from '../models/ArtisanProductCategory.js';
import huggingfaceService from './huggingfaceService.js';
import { chatbotConfig, faqPatterns } from '../config/chatbot.config.js';

class ChatbotService {
  /**
   * Process a user message and generate AI response
   */
  async processMessage(sessionId, userMessage, userId = null, userContext = {}) {
    try {
      // Save user message
      const userMsg = await ChatMessage.create({
        sessionId,
        userId,
        role: 'user',
        message: userMessage,
        metadata: {
          userAgent: userContext.userAgent,
          ipAddress: userContext.ipAddress
        }
      });

      // Get conversation history
      const conversationHistory = await this.getConversationHistory(sessionId);

      // Extract intent and check for quick FAQ answers
      const intents = huggingfaceService.extractIntent(userMessage);
      const faqAnswer = this.checkFAQ(userMessage);

      // Build context for AI
      const context = await this.buildContext(userId, intents);

      // Generate AI response
      let aiResponse;
      if (faqAnswer) {
        // Use predefined FAQ answer
        aiResponse = faqAnswer;
      } else {
        // Use Hugging Face AI
        aiResponse = await huggingfaceService.generateResponse(conversationHistory, context);
      }

      // Save assistant message
      const assistantMsg = await ChatMessage.create({
        sessionId,
        userId,
        role: 'assistant',
        message: aiResponse,
        metadata: {
          productIds: context.searchResults?.map(p => p._id) || [],
          suggestedActions: this.generateSuggestedActions(intents)
        }
      });

      return {
        message: aiResponse,
        suggestedActions: assistantMsg.metadata.suggestedActions,
        quickReplies: chatbotConfig.quickReplies,
        products: context.searchResults?.slice(0, 3) || []
      };
    } catch (error) {
      console.error('Chatbot Service Error:', error);
      throw error;
    }
  }

  /**
   * Get conversation history for context
   */
  async getConversationHistory(sessionId, limit = chatbotConfig.maxConversationHistory) {
    const messages = await ChatMessage.find({ sessionId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('role message');

    // Reverse to get chronological order
    return messages.reverse().map(msg => ({
      role: msg.role,
      content: msg.message
    }));
  }

  /**
   * Build context for AI based on user and intents
   */
  async buildContext(userId, intents) {
    const context = {};

    // Add user context if logged in
    if (userId) {
      try {
        const User = (await import('../models/User.js')).default;
        const user = await User.findById(userId).select('name email role');
        if (user) {
          context.user = {
            name: user.name,
            role: user.role,
            cartItemsCount: 0 // TODO: Get actual cart count
          };
        }
      } catch (error) {
        console.error('Error fetching user context:', error);
      }
    }

    // Add platform data
    try {
      const [categories, productCount, activeAuctionCount] = await Promise.all([
        ArtisanProductCategory.find().select('name').limit(10),
        ArtisanProduct.countDocuments({ inStock: true }),
        Collectible.countDocuments({ 
          saleType: 'auction', 
          auctionStatus: 'live' 
        })
      ]);

      context.platformData = {
        categories: categories.map(c => c.name),
        totalProducts: productCount,
        activeAuctions: activeAuctionCount
      };
    } catch (error) {
      console.error('Error fetching platform data:', error);
    }

    // Add search results for search intent
    if (intents.includes('search')) {
      context.searchResults = await this.searchProducts(null, 5);
    }

    return context;
  }

  /**
   * Search products based on query
   */
  async searchProducts(query, limit = 10) {
    try {
      const searchFilter = { inStock: true };
      
      if (query) {
        searchFilter.$or = [
          { name: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { materials: { $regex: query, $options: 'i' } }
        ];
      }

      const products = await ArtisanProduct.find(searchFilter)
        .select('name price images description saleType')
        .limit(limit)
        .sort({ createdAt: -1 });

      return products;
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  }

  /**
   * Check if message matches a FAQ pattern
   */
  checkFAQ(message) {
    const lowerMessage = message.toLowerCase();
    
    for (const [pattern, answer] of Object.entries(faqPatterns)) {
      if (lowerMessage.includes(pattern)) {
        return answer;
      }
    }
    
    return null;
  }

  /**
   * Generate suggested actions based on intents
   */
  generateSuggestedActions(intents) {
    const actions = [];
    
    if (intents.includes('search')) {
      actions.push('Browse All Products', 'View Categories');
    }
    
    if (intents.includes('auction_help')) {
      actions.push('View Live Auctions', 'Learn More About Bidding');
    }
    
    if (intents.includes('order_tracking')) {
      actions.push('View My Orders', 'Contact Seller');
    }
    
    if (intents.includes('payment_help')) {
      actions.push('Retry Payment', 'Contact Support');
    }
    
    return actions;
  }

  /**
   * Get random greeting message
   */
  getGreeting() {
    const greetings = chatbotConfig.greetingMessages;
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  /**
   * Clear chat history for a session
   */
  async clearHistory(sessionId) {
    await ChatMessage.deleteMany({ sessionId });
    return { success: true };
  }

  /**
   * Get chat statistics
   */
  async getStats(userId = null) {
    const filter = userId ? { userId } : {};
    
    const [totalChats, totalMessages, avgMessagesPerSession] = await Promise.all([
      ChatMessage.distinct('sessionId', filter).then(sessions => sessions.length),
      ChatMessage.countDocuments(filter),
      ChatMessage.aggregate([
        { $match: filter },
        { $group: { _id: '$sessionId', count: { $sum: 1 } } },
        { $group: { _id: null, avg: { $avg: '$count' } } }
      ])
    ]);

    return {
      totalChats,
      totalMessages,
      avgMessagesPerSession: avgMessagesPerSession[0]?.avg || 0
    };
  }
}

export default new ChatbotService();
