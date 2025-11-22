# Fix Email Password Issue

## Problem
Your `.env` file has `EMAIL_PASSWORD` with spaces:
```
EMAIL_PASSWORD=ilab tsny afsk ozeq
```

## Solution
Gmail App Passwords are 16 characters **without spaces**. Remove all spaces from the password.

### Option 1: Fix in .env file
Change from:
```env
EMAIL_PASSWORD=ilab tsny afsk ozeq
```

To:
```env
EMAIL_PASSWORD=ilabtsnyafskozeq
```

### Option 2: The code now auto-fixes this
I've updated the email service to automatically remove spaces from the password, so it should work now. But it's better to fix the .env file.

## Steps to Fix

1. **Open `backend/.env` file**

2. **Find the EMAIL_PASSWORD line**

3. **Remove all spaces** - The password should be 16 characters with no spaces:
   ```
   EMAIL_PASSWORD=ilabtsnyafskozeq
   ```

4. **Save the file**

5. **Restart your backend server** (important!)

6. **Test again** - Request an OTP and check:
   - Backend console for email configuration check
   - Your email inbox (and spam folder)

## Verify It's Working

After restarting, when you request an OTP, check the backend console for:
- `✅ Email server connection verified` - Connection successful
- `✅ Email sent successfully!` - Email was sent
- `Message ID: ...` - Confirmation email was sent

If you see `❌ Email server connection failed`, check the error message for specific issues.

