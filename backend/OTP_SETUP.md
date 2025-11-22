# OTP-Based Authentication Setup Guide

## Overview
CraftCurio now uses OTP (One-Time Password) based authentication for all users including admin. Users receive a 6-digit code via email to sign in or sign up.

## Environment Variables

Add these to your `.env` file:

```env
# Email Service Configuration (for sending OTP)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
# OR use EMAIL_APP_PASSWORD if using Gmail App Password
```

## Gmail Setup (Recommended for Development)

1. **Enable 2-Step Verification** on your Google account
2. **Generate App Password**:
   - Go to Google Account → Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Use this 16-character password as `EMAIL_PASSWORD`

## Development Mode

If email service is not configured, OTPs will be logged to the console for testing:
- Check backend console logs for OTP codes
- Email sending will be skipped but OTP generation still works

## API Endpoints

### Sign In Flow
1. `POST /api/auth/send-otp-signin` - Send OTP to email
   - Body: `{ "email": "user@example.com" }`
   
2. `POST /api/auth/verify-otp-signin` - Verify OTP and sign in
   - Body: `{ "email": "user@example.com", "otp": "123456" }`

### Sign Up Flow
1. `POST /api/auth/send-otp-signup` - Send OTP to email
   - Body: `{ "email": "user@example.com", "fullName": "John Doe", "password": "password123", "role": "buyer" }`
   
2. `POST /api/auth/verify-otp-signup` - Verify OTP and create account
   - Body: `{ "email": "user@example.com", "otp": "123456", "fullName": "John Doe", "password": "password123", "role": "buyer" }`

## OTP Features

- **6-digit numeric code**
- **10-minute expiration**
- **5 maximum verification attempts**
- **Auto-deletion after expiration**
- **Email templates with branding**

## Security Features

- OTPs expire after 10 minutes
- Maximum 5 verification attempts per OTP
- OTPs are deleted after successful verification
- Expired OTPs are automatically cleaned up by MongoDB TTL index

