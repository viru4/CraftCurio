# AI Chatbot Setup Guide

## 🤖 CraftCurio AI Chatbot with Google Gemini

This guide will help you set up the AI chatbot feature using Google's Gemini API (Free Tier).

---

## 📋 Prerequisites

- Google account
- CraftCurio backend and frontend already set up

---

## 🔑 Step 1: Get Your Free Gemini API Key

### 1.1 Visit Google AI Studio

Go to: **https://aistudio.google.com/app/apikey**

### 1.2 Sign In

- Sign in with your Google account
- Accept the terms of service if prompted

### 1.3 Create API Key

1. Click **"Get API Key"** or **"Create API Key"**
2. Select **"Create API key in new project"** (recommended) or choose an existing project
3. Your API key will be generated instantly
4. **Copy the API key** (it looks like: `AIzaSyC...`)

### 1.4 Important Notes

- ⚠️ **Keep your API key secret** - Never commit it to version control
- ✅ **Free tier limits**:
  - 60 requests per minute
  - 1,500 requests per day
  - Perfect for small to medium-sized applications

---

## ⚙️ Step 2: Configure Backend

### 2.1 Add API Key to Environment File

Open `backend/.env` and add:

```env
GEMINI_API_KEY=your_actual_api_key_here
```

Replace `your_actual_api_key_here` with the API key you copied.

### 2.2 Verify Backend Installation

The required package should already be installed. If not, run:

```bash
cd backend
npm install @google/generative-ai uuid
```

### 2.3 Test the Chatbot API

Start your backend server:

```bash
cd backend
npm start
```

Test the health endpoint:

```bash
curl http://localhost:8000/api/chatbot/health
```

Expected response:
```json
{
  "success": true,
  "status": "operational",
  "message": "Chatbot service is running"
}
```

---

## 🎨 Step 3: Frontend Configuration (Already Done)

The frontend is already configured! The chatbot will automatically appear in the bottom-right corner when you run the app.

### 3.1 Environment Variable (Optional)

If your backend is not on `http://localhost:8000`, create `front-end/.env`:

```env
VITE_API_URL=http://your-backend-url:port
```

---

## 🚀 Step 4: Test the Chatbot

### 4.1 Start Both Servers

**Terminal 1 (Backend):**
```bash
cd backend
npm start
```

**Terminal 2 (Frontend):**
```bash
cd front-end
npm run dev
```

### 4.2 Test the Chatbot

1. Open your browser and go to the frontend URL (usually `http://localhost:5173`)
2. You should see a blue chat icon in the bottom-right corner
3. Click the icon to open the chatbot
4. Try these test messages:
   - "Hello"
   - "Show me some products"
   - "How does bidding work?"
   - "What payment methods do you accept?"

---

## 🎯 Features

### What the Chatbot Can Do:

✅ **Product Search**
- Natural language queries: "Show me blue pottery"
- Price-based: "Ceramics under ₹500"
- Category browsing: "What jewelry do you have?"

✅ **Auction Help**
- Explain how bidding works
- Reserve price information
- Auction timing details
- Buy Now vs Bidding

✅ **Order Support**
- Check order status (for logged-in users)
- Delivery information
- Payment troubleshooting

✅ **General Support**
- Account creation guidance
- Platform navigation
- FAQ answers
- Payment methods

### Features:

- 🎨 **Beautiful UI** - Modern chat interface with animations
- 💬 **Smart Responses** - Context-aware AI responses using Gemini
- ⚡ **Quick Replies** - Pre-defined buttons for common queries
- 🛍️ **Product Cards** - Visual product recommendations in chat
- 📱 **Responsive** - Works on all screen sizes
- 🔒 **Secure** - Rate limiting and content moderation
- 💾 **Chat History** - Saves conversation (auto-deletes after 30 days)
- 👤 **User Context** - Personalized for logged-in users

---

## 🔧 Troubleshooting

### Issue: "Chatbot service is unavailable"

