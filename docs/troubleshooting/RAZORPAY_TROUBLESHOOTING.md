# Razorpay Payment Integration - Troubleshooting Guide

## Current Errors and Solutions

### 1. ERR_BLOCKED_BY_CLIENT Errors

**Problem:** Browser extensions (ad blockers, privacy tools) are blocking Razorpay requests.

**Solutions:**
- **Disable ad blockers** on localhost during development
- **Whitelist Razorpay domains** in your ad blocker:
  - `*.razorpay.com`
  - `api.razorpay.com`
  - `lumberjack.razorpay.com`
  - `sentry-cdn.com`

**Common blockers that cause issues:**
- uBlock Origin
- Adblock Plus
- Privacy Badger
- Brave Browser shields

---

### 2. 500 Internal Server Error from Razorpay

**Problem:** `POST https://api.razorpay.com/v1/standard_checkout/payments/validate/account` returns 500 error.

**Possible Causes:**
1. Invalid or expired Razorpay test keys
2. Account not activated properly
3. Test mode restrictions

**Solutions:**

#### A. Verify Your Razorpay Keys
1. Login to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Go to Settings → API Keys
3. Regenerate test keys if needed
4. Update your `.env` file:
```env
RAZORPAY_KEY_ID=rzp_test_your_new_key_id
RAZORPAY_KEY_SECRET=your_new_key_secret
```

#### B. Check Account Status
- Ensure your Razorpay account is activated for test mode
- Verify KYC is not required for test transactions
- Check if there are any account restrictions

#### C. Test with Razorpay's Test Cards
Use these test cards for payment:
- **Success:** 4111 1111 1111 1111
- **CVV:** Any 3 digits
- **Expiry:** Any future date
- **OTP:** 1234

---

### 3. Mixed Content Warning (HTTP/HTTPS)

**Problem:** Logo loading over HTTP in HTTPS Razorpay checkout.

**Solution:** ✅ **Already Fixed**
- Updated logo path to use HTTPS
- Changed from `/logo.png` to `https://localhost:5173/cc_favicon.png`

**Alternative:** Remove logo entirely if issues persist:
```javascript
// Remove or comment out the image line
// image: 'https://localhost:5173/cc_favicon.png',
```

---

### 4. International Cards Not Supported ⚠️ **NEW**

**Problem:** "International cards are not supported. Please contact our support team for help"

**Error Code:** `BAD_REQUEST_ERROR` with reason `international_transaction_not_allowed`

**Cause:** Your Razorpay test account has international payments disabled by default.

**Solutions:**

#### Option 1: Enable International Payments (For Production)
1. Login to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Go to **Settings** → **Payment Methods**  
3. Find **International Cards** section
4. Click **Enable International Cards**
5. Complete any required verification

#### Option 2: Use Domestic Test Cards (For Testing) ✅ **Recommended**
Use **Indian domestic test cards** instead of international ones:

**Working Test Cards:**
- **Mastercard (Domestic):** `5267 3181 8797 5449`
- **Rupay:** `6076 5900 0000 0002`
- **Visa (Domestic):** `4111 1111 1111 1111` ❌ **This is international - Don't use**

**For any domestic card:**
- **CVV:** Any 3 digits (e.g., 123)
- **Expiry:** Any future date (e.g., 12/25)
- **Cardholder Name:** Any name
- **OTP:** `1234`

---

### 5. SSL Protocol Error for Logo **FIXED** ✅

**Problem:** `net::ERR_SSL_PROTOCOL_ERROR` when loading logo from `https://localhost:5173`

**Cause:** Localhost doesn't support HTTPS by default.

**Solution:** ✅ **Already Fixed** - Changed to use `window.location.origin`
```javascript
image: window.location.origin + '/cc_favicon.png'
```
This automatically uses `http://` for localhost.

---

### 6. "Unrecognized feature: 'otp-credentials'" Warning

**Problem:** Browser feature compatibility warning from Razorpay SDK.

**Impact:** This is a **harmless warning** - it doesn't affect payment functionality.

**Explanation:** Razorpay SDK requests a browser feature that's not yet widely supported. The payment will still work.

---

### 7. Service Worker Manifest Errors

**Problem:** "serviceworker" must be a dictionary in your web app manifest.

**Impact:** These are **Razorpay's internal warnings** - they don't affect your integration.

---

### 8. SVG Attribute Height Error ⚠️

**Problem:** `Error: <svg> attribute height: Expected length, "auto"`

**Source:** This error comes from **Razorpay's internal checkout library** (v2-entry-app-53bd26ed.modern.js), not your code.

**Impact:** This is a **harmless warning** - it doesn't affect payment functionality. Razorpay's library is trying to set `height="auto"` on an SVG element, which isn't valid per SVG spec, but browsers handle it gracefully.

**What NOT to do:**
- Don't try to fix this in your code (it's in Razorpay's library)
- Don't worry about it affecting payments

