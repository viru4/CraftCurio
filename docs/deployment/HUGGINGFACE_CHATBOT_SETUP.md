# Hugging Face Chatbot Setup Guide

## Overview
CraftCurio now uses **Hugging Face Inference API** for the AI chatbot instead of Google Gemini. This provides access to various open-source LLMs with a generous free tier.

## 🚀 Quick Setup

### 1. Get Your Free Hugging Face API Key

1. Go to [Hugging Face](https://huggingface.co/)
2. Sign up or log in
3. Navigate to **Settings** → **Access Tokens**
4. Click **"New token"**
5. Give it a name (e.g., "CraftCurio Chatbot")
6. Select **"Read"** permission (sufficient for inference)
7. Click **"Generate"**
8. Copy your token

### 2. Add API Key to Environment Variables

Open `backend/.env` and add your Hugging Face API key:

```env
# Hugging Face API
HUGGINGFACE_API_KEY=hf_your_actual_api_key_here
```

### 3. Start the Backend Server

```bash
cd backend
npm start
```

The chatbot will automatically initialize with Hugging Face!

## 📦 Installed Packages

- **@huggingface/inference** (v4.13.9) - Official Hugging Face Inference SDK

## 🤖 Available Models

The default model is **`meta-llama/Llama-3.2-3B-Instruct`**. You can change it in `backend/src/config/chatbot.config.js`:

### Free Tier Models (No Credits Required)

1. **`meta-llama/Llama-3.2-3B-Instruct`** ⭐ (Default)
   - Fast, efficient, good for customer support
   - 3B parameters
   
2. **`mistralai/Mistral-7B-Instruct-v0.2`**
   - More powerful, slightly slower
   - 7B parameters
   
3. **`HuggingFaceH4/zephyr-7b-beta`**
   - Good conversational abilities
   - 7B parameters

4. **`microsoft/DialoGPT-large`**
   - Optimized for dialogue
   - Great for chatbots

### To Change Model:

Edit `backend/src/config/chatbot.config.js`:

```javascript
export const chatbotConfig = {
  // Change this line:
  model: 'mistralai/Mistral-7B-Instruct-v0.2',
  temperature: 0.7,
  maxOutputTokens: 1000,
  // ... rest of config
};
```

## 🔄 What Changed?

### Files Modified:

1. **`backend/src/services/huggingfaceService.js`** (NEW)
   - Replaces `geminiService.js`
   - Handles Hugging Face API calls
   - Streaming chat completions

2. **`backend/src/services/chatbotService.js`**
   - Updated import from `geminiService` to `huggingfaceService`
   - All function calls updated

3. **`backend/src/config/chatbot.config.js`**
   - Model changed from `gemini-2.0-flash` to `meta-llama/Llama-3.2-3B-Instruct`
   - Comments updated

4. **`backend/.env`**
   - Replaced `GEMINI_API_KEY` with `HUGGINGFACE_API_KEY`

5. **`backend/package.json`**
   - Removed `@google/genai`
   - Added `@huggingface/inference`

### Files You Can Delete (Optional):

- `backend/src/services/geminiService.js` - No longer needed

## 🧪 Testing the Chatbot

1. **Start the backend:**
   ```bash
   cd backend
   npm start
   ```

2. **Start the frontend:**
   ```bash
   cd front-end
   npm run dev
   ```

3. **Open the app** and click the chatbot icon (bottom-right)

4. **Test queries:**
   - "Hello!"
   - "What products do you have?"
   - "How do I bid on an auction?"
   - "Track my order"

## 🎯 API Rate Limits (Free Tier)

Hugging Face Free Tier provides:
- **1,000 requests per day**
- **No credit card required**
- **Rate limit:** ~30 requests per minute

This is more than enough for development and small-scale production!

## 🔧 Troubleshooting

### Error: "Invalid Hugging Face API key"

**Solution:**
1. Check your `.env` file has the correct key
2. Verify the key format starts with `hf_`
3. Make sure you restarted the server after adding the key

### Error: "API quota exceeded"

**Solution:**
- Free tier: Wait for the daily reset (1,000 requests/day)
- Upgrade to Pro for unlimited requests ($9/month)

### Chatbot responses are slow

**Solution:**
1. Try a smaller model (Llama-3.2-3B is fastest)
2. Reduce `maxOutputTokens` in config
3. Check your internet connection

### Model not found

**Solution:**
- Ensure the model name is correct and publicly available
- Some models require authentication - check model card on Hugging Face

## 📚 Additional Resources

- [Hugging Face Inference API Docs](https://huggingface.co/docs/api-inference/index)
- [Available Models](https://huggingface.co/models?pipeline_tag=text-generation&sort=trending)
- [Hugging Face Pricing](https://huggingface.co/pricing)
- [API Status](https://status.huggingface.co/)

## 🆚 Hugging Face vs Gemini

| Feature | Hugging Face | Gemini (Previous) |
|---------|--------------|-------------------|
| Free Tier | 1,000 req/day | Quota exhausted |
| Models | Multiple options | Single model |
| Speed | Fast (3B-7B models) | Fast |
| Setup | Simple | Simple |
| Community | Open-source | Closed |

## 🚀 Deployment Notes

When deploying to production:

1. **Add environment variable** on your hosting platform:
   ```
   HUGGINGFACE_API_KEY=hf_your_production_key
   ```

2. **Monitor usage** at [Hugging Face Dashboard](https://huggingface.co/settings/billing)

3. **Consider upgrading** to Pro for higher limits in production

## ✅ Checklist

- [ ] Created Hugging Face account
- [ ] Generated API token
- [ ] Added `HUGGINGFACE_API_KEY` to `.env`
- [ ] Installed `@huggingface/inference` package
- [ ] Uninstalled `@google/genai` package
- [ ] Tested chatbot with sample queries
- [ ] (Optional) Customized model in config
- [ ] (Optional) Deleted old `geminiService.js` file

## 🎉 You're All Set!

Your chatbot now runs on Hugging Face! Enjoy the generous free tier and access to multiple open-source models.

For questions or issues, refer to the [Hugging Face Community Forums](https://discuss.huggingface.co/).
