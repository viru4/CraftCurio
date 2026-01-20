import { HfInference } from '@huggingface/inference';
import { chatbotConfig } from '../config/chatbot.config.js';

class HuggingFaceService {
  constructor() {
    if (!process.env.HUGGINGFACE_API_KEY) {
      console.warn('⚠️  HUGGINGFACE_API_KEY not found. Chatbot will not function.');
      this.client = null;
      return;
    }

    try {
      this.client = new HfInference(process.env.HUGGINGFACE_API_KEY);
      this.model = chatbotConfig.model || 'meta-llama/Llama-3.2-3B-Instruct';
      console.log('✅ Hugging Face API initialized with model:', this.model);
    } catch (error) {
      console.error('❌ Hugging Face init failed:', error.message);
      this.client = null;
    }
  }

  /**
   * Generate a chat response using Hugging Face Inference API
   * @param {Array} conversationHistory - Array of {role, content} messages
   * @param {Object} context - Additional context (user info, products, etc)
   * @returns {Promise<string>} AI response
   */
  async generateResponse(conversationHistory, context = {}) {
    try {
      if (!this.client) {
        throw new Error('Hugging Face API not initialized. Please set HUGGINGFACE_API_KEY.');
      }

      // Build the full prompt with context
      const fullPrompt = this.buildPrompt(conversationHistory, context);

      // Format messages for chat completion
      const messages = [
        { role: 'system', content: chatbotConfig.systemPrompt },
        ...conversationHistory.map(msg => ({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content
        }))
      ];

      // Call Hugging Face Chat Completion API (non-streaming)
      const response = await this.client.chatCompletion({
        model: this.model,
        messages: messages,
        temperature: chatbotConfig.temperature || 0.7,
        max_tokens: chatbotConfig.maxOutputTokens || 1000,
      });

      const responseText = response.choices[0]?.message?.content || '';
      return responseText.trim() || "I apologize, but I couldn't generate a response. Please try again.";

    } catch (error) {
      console.error('Hugging Face API Error:', error);
      
      // Handle specific error cases
      if (error.message?.includes('API') || error.message?.includes('token')) {
        throw new Error('Invalid Hugging Face API key');
      } else if (error.message?.includes('rate limit') || error.message?.includes('quota')) {
        throw new Error('API quota exceeded. Please try again later.');
      }
      
      throw new Error('Unable to generate response. Please try again.');
    }
  }

  /**
   * Build a comprehensive prompt with system instructions and context
   */
  buildPrompt(conversationHistory, context) {
    let prompt = chatbotConfig.systemPrompt + '\n\n';

    // Add user context if available
    if (context.user) {
      prompt += `**Current User:**\n`;
      prompt += `- Name: ${context.user.name}\n`;
      prompt += `- Role: ${context.user.role}\n`;
      if (context.user.cartItemsCount > 0) {
        prompt += `- Items in Cart: ${context.user.cartItemsCount}\n`;
      }
      prompt += '\n';
    }

    // Add platform data context
    if (context.platformData) {
      prompt += `**Platform Information:**\n`;
      if (context.platformData.categories?.length > 0) {
        prompt += `- Available Categories: ${context.platformData.categories.join(', ')}\n`;
      }
      if (context.platformData.activeAuctions > 0) {
        prompt += `- Active Auctions: ${context.platformData.activeAuctions}\n`;
      }
      if (context.platformData.totalProducts > 0) {
        prompt += `- Total Products: ${context.platformData.totalProducts}\n`;
      }
      prompt += '\n';
    }

    // Add product search results
    if (context.searchResults?.length > 0) {
      prompt += `**Relevant Products Found:**\n`;
      context.searchResults.forEach((product, index) => {
        prompt += `${index + 1}. ${product.name} - $${product.price}`;
        if (product.category) {
          prompt += ` (${product.category})`;
        }
        prompt += '\n';
      });
      prompt += '\n';
    }

    // Add conversation history
    if (conversationHistory.length > 0) {
      prompt += `**Conversation:**\n`;
      conversationHistory.forEach(msg => {
        prompt += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n`;
      });
    }

    return prompt;
  }

  /**
   * Extract intents from user message
   * @param {string} message - User message
   * @returns {Array<string>} Detected intents
   */
  extractIntent(message) {
    const intents = [];
    const lowerMessage = message.toLowerCase();

    // Search intent
    if (lowerMessage.match(/\b(search|find|looking for|show me|browse)\b/)) {
      intents.push('search');
    }

    // Product intent
    if (lowerMessage.match(/\b(product|item|collectible|pottery|jewelry|textile|woodwork|painting)\b/)) {
      intents.push('product_info');
    }

    // Auction intent
    if (lowerMessage.match(/\b(auction|bid|bidding|highest bid|reserve price)\b/)) {
      intents.push('auction');
    }

    // Order intent
    if (lowerMessage.match(/\b(order|track|shipping|delivery|status)\b/)) {
      intents.push('order');
    }

    // Payment intent
    if (lowerMessage.match(/\b(payment|pay|razorpay|transaction|refund|card)\b/)) {
      intents.push('payment');
    }

    // Account intent
    if (lowerMessage.match(/\b(account|profile|sign up|login|register|password)\b/)) {
      intents.push('account');
    }

    // Help intent
    if (lowerMessage.match(/\b(help|how to|guide|explain|what is)\b/)) {
      intents.push('help');
    }

    return intents.length > 0 ? intents : ['general'];
  }

  /**
   * Analyze image and generate description
   * @param {string} imageUrl - URL or base64 of the image
   * @returns {Promise<string>} Image analysis description
   */
  async analyzeImage(imageUrl) {
    try {
      if (!this.client) {
        throw new Error('Hugging Face API not initialized.');
      }

      // Use BLIP-2 for image captioning (vision model)
      const visionModel = 'Salesforce/blip-image-captioning-large';

      // Convert base64 to blob if needed
      let imageBlob;
      if (imageUrl.startsWith('data:image')) {
        // Base64 image
        const base64Data = imageUrl.split(',')[1];
        const binaryData = Buffer.from(base64Data, 'base64');
        imageBlob = new Blob([binaryData]);
      } else if (imageUrl.startsWith('http')) {
        // Fetch image from URL
        const response = await fetch(imageUrl);
        imageBlob = await response.blob();
      } else {
        throw new Error('Invalid image format. Provide URL or base64.');
      }

      // Call image-to-text API
      const result = await this.client.imageToText({
        model: visionModel,
        data: imageBlob
      });

      return result.generated_text || 'Unable to analyze image';

    } catch (error) {
      console.error('Image analysis error:', error);
      throw new Error('Failed to analyze image: ' + error.message);
    }
  }

  /**
   * Check if the service is available
   * @returns {boolean} True if API key is configured
   */
  isAvailable() {
    return this.client !== null;
  }
}

// Export singleton instance
const huggingfaceService = new HuggingFaceService();
export default huggingfaceService;
