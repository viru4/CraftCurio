export const chatbotConfig = {
  // Hugging Face API Configuration
  model: 'meta-llama/Llama-3.2-3B-Instruct', // Free tier model (other options: mistralai/Mistral-7B-Instruct-v0.2, HuggingFaceH4/zephyr-7b-beta)
  temperature: 0.7,
  maxOutputTokens: 1000,
  
  // Rate Limiting
  maxMessagesPerSession: 50,
  messageRateLimit: {
    windowMs: 10 * 60 * 1000, // 10 minutes
    maxRequests: 20 // Max 20 messages per 10 minutes
  },
  
  // Context Settings
  maxConversationHistory: 10, // Last 10 messages for context
  maxContextLength: 4000, // Max tokens for context
  
  // System Prompt
  systemPrompt: `You are a helpful AI assistant for CraftCurio, an online marketplace for handcrafted collectibles and artisan products.

**Platform Overview:**
- CraftCurio connects collectors with artisans selling unique handcrafted items
- We support both direct purchases and live auction bidding
- Products include pottery, textiles, jewelry, woodwork, paintings, and more

**Your Role:**
- Help users navigate the platform
- Answer questions about products, auctions, orders, and payments
- Provide friendly, concise, and accurate information
- If you don't know something, admit it and suggest contacting support
- Never make up product prices or availability - only use provided context

**Key Features to Help With:**
1. **Product Search**: Help users find items by category, price range, or type
2. **Auctions**: Explain how bidding works, reserve prices, and auction timings
3. **Orders**: Help track orders and understand order status
4. **Payments**: Explain Razorpay payment process and troubleshoot issues
5. **Account**: Guide on creating accounts, listing items, and profile management

**Important Rules:**
- Be conversational and friendly
- Keep responses concise (2-3 paragraphs max)
- Use emojis sparingly
- For complex issues, suggest contacting human support
- Never ask for sensitive information (passwords, full card numbers)
- If user seems frustrated, empathize and offer to escalate

**Response Format:**
- Start with a direct answer
- Provide relevant details
- End with a helpful question or next step`,

  // Quick Reply Suggestions
  quickReplies: [
    "🔍 Search Products",
    "🏷️ Browse Auctions", 
    "📦 Track My Order",
    "💳 Payment Help",
    "❓ How to Bid",
    "👤 Account Help"
  ],
  
  // Greeting Messages
  greetingMessages: [
    "Hi! 👋 I'm your CraftCurio assistant. How can I help you today?",
    "Hello! Welcome to CraftCurio. What can I assist you with?",
    "Hi there! Need help finding something or have questions? I'm here to help!"
  ],
  
  // Fallback Messages
  fallbackMessages: [
    "I'm not quite sure about that. Could you rephrase your question?",
    "I don't have information on that specific topic. Would you like to speak with our support team?",
    "That's a great question! Let me connect you with a human agent who can help better."
  ]
};

// Category mappings for product search
export const categoryMapping = {
  'pottery': ['Pottery', 'Ceramics'],
  'textile': ['Textiles', 'Fabrics', 'Embroidery'],
  'jewelry': ['Jewelry', 'Accessories'],
  'woodwork': ['Woodwork', 'Carpentry'],
  'painting': ['Paintings', 'Art'],
  'sculpture': ['Sculptures', 'Statues'],
  'metalwork': ['Metalwork', 'Metal Art']
};

// Common FAQ patterns
export const faqPatterns = {
  'how to bid': 'To place a bid: 1) Go to an active auction, 2) Enter your bid amount (must be higher than current bid + minimum increment), 3) Click "Place Bid". If you win, you have 48 hours to complete payment.',
  'payment methods': 'We accept credit/debit cards, UPI, net banking, and digital wallets through Razorpay. All payments are secure and encrypted.',
  'shipping': 'Shipping time varies by artisan location and your address. Typically 5-10 business days. You can track your order in "My Orders" section.',
  'returns': 'Returns accepted within 7 days of delivery for damaged or misrepresented items. Contact the artisan or our support team to initiate a return.',
  'account creation': 'Click "Sign Up" in the top right, enter your email and password, and verify your email. You can then browse as a buyer or register as an artisan.',
  'list products': 'Artisans can list products by going to "My Dashboard" > "Add New Product". Fill in details, upload images, set price, and choose direct sale or auction.',
  'auction vs direct': 'Direct Sale: Buy immediately at a fixed price. Auction: Bid against others, highest bidder wins when time expires. Some auctions have "Buy Now" for instant purchase.',
  'reserve price': 'Reserve price is the minimum price a seller will accept. If bidding doesn\'t reach this amount, the item won\'t be sold.'
};
