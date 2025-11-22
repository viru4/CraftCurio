# Quick Email Configuration Check

## Step 1: Verify .env File Location
Make sure your `.env` file is in the `backend/` directory (same level as `package.json`)

## Step 2: Check .env File Format
Your `.env` file should look like this:
```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-character-app-password
```

**Important:**
- No quotes around values
- No spaces around `=`
- EMAIL_PASSWORD should be a Gmail App Password (16 characters), NOT your regular password

## Step 3: Restart Server
After adding/changing .env variables, **restart your backend server**

## Step 4: Test Email Configuration
Use the test endpoint to verify:
```bash
POST http://localhost:8000/api/auth/test-email
Body: { "email": "your-test-email@gmail.com" }
```

Or use curl:
```bash
curl -X POST http://localhost:8000/api/auth/test-email \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email@gmail.com"}'
```

## Step 5: Check Backend Console
When you request an OTP, check the backend terminal for:
- `🔍 Email Configuration Check:` - Shows if env vars are loaded
- `✅ Email server connection verified` - Connection successful
- `✅ Email sent successfully!` - Email was sent
- `❌ Email server connection failed` - Connection failed (check error message)

## Common Issues

### Issue 1: "EMAIL_USER: NOT SET" or "EMAIL_PASSWORD: NOT SET"
**Solution:**
- Check .env file is in `backend/` directory
- Check .env file has correct variable names (no typos)
- Restart server after adding .env variables

### Issue 2: "Authentication failed" (EAUTH error)
**Solution:**
- For Gmail, you MUST use an App Password, not your regular password
- Enable 2-Step Verification first
- Generate App Password: Google Account → Security → App passwords
- Use the 16-character password (no spaces)

### Issue 3: "Connection failed" (ECONNECTION error)
**Solution:**
- Check internet connection
- Check firewall isn't blocking port 587
- Try using port 465 with secure: true

### Issue 4: Environment variables not loading
**Solution:**
- Make sure .env file is in `backend/` directory
- Check file is named exactly `.env` (not `.env.txt`)
- Restart server completely (stop and start again)
- Check for syntax errors in .env file

## Quick Debug Commands

Check if env vars are loaded:
```bash
cd backend
node -e "require('dotenv').config(); console.log('EMAIL_USER:', process.env.EMAIL_USER ? 'SET' : 'NOT SET'); console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? 'SET' : 'NOT SET');"
```

