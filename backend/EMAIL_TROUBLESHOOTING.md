# Email/OTP Troubleshooting Guide

## Issue: OTP Not Being Received

### Quick Check
1. **Check Backend Console** - OTPs are ALWAYS logged to the console, even if email fails
   - Look for: `📧 ========== OTP GENERATED ==========`
   - The OTP will be displayed there

2. **Check Frontend Console** - In development mode, OTP may be shown in browser console

### Common Issues & Solutions

#### 1. Email Service Not Configured
**Symptoms:**
- OTP logged to console but no email sent
- Message: "OTP logged to console (email service not configured)"

**Solution:**
Add to your `.env` file:
```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

#### 2. Gmail Authentication Failed
**Symptoms:**
- Error: "Invalid login" or "Authentication failed"
- Email connection verification fails

**Solution:**
- Enable 2-Step Verification on your Google account
- Generate an App Password (not your regular password)
- Use the 16-character App Password as `EMAIL_PASSWORD`

**Steps:**
1. Go to Google Account → Security
2. Enable 2-Step Verification
3. Go to App passwords
4. Generate password for "Mail"
5. Copy the 16-character password
6. Use it as `EMAIL_PASSWORD` in `.env`

#### 3. Email Going to Spam
**Symptoms:**
- Email sent successfully but not in inbox

**Solution:**
- Check spam/junk folder
- Add sender email to contacts
- Check email filters

#### 4. SMTP Connection Issues
**Symptoms:**
- Error: "Connection timeout" or "ECONNREFUSED"

**Solution:**
- Check firewall settings
- Verify SMTP port (587 for TLS, 465 for SSL)
- Check if your network blocks SMTP ports

#### 5. Development Mode (No Email Config)
**Symptoms:**
- OTP works but no email sent
- This is expected behavior

**Solution:**
- OTP is always logged to backend console
- Check terminal/console output
- OTP is also included in API response in development mode

### Testing Without Email

In development mode, you can test OTP authentication without email:

1. **Backend Console Method:**
   - Request OTP
   - Check backend terminal for OTP code
   - Use that code to verify

2. **API Response Method:**
   - In development, OTP is included in API response
   - Check browser console or network tab
   - Use the OTP from response

3. **Frontend Display:**
   - In development, OTP may be displayed in success message
   - Look for: "OTP: 123456 (Development mode...)"

### Email Service Alternatives

If Gmail doesn't work, try:

1. **SendGrid:**
```env
EMAIL_SERVICE=sendgrid
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
EMAIL_USER=apikey
EMAIL_PASSWORD=your-sendgrid-api-key
```

2. **Mailgun:**
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
EMAIL_USER=your-mailgun-username
EMAIL_PASSWORD=your-mailgun-password
```

3. **Outlook/Hotmail:**
```env
EMAIL_SERVICE=hotmail
EMAIL_USER=your-email@outlook.com
EMAIL_PASSWORD=your-password
```

### Debug Steps

1. **Check Environment Variables:**
   ```bash
   # In backend directory
   node -e "console.log('EMAIL_USER:', process.env.EMAIL_USER)"
   ```

2. **Test Email Connection:**
   - Check backend console for connection verification
   - Look for: "✅ Email server connection verified" or "❌ Email server connection failed"

3. **Check Backend Logs:**
   - OTP is always logged with format:
   ```
   📧 ========== OTP GENERATED ==========
   Email: user@example.com
   OTP: 123456
   Purpose: signin
   Expires in: 10 minutes
   =====================================
   ```

4. **Verify OTP in Database:**
   - Check MongoDB for OTP collection
   - Verify OTP exists and hasn't expired

### Still Not Working?

1. Check backend terminal for detailed error messages
2. Verify `.env` file is in `backend/` directory
3. Restart backend server after changing `.env`
4. Check if email service credentials are correct
5. Try a different email service provider