**Why it happens:**
- Razorpay's checkout UI uses SVG icons internally
- Their code incorrectly sets `height="auto"` instead of using CSS
- This is Razorpay's code quality issue, not yours

**If you want to suppress this warning:**
You can't directly fix it, but you can hide the error in DevTools by adding a filter. However, it's best to just ignore it as it doesn't impact functionality.

---

## Testing Checklist

### Before Testing Payments:

1. **Disable Browser Extensions**
   ```
   - Open browser in incognito/private mode, OR
   - Disable ad blockers temporarily
   ```

2. **Verify Environment Variables**
   ```bash
   # Backend .env
   RAZORPAY_KEY_ID=rzp_test_...
   RAZORPAY_KEY_SECRET=...
   ```

3. **Check Backend Server**
   ```bash
   # Should be running on http://localhost:5000
   cd backend
   npm start
   ```

4. **Check Frontend Server**
   ```bash
   # Should be running on http://localhost:5173
   cd front-end
   npm run dev
   ```

5. **Verify Razorpay Script Loaded**
   - Open browser console
   - Type: `window.Razorpay`
   - Should show: `[Function]`

### Testing Payment Flow:

1. **Create Test Order**
   - Add items to cart
   - Proceed to checkout
   - Fill in delivery details

2. **Initiate Payment**
   - Click "Continue with Payment"
   - Razorpay modal should open (if ad blocker disabled)

3. **Complete Payment**
   - Use test card: `5267 3181 8797 5449` (Domestic Mastercard)
   - CVV: `123`
   - Expiry: Any future date
   - OTP: `1234`

4. **Verify Success**
   - Payment should complete
   - Order status should update
   - Confirmation page should display

---

## Common Error Messages

### "Razorpay SDK not loaded"
**Cause:** Razorpay script blocked or failed to load
**Fix:** 
1. Check `index.html` has Razorpay script:
```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```
2. Disable ad blocker
3. Check internet connection

### "Failed to create payment order"
**Cause:** Backend API error or invalid order
**Fix:**
1. Check backend console for errors
2. Verify order exists in database
3. Check order amount is valid (> 0)

### "Payment verification failed"
**Cause:** Signature mismatch or backend error
**Fix:**
1. Verify `RAZORPAY_KEY_SECRET` matches your dashboard
2. Check backend logs for signature verification errors
3. Ensure orderId is correctly passed

---

## Development Mode Best Practices

### 1. Use Test Mode Exclusively
- Never use live keys in development
- All test keys start with `rzp_test_`

### 2. Browser Setup
- Use Chrome/Firefox for development
- Keep one browser profile for development without ad blockers
- Use DevTools Network tab to monitor API calls

### 3. Error Handling
- Always check browser console
- Monitor backend terminal for server errors
- Check Network tab for failed requests

### 4. Logging
Add debug logging in `useRazorpay.js`:
```javascript
console.log('Creating order:', { orderId, amount });
console.log('Razorpay response:', orderResponse);
console.log('Opening Razorpay checkout with options:', razorpayOptions);
```

---

## Production Deployment Checklist

Before going live:

1. ✅ Switch to live Razorpay keys (rzp_live_...)
2. ✅ Update webhook URL to production domain
3. ✅ Enable HTTPS on your domain
4. ✅ Test with real (small amount) transactions
5. ✅ Set up proper error monitoring
6. ✅ Configure proper logging
7. ✅ Test refund functionality
8. ✅ Verify webhook signature validation

---

## Quick Fix Summary

**For the current errors:**

1. **Disable ad blocker** on localhost:5173
2. **Verify Razorpay keys** are correct in backend `.env`
3. **Logo path fixed** ✅ (now uses `window.location.origin`)
4. **Use domestic test card:** `5267 3181 8797 5449` (NOT 4111...)
5. **Ignore these harmless warnings:**
   - "otp-credentials" - Browser feature warning
   - "serviceworker" - Razorpay internal warning
   - "SVG attribute height: auto" - Razorpay internal warning

**Test again with:**
- Ad blocker disabled
- Fresh browser session (clear cookies)
- **Domestic test card:** `5267 3181 8797 5449`
- CVV: 123, Expiry: 12/25, OTP: 1234

---

## Getting Help

If issues persist:

1. **Check Razorpay Logs**
   - Dashboard → Transactions → Payments
   - Look for failed attempts

2. **Backend Logs**
   ```bash
   # Check for errors in terminal running backend
   ```

3. **Network Tab**
   - Open DevTools → Network
   - Filter by "razorpay"
   - Check failed requests

4. **Razorpay Support**
   - Email: support@razorpay.com
   - Dashboard → Support

---

## Additional Resources

- [Razorpay Test Cards](https://razorpay.com/docs/payments/payments/test-card-details/)
- [Razorpay Checkout Docs](https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/)
- [Webhook Documentation](https://razorpay.com/docs/webhooks/)
