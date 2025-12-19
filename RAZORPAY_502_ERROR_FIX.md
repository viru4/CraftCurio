# Razorpay 502 Bad Gateway Error - Fix Guide

## 🔴 Error Description

**Error**: `POST https://api.razorpay.com/v1/standard_checkout/payments/cre... 502 (Bad Gateway)`

This error occurs when Razorpay's internal API returns a 502 Bad Gateway response. This typically happens when:
1. Razorpay's servers are experiencing issues
2. The payment request format is incorrect
3. Network connectivity issues
4. Razorpay account restrictions

## ✅ Fixes Applied

### 1. **Enhanced Error Handling**
- Added comprehensive error handling for Razorpay checkout initialization
- Added validation for Razorpay order ID format
- Added amount validation before opening checkout
- Improved error messages for better debugging

### 2. **Backend Error Handling**
- Added try-catch for Razorpay API calls
- Better error messages based on status codes:
  - `401`: Invalid API credentials
  - `400`: Invalid request format
  - `500+`: Service unavailable
- Detailed error logging for debugging

### 3. **Frontend Validation**
- Validates Razorpay order ID format (must start with `order_`)
- Validates amount is positive and in paise
- Validates all required fields before opening checkout
- Better error handling for checkout errors

### 4. **Improved Error Messages**
- More descriptive error messages for users
- Console logging for debugging
- Proper error propagation

## 🔍 Troubleshooting Steps

### Step 1: Verify Razorpay Account Status
1. Login to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Check if your account is active
3. Verify KYC status (if required)
4. Check for any account restrictions

### Step 2: Verify API Keys
1. Go to **Settings → API Keys** in Razorpay Dashboard
2. Ensure you're using **Test Mode** keys for development:
   - Key ID should start with `rzp_test_`
   - Key Secret should match exactly
3. Verify keys in your `.env` file:
   ```env
   RAZORPAY_KEY_ID=rzp_test_...
   RAZORPAY_KEY_SECRET=...
   ```
4. **Restart your backend server** after changing keys

### Step 3: Check Backend Logs
Look for these messages in your backend console:
```
✅ [Payment Service] Razorpay initialized with key: rzp_test_...
[Payment Service] Creating Razorpay order for: { orderId: '...', amount: ... }
[Payment Service] Razorpay order created: { id: 'order_...', amount: ..., status: 'created' }
```

If you see errors, check:
- Are the API keys correct?
- Is the amount valid (minimum ₹1)?
- Is the order format correct?

### Step 4: Check Network Connectivity
1. Ensure your backend can reach `api.razorpay.com`
2. Check for firewall/proxy issues
3. Try from a different network if possible

### Step 5: Test with Different Cards
Try these Razorpay test cards:
- **Success**: `4111 1111 1111 1111` (any CVV, any future expiry)
- **Failure**: `4000 0000 0000 0002`
- **UPI**: `success@razorpay`

### Step 6: Check Browser Console
Look for:
- Network errors
- CORS errors
- JavaScript errors
- Razorpay SDK loading errors

## 🛠️ Common Causes & Solutions

### Cause 1: Invalid API Keys
**Solution**: 
- Regenerate keys from Razorpay Dashboard
- Update `.env` file
- Restart backend server

### Cause 2: Network/Firewall Issues
**Solution**:
- Check if `api.razorpay.com` is accessible
- Disable VPN/proxy temporarily
- Check firewall settings

### Cause 3: Razorpay Service Issues
**Solution**:
- Check [Razorpay Status Page](https://status.razorpay.com/)
- Wait a few minutes and retry
- Contact Razorpay support if issue persists

### Cause 4: Invalid Order Format
**Solution**:
- Ensure order amount is in paise (multiplied by 100)
- Verify order ID format is correct
- Check all required fields are present

### Cause 5: Account Restrictions
**Solution**:
- Complete KYC verification
- Check for payment method restrictions
- Verify account is in correct mode (Test/Live)

## 📋 Testing Checklist

- [ ] Backend server is running
- [ ] Razorpay keys are set in `.env`
- [ ] Backend logs show "Razorpay initialized"
- [ ] Order is created successfully
- [ ] Razorpay checkout modal opens
- [ ] Test card payment works
- [ ] No console errors in browser
- [ ] No network errors in browser DevTools

## 🔧 Additional Debugging

### Enable Detailed Logging
The code now includes detailed console logging:
- `✅` = Success messages
- `❌` = Error messages
- Check both browser console and backend logs

### Test Order Creation
1. Create an order through your app
2. Check backend logs for order creation
3. Verify Razorpay order is created
4. Check Razorpay Dashboard for the order

### Test Payment Flow
1. Open checkout
2. Enter test card: `4111 1111 1111 1111`
3. Complete payment
4. Check if payment is verified
5. Verify order status updates

## 📞 If Issue Persists

1. **Check Razorpay Dashboard**:
   - Go to **Payments → Orders**
   - Check if orders are being created
   - Look for any error messages

2. **Contact Razorpay Support**:
   - Email: support@razorpay.com
   - Include:
     - Order ID
     - Error message
     - Screenshot of error
     - Backend logs

3. **Check Razorpay Documentation**:
   - [Razorpay Docs](https://razorpay.com/docs/)
   - [Error Codes](https://razorpay.com/docs/api/errors/)
   - [Test Mode Guide](https://razorpay.com/docs/payments/dashboard/test-mode/)

## 🎯 Quick Fixes to Try

1. **Clear browser cache and cookies**
2. **Restart backend server**
3. **Regenerate Razorpay API keys**
4. **Try in incognito/private browsing mode**
5. **Disable browser extensions** (ad blockers, privacy tools)
6. **Check if Razorpay script is loading**: Open browser console and type `window.Razorpay`

## ✅ What's Fixed

- ✅ Better error handling for Razorpay API calls
- ✅ Validation before opening checkout
- ✅ Improved error messages
- ✅ Better logging for debugging
- ✅ Proper error propagation
- ✅ Checkout error handling

The 502 error is now handled gracefully with better error messages and logging to help identify the root cause.