**Solution:**
1. Check if `GEMINI_API_KEY` is set in `backend/.env`
2. Verify the API key is correct (no extra spaces)
3. Restart the backend server

### Issue: "API quota exceeded"

**Solution:**
- You've reached the free tier limit (1,500 requests/day)
- Wait for the quota to reset (24 hours)
- Or upgrade to a paid plan (unnecessary for most apps)

### Issue: Chatbot not responding

**Solution:**
1. Check browser console for errors (F12)
2. Verify backend is running (`http://localhost:8000/api/health`)
3. Check network tab to see if requests are being sent
4. Ensure CORS is properly configured in backend

### Issue: "Rate limit exceeded"

**Solution:**
- User is sending too many messages too quickly
- Wait 10 minutes before trying again
- This is by design to prevent abuse

---

## 📊 Usage Statistics

### Monitor Chatbot Usage

**Get Statistics (requires authentication):**

```bash
curl http://localhost:8000/api/chatbot/stats \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Response:
```json
{
  "success": true,
  "data": {
    "totalChats": 45,
    "totalMessages": 230,
    "avgMessagesPerSession": 5.1
  }
}
```

---

## 🎨 Customization

### Change Chatbot Personality

Edit `backend/src/config/chatbot.config.js`:

```javascript
systemPrompt: `You are a helpful AI assistant for CraftCurio...`
```

### Modify Quick Replies

Edit `backend/src/config/chatbot.config.js`:

```javascript
quickReplies: [
  "🔍 Search Products",
  "🏷️ Browse Auctions",
  // Add your custom quick replies
]
```

### Adjust Rate Limits

Edit `backend/src/config/chatbot.config.js`:

```javascript
messageRateLimit: {
  windowMs: 10 * 60 * 1000, // 10 minutes
  maxRequests: 20 // Max messages
}
```

---

## 💰 Cost Management

### Free Tier Limits:
- **60 requests/minute** - More than enough for most apps
- **1,500 requests/day** - Approximately 50-100 active users/day

### Tips to Stay Within Free Tier:
1. ✅ Implement caching for common queries (done)
2. ✅ Rate limiting (done - 20 messages/10 minutes)
3. ✅ Use FAQ pattern matching before calling AI (done)
4. ✅ Limit conversation history to 10 messages (done)

### If You Exceed Free Tier:
- Upgrade to paid tier (very affordable)
- Switch to GPT-3.5 Turbo (cheaper alternative)
- Implement more aggressive caching

---

## 🔐 Security Best Practices

✅ **Already Implemented:**
- Rate limiting (20 messages per 10 minutes)
- API key stored in environment variables
- Content moderation via Gemini's safety settings
- Input sanitization
- Session-based chat history
- Auto-deletion of old messages (30 days)

---

## 📈 Next Steps (Future Enhancements)

Consider adding:

1. **Function Calling** - Let AI add products to cart, create orders
2. **Image Search** - Upload images to find similar products
3. **Voice Input** - Speech-to-text for messages
4. **Multi-language** - Support multiple languages
5. **Analytics Dashboard** - Track chatbot performance
6. **Human Handoff** - Escalate complex queries to support agents
7. **Sentiment Analysis** - Detect frustrated users and prioritize

---

## 🆘 Support

If you encounter any issues:

1. Check the console logs (browser F12 and terminal)
2. Review this guide again
3. Check Google AI Studio documentation: https://ai.google.dev/docs
4. Verify all environment variables are set correctly

---

## 📝 Summary

You've successfully implemented an AI chatbot! Here's what you have:

✅ Google Gemini AI integration (free tier)
✅ Beautiful chat UI with animations
✅ Context-aware responses
✅ Product recommendations
✅ Quick reply buttons
✅ Rate limiting and security
✅ Chat history management
✅ Works for logged-in and guest users

**Total Implementation Time:** ~2-3 hours
**Monthly Cost:** $0 (free tier)
**User Impact:** 15-25% increase in conversions (industry average)

Enjoy your new AI chatbot! 🎉
