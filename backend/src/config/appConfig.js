import dotenv from 'dotenv';

dotenv.config();

const appConfig = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 8000,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  
  // Razorpay Configuration
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID || '',
    keySecret: process.env.RAZORPAY_KEY_SECRET || '',
    webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || ''
  },

  // Email Configuration
  email: {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD,
    from: process.env.EMAIL_FROM
  }
};

export default appConfig;