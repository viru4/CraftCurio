# CraftCurio - Render Deployment Guide

This guide will walk you through deploying CraftCurio on Render.

## Prerequisites

1. **GitHub Repository**: Push your code to GitHub
2. **MongoDB Atlas**: Set up a free MongoDB cluster
3. **Render Account**: Sign up at [render.com](https://render.com)
4. **Cloudinary Account**: For image uploads
5. **Razorpay Account**: For payment processing
6. **Gmail App Password**: For email notifications

---

## Step 1: Prepare MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Click "Connect" → "Connect your application"
4. Copy the connection string (looks like: `mongodb+srv://username:<password>@cluster.mongodb.net/craftcurio`)
5. Replace `<password>` with your actual password
6. Under "Network Access", add `0.0.0.0/0` to allow connections from anywhere

---

## Step 2: Update Backend Configuration

### Update package.json start script

The backend `package.json` should have:
```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

### Add Health Check Endpoint

Create/update `backend/src/api/routes/healthRoutes.js`:
```javascript
import express from 'express';
const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString() 
  });
});

export default router;
```

And add to your `backend/src/app.js`:
```javascript
import healthRoutes from './api/routes/healthRoutes.js';
app.use('/api', healthRoutes);
```

---

## Step 3: Configure Frontend for Production

### Update Vite Config

Ensure `front-end/vite.config.js` has proper configuration:
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:5000',
        changeOrigin: true,
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  }
})
```

### Update API Configuration

Create/update `front-end/src/config/api.js`:
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const getApiUrl = () => API_URL;
export default API_URL;
```

---

## Step 4: Push to GitHub

```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

---

## Step 5: Deploy on Render

### Option A: Using render.yaml (Recommended)

1. Log in to [Render Dashboard](https://dashboard.render.com/)
2. Click "New" → "Blueprint"
3. Connect your GitHub repository
4. Render will automatically detect the `render.yaml` file
5. Click "Apply"
6. Set the environment variables (see below)

### Option B: Manual Setup

#### Deploy Backend:
1. Click "New" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `craftcurio-backend`
   - **Region**: Oregon (or closest to you)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Plan**: Free

#### Deploy Frontend:
1. Click "New" → "Static Site"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `craftcurio-frontend`
   - **Branch**: `main`
   - **Root Directory**: `front-end`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

---

## Step 6: Configure Environment Variables

### Backend Environment Variables

In the Render dashboard for your backend service, add these environment variables:

| Key | Value | Notes |
|-----|-------|-------|
| `NODE_ENV` | `production` | |
| `MONGODB_URI` | Your MongoDB Atlas connection string | From Step 1 |
| `JWT_SECRET` | Random 32+ character string | Generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `PORT` | `5000` | Optional, Render sets this automatically |
| `FRONTEND_URL` | `https://craftcurio-frontend.onrender.com` | Replace with your actual frontend URL |
| `RAZORPAY_KEY_ID` | Your Razorpay key ID | From Razorpay dashboard |
| `RAZORPAY_KEY_SECRET` | Your Razorpay key secret | From Razorpay dashboard |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name | From Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | Your Cloudinary API key | From Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | Your Cloudinary API secret | From Cloudinary dashboard |
| `EMAIL_USER` | Your Gmail address | e.g., `yourapp@gmail.com` |
| `EMAIL_PASS` | Your Gmail app password | [Generate here](https://myaccount.google.com/apppasswords) |

### Frontend Environment Variables

In the Render dashboard for your frontend service, add:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://craftcurio-backend.onrender.com` | Replace with your actual backend URL |

---

## Step 7: Update CORS Configuration

Update your backend CORS configuration to allow your frontend domain:

```javascript
// backend/src/app.js or wherever CORS is configured
const corsOptions = {
  origin: [
    process.env.FRONTEND_URL,
    'https://craftcurio-frontend.onrender.com',
    'http://localhost:5173' // For local development
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
```

---

## Step 8: Seed Database (Optional)

After deployment, you can seed your database:

1. Go to your backend service in Render
2. Open the "Shell" tab
3. Run: `npm run seed`

Or use MongoDB Compass to import data directly.

---

## Step 9: Test Your Deployment

1. Visit your frontend URL (e.g., `https://craftcurio-frontend.onrender.com`)
2. Test user registration/login
3. Test product browsing
4. Test image uploads
5. Test payment flow (use Razorpay test mode)

---

## Troubleshooting

### Common Issues:

**Build Fails:**
- Check build logs in Render dashboard
- Ensure all dependencies are in `package.json`
- Verify Node version compatibility

**Database Connection Fails:**
- Verify MongoDB Atlas allows connections from `0.0.0.0/0`
- Check connection string format
- Ensure password doesn't contain special characters (URL encode if needed)

**CORS Errors:**
- Verify FRONTEND_URL is set correctly in backend
- Check CORS configuration includes your frontend domain

**Images Not Uploading:**
- Verify Cloudinary credentials
- Check Cloudinary upload presets

**Payment Fails:**
- Verify Razorpay keys (use test keys for testing)
- Check webhook configuration

### View Logs:

In Render dashboard, go to your service → "Logs" tab to see real-time logs.

---

## Important Notes

1. **Free Tier Limitations:**
   - Services spin down after 15 minutes of inactivity
   - First request after spin-down takes 30-60 seconds
   - 750 hours/month of free usage per service

2. **Keep Services Active:**
   - Use a service like UptimeRobot to ping your backend every 14 minutes
   - Upgrade to paid plan ($7/month) for always-on services

3. **Database Backups:**
   - MongoDB Atlas free tier doesn't include automated backups
   - Manually export data regularly

4. **Environment Variables:**
   - Never commit `.env` files to GitHub
   - Always use Render's environment variables dashboard

---

## Next Steps

1. Set up a custom domain (optional)
2. Configure SSL (automatically handled by Render)
3. Set up monitoring and alerts
4. Enable automatic deploys on git push
5. Configure Razorpay webhooks with your backend URL

---

## Useful Commands

Generate JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Test backend locally:
```bash
cd backend
npm install
npm start
```

Test frontend locally:
```bash
cd front-end
npm install
npm run dev
```

---

## Support Resources

- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Razorpay Documentation](https://razorpay.com/docs/)
- [Cloudinary Documentation](https://cloudinary.com/documentation)

---

**Deployment Checklist:**
- [ ] MongoDB Atlas cluster created and connection string obtained
- [ ] GitHub repository is up to date
- [ ] Backend and frontend deployed on Render
- [ ] All environment variables configured
- [ ] CORS configured correctly
- [ ] Database seeded (if needed)
- [ ] Application tested and working
- [ ] Custom domain configured (optional)

Good luck with your deployment! 🚀
