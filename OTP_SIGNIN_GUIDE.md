# OTP-Based Sign In - Complete Setup Guide

## ✅ Current Status

Your OTP-based sign-in is **fully implemented and working**! Here's what I verified:

### 1. Backend Email Configuration ✅
- **Email Service**: Gmail SMTP is configured correctly
- **Credentials**: Found in `backend/.env`
  - `EMAIL_USER`: craftcuriodev@gmail.com
  - `EMAIL_PASSWORD`: 16-character Gmail App Password (configured correctly)
- **Email Sending**: Tested successfully - emails are being sent!

### 2. Sign-In Page Implementation ✅
The sign-in page at `front-end/src/pages/auth/SignIn.jsx` has a complete two-step OTP flow:

**Step 1: Email Entry**
- User enters their email address
- Clicks "Send OTP" button
- Backend generates a 6-digit OTP and sends it via email

**Step 2: OTP Verification**
- Page shows 6 individual input boxes for OTP digits
- User enters the OTP received in their email
- System verifies the OTP and signs in the user

### 3. Components in Place ✅
- ✅ `OTPInput.jsx` - Beautiful 6-digit OTP input component with:
  - Auto-focus between inputs
  - Paste support
  - Backspace navigation
  - Visual feedback
- ✅ Backend routes configured
- ✅ Email service fully functional
- ✅ CORS configured for both port 5173 and 5174

## 🚀 How to Test

### Prerequisites
Both servers must be running:
1. **Backend**: `cd backend && npm start` (Running on port 8000)
2. **Frontend**: `cd front-end && npm run dev` (Running on port 5174)

### Testing Steps

1. **Navigate to Sign In Page**
   - Open your browser to: `http://localhost:5174/sign-in`

2. **Enter Email**
   - Enter an email of an existing user
   - Click "Send OTP"
   - Wait for success message

3. **Check for OTP**
   - **In Email**: Check the inbox of craftcuriodev@gmail.com (or the recipient email)
   - **In Console**: The OTP is also printed in the backend terminal for development/testing
   - Look for the section that says: `📧 ========== OTP GENERATED ==========`

4. **Enter OTP**
   - Enter the 6-digit code in the input boxes
   - Click "Verify OTP" or it will auto-submit when all 6 digits are entered
   - You'll be signed in and redirected to the home page

## 📧 OTP Email Format

The OTP email sent to users includes:
- **Subject**: "CraftCurio Sign In Verification Code"
- **Content**: Beautifully formatted HTML email with:
  - CraftCurio branding (orange gradient header)
  - Large, bold 6-digit OTP code
  - Expiration notice (10 minutes)
  - Professional styling

## 🔧 Development Features

In development mode (`NODE_ENV=development`), the API response includes the OTP:
```json
{
  "message": "OTP generated...",
  "email": "user@example.com",
  "otp": "123456",
  "note": "OTP included in response for development only"
}
```

This allows you to test without needing to check your email every time.

## 🐛 Troubleshooting

### OTP Not Received in Email?
1. **Check Backend Console**: The OTP is always logged to the console
2. **Check Spam Folder**: Sometimes emails go to spam
3. **Verify Email Service**: Run `node backend/test-email.js` to test email configuration
4. **Development Mode**: Use the OTP from the API response shown in browser console

### CORS Errors?
- The backend CORS is now configured for both port 5173 and 5174
- Restart the backend if you see CORS errors: `npm start` in the backend folder

### "User not found" Error?
- Make sure you're using an email of an existing user
- Create a new user via the Sign Up page first
- Or run the seed script to create test users

## 📝 Key Files

### Backend
- `backend/src/api/controllers/otp.controllers.js` - OTP generation and verification logic
- `backend/src/services/emailService.js` - Email sending service
- `backend/src/models/OTP.js` - OTP database model
- `backend/src/api/routes/auth.routes.js` - Authentication routes
- `backend/.env` - Email configuration

### Frontend
- `front-end/src/pages/auth/SignIn.jsx` - Main sign-in page
- `front-end/src/components/auth/OTPInput.jsx` - OTP input component
- `front-end/src/forms/SignInSchema.jsx` - Form validation schema
- `front-end/src/contexts/AuthContext.jsx` - Authentication context

## 🔒 Security Features

- ✅ OTP expires after 10 minutes
- ✅ Maximum 5 verification attempts per OTP
- ✅ OTP is deleted after successful verification
- ✅ Emails are normalized (lowercase, trimmed)
- ✅ Secure cookie-based authentication
- ✅ HTTPS/TLS for email transmission

## 🎨 UI Features

- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Loading states for all actions
- ✅ Error messages with helpful feedback
- ✅ Success messages
- ✅ Resend OTP functionality
- ✅ Change email option
- ✅ Auto-focus and keyboard navigation
- ✅ Paste support for OTP codes

## ✨ Next Steps

Your OTP sign-in is ready to use! Just:
1. Make sure both servers are running
2. Navigate to the sign-in page
3. Enter a valid user email
4. Check the backend console for the OTP
5. Enter the OTP and verify

The email service is working perfectly, and the entire flow is implemented. Enjoy your secure OTP-based authentication! 🎉
