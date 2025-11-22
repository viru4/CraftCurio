# Quick Fix: Email Not Sending OTP

## Issue Found
Your `.env` file has `EMAIL_PASSWORD` with **spaces**:
```
EMAIL_PASSWORD=ilab tsny afsk ozeq
```

Gmail App Passwords are **16 characters without spaces**.

## ✅ Solution Applied
I've updated the code to **automatically remove spaces** from the password. However, you should still fix your `.env` file.

## Steps to Fix

### Option 1: Fix .env File (Recommended)
1. Open `backend/.env`
2. Change:
   ```env
   EMAIL_PASSWORD=ilab tsny afsk ozeq
   ```
   To:
   ```env
   EMAIL_PASSWORD=ilabtsnyafskozeq
   ```
3. **Restart your backend server**

### Option 2: Use Current Code (Auto-fix)
The code now automatically removes spaces, so it should work. But **restart your server** to load the updated code.

## Verify It's Working

1. **Restart backend server** (important!)

2. **Request an OTP** (sign in or sign up)

3. **Check backend console** for:
   - `🔍 Email Configuration Check:` - Should show password length
   - `✅ Email server connection verified` - Connection successful
   - `✅ Email sent successfully!` - Email was sent

4. **Check your email inbox** (and spam folder)

## If Still Not Working

Check backend console for error messages:
- `❌ Email server connection failed` - See error details
- `EAUTH` error - Authentication failed (check password)
- `ECONNECTION` error - Connection issue

## Test Email Endpoint

You can test email configuration:
```bash
POST http://localhost:8000/api/auth/test-email
Body: { "email": "your-email@gmail.com" }
```

This will send a test email and show detailed error messages if something is wrong.

