# Quick Start: Deploy CraftCurio on Render

## 🚀 Fast Track (5 Steps)

### 1. Setup MongoDB Atlas (5 min)
- Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
- Create free cluster → Get connection string
- Network Access: Add `0.0.0.0/0`

### 2. Push to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 3. Deploy on Render
1. Go to [dashboard.render.com](https://dashboard.render.com/)
2. Click **New** → **Blueprint**
3. Connect your GitHub repo
4. Render auto-detects `render.yaml` → Click **Apply**

### 4. Add Environment Variables

**Backend Service:**
```
MONGODB_URI = mongodb+srv://username:password@cluster.mongodb.net/craftcurio
JWT_SECRET = [generate with command below]
RAZORPAY_KEY_ID = your_razorpay_key
RAZORPAY_KEY_SECRET = your_razorpay_secret
CLOUDINARY_CLOUD_NAME = your_cloudinary_name
CLOUDINARY_API_KEY = your_cloudinary_key
CLOUDINARY_API_SECRET = your_cloudinary_secret
EMAIL_USER = your_email@gmail.com
EMAIL_PASSWORD = your_gmail_app_password
```

**Frontend Service:**
```
VITE_API_URL = https://craftcurio-backend.onrender.com
```

Generate JWT Secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 5. Update Frontend URL in Backend
After frontend deploys, update backend env:
```
FRONTEND_URL = https://craftcurio-frontend.onrender.com
```

---

## 📋 What You Need Before Starting

- [ ] GitHub account with your code pushed
- [ ] Render account (free)
- [ ] MongoDB Atlas account (free)
- [ ] Cloudinary account (for images)
- [ ] Razorpay account (for payments)
- [ ] Gmail app password ([create here](https://myaccount.google.com/apppasswords))

---

## ⚡ Important Notes

- **First deploy takes ~10-15 minutes**
- **Free tier**: Services sleep after 15min inactivity (30-60s wake time)
- **URLs**: Note your backend URL to use in frontend env vars
- **CORS**: Already configured in your app.js

---

## 🐛 Quick Troubleshooting

**Build fails?**
- Check logs in Render dashboard
- Verify all dependencies are saved in package.json

**Can't connect to database?**
- Check MongoDB Atlas Network Access settings
- Verify MONGODB_URI format

**CORS errors?**
- Update FRONTEND_URL in backend environment variables

**500 errors?**
- Check Render logs
- Verify all environment variables are set

---

## 📱 After Deployment

1. Visit your frontend URL
2. Test registration/login
3. Seed database: Open backend Shell → Run `npm run seed`
4. Test full workflow

---

## 🔗 Your Deployment URLs

Backend: `https://craftcurio-backend.onrender.com`  
Frontend: `https://craftcurio-frontend.onrender.com`  

(Replace with your actual URLs after deployment)

---

For detailed guide, see [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
