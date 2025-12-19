# Razorpay 400 Bad Request - Debugging Guide

## Understanding the Error

The **400 Bad Request** error from Razorpay API (`POST https://api.razorpay.com/v1/standard_checkout/payments/create/ajax`) indicates that the request payload is malformed, missing required parameters, or contains invalid data.

---

## Common Causes

### 1. **Invalid or Missing Amount**
- Amount must be an integer in **paise** (smallest currency unit)
- Example: ₹50.00 = 5000 paise
- Minimum: 100 paise (₹1.00)
- Must be positive and non-zero

### 2. **Invalid Currency**
- Must be a valid ISO currency code
- For India: `'INR'`
- Case-sensitive

### 3. **Missing or Invalid order_id**
- Must be a valid Razorpay order ID
- Format: `order_xxxxxxxxxxxxx`
- Must be created before opening checkout

### 4. **Invalid Key ID**
- Test keys: Start with `rzp_test_`
- Live keys: Start with `rzp_live_`
- Must be active and not expired

### 5. **Incorrect Request Format**
- Content-Type header must be correct
- Payload structure must match API specification

---

## Enhanced Logging (Already Added)

I've added comprehensive logging to help identify the exact issue:

### Backend Logs to Check:

```bash
# When you try to make a payment, look for these logs:

[Payment Controller] Create order request: { orderId: '...', amount: 50, userId: '...' }
[Payment Service] Creating Razorpay order for: { orderId: '...', amount: 50 }
[Payment Service] Order found: { orderNumber: 'ORD-...', totalAmount: 50, orderStatus: 'pending' }
[Payment Service] Razorpay order payload: {
  "amount": 5000,
  "currency": "INR",
  "receipt": "ORD-...",
  "notes": {
    "orderId": "...",
    "orderNumber": "ORD-..."
  }
}
[Payment Service] Sending request to Razorpay API...
[Payment Service] Razorpay order created: { id: 'order_xxx', amount: 5000, currency: 'INR', status: 'created' }
```

### If You See Errors:

```bash
# Configuration errors:
❌ [Payment Service] RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be set

# Validation errors:
[Payment Controller] Invalid amount: -50
[Payment Service] Amount too small: 50 paise. Minimum is 100 paise (₹1).

# API errors:
[Payment Service] Error creating Razorpay order: { message: '...', response: {...} }
```

---

## Debugging Steps

### Step 1: Verify Environment Variables

Check your `.env` file in the backend folder:

```env
RAZORPAY_KEY_ID=rzp_test_RogCvh5mA7P736
RAZORPAY_KEY_SECRET=your_secret_key_here
```

**Verification:**
```bash
cd backend
# On PowerShell:
echo $env:RAZORPAY_KEY_ID
echo $env:RAZORPAY_KEY_SECRET

# Or restart your backend server and check startup logs:
✅ [Payment Service] Razorpay initialized with key: rzp_test_RogC...
```

### Step 2: Check Backend Terminal Logs

When you attempt a payment, watch your backend terminal for:

1. **Request received:**
   ```
   [Payment Controller] Create order request: {...}
   ```

2. **Payload being sent to Razorpay:**
   ```
   [Payment Service] Razorpay order payload: {...}
   ```

3. **Success or error response:**
   ```
   ✅ [Payment Service] Razorpay order created: {...}
   OR
   ❌ [Payment Service] Error creating Razorpay order: {...}
   ```

### Step 3: Validate the Payload

The payload sent to Razorpay must look like this:

```json
{
  "amount": 5000,          // Integer, in paise, minimum 100
  "currency": "INR",       // Valid ISO code
  "receipt": "ORD-12345",  // String, your order number
  "notes": {               // Optional metadata
    "orderId": "...",
    "orderNumber": "ORD-12345"
  }
}
```

**Common Issues:**
- ❌ `amount: 50.00` (should be `5000`, not a float)
- ❌ `amount: -5000` (negative amount)
- ❌ `amount: 0` (zero amount)
- ❌ `amount: 50` (less than minimum 100 paise)
- ❌ `currency: "inr"` (should be uppercase `"INR"`)
- ❌ Missing `receipt` field

### Step 4: Check Razorpay Dashboard

1. Login to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Go to **Transactions** → **Orders**
3. Check if orders are being created
4. If no orders appear, the API request is failing before reaching Razorpay

### Step 5: Test with Razorpay's API Directly

Use this curl command to test your keys:

```bash
curl -X POST https://api.razorpay.com/v1/orders \
  -u "rzp_test_RogCvh5mA7P736:YOUR_SECRET_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 5000,
    "currency": "INR",
    "receipt": "TEST_001"
  }'
```

**Expected Success Response:**
```json
{
  "id": "order_xxxxxxxxxxxxx",
  "entity": "order",
  "amount": 5000,
  "amount_paid": 0,
  "currency": "INR",
  "receipt": "TEST_001",
  "status": "created"
}
```

**If this fails:** Your API keys are invalid or your account has issues.

---

## Common Fixes

### Fix 1: Invalid Amount

**Problem:** Amount is not an integer or is less than ₹1

**Solution:** Ensure amount conversion is correct:
```javascript
// ✅ Correct:
const amountInPaise = Math.round(amountInRupees * 100);

// ❌ Wrong:
const amountInPaise = amountInRupees; // Missing conversion
const amountInPaise = amountInRupees * 100; // Should use Math.round()
```

### Fix 2: Missing Razorpay Keys

**Problem:** Environment variables not loaded

**Solution:**
1. Verify `.env` file exists in backend folder
2. Restart backend server
3. Check startup logs for Razorpay initialization message

### Fix 3: Order Not Found

**Problem:** Order doesn't exist in database

**Solution:** 
1. Check order creation logs
2. Verify order ID being passed is correct
3. Check database connection

### Fix 4: Invalid Key Format

**Problem:** Key ID or secret is malformed

**Solution:**
1. Regenerate keys from Razorpay dashboard
2. Update `.env` file
3. Restart backend server

---

## Testing the Fix

### 1. Restart Backend Server
```bash
cd backend
npm start
```

### 2. Look for Initialization Log
```
✅ [Payment Service] Razorpay initialized with key: rzp_test_RogC...
```

### 3. Test Payment Flow
1. Add items to cart
2. Go to checkout
3. Fill delivery details
4. Click "Continue with Payment"

### 4. Monitor Backend Logs
Watch terminal for:
- Request received
- Payload being sent
- Response from Razorpay
- Any errors

### 5. Check Browser Console
Look for:
- Payment order created successfully
- Razorpay modal opening
- Any JavaScript errors

---

## Expected Log Flow (Success)

```
[Payment Controller] Create order request: { orderId: '674...', amount: 1508.20, userId: '674...' }
[Payment Service] Creating Razorpay order for: { orderId: '674...', amount: 1508.20 }
[Payment Service] Order found: { orderNumber: 'ORD-1733...', totalAmount: 1508.20, orderStatus: 'pending' }
[Payment Service] Razorpay order payload: {
  "amount": 150820,
  "currency": "INR",
  "receipt": "ORD-1733...",
  "notes": {
    "orderId": "674...",
    "orderNumber": "ORD-1733..."
  }
}
[Payment Service] Sending request to Razorpay API...
[Payment Service] Razorpay order created: {
  id: 'order_NTxxxxxxxxxxxxxx',
  amount: 150820,
  currency: 'INR',
  status: 'created'
}
[Payment Controller] Razorpay order created successfully: {
  razorpayOrderId: 'order_NTxxxxxxxxxxxxxx',
  amount: 150820,
  currency: 'INR'
}
```

---

## Still Getting 400 Error?

### Check These Specific Issues:

1. **Amount Validation:**
   - Must be ≥ 100 paise (₹1.00)
   - Must be an integer (no decimals)
   - Must be positive

2. **API Key Issues:**
   - Key starts with `rzp_test_` (for test mode)
   - Key is not expired
   - Key is copied correctly (no extra spaces)

3. **Network Issues:**
   - Backend can reach `api.razorpay.com`
   - No proxy issues
   - Firewall not blocking requests

4. **Account Issues:**
   - Razorpay account is active
   - Test mode is enabled
   - No account restrictions

### Get Detailed Error Info:

Add this to catch block in `paymentService.js`:

```javascript
catch (error) {
  console.error('[Payment Service] Detailed error:', {
    message: error.message,
    statusCode: error.statusCode,
    error: error.error,
    description: error.description
  });
  throw error;
}
```

---

## Contact Razorpay Support

If the issue persists:

1. **Collect Information:**
   - Exact error message from backend logs
   - Payload being sent (from logs)
   - Your key ID (not the secret)
   - Timestamp of the error

2. **Contact Razorpay:**
   - Email: support@razorpay.com
   - Dashboard: Settings → Support
   - Include log output and error details

---

## Additional Resources

- [Razorpay Orders API Docs](https://razorpay.com/docs/api/orders/)
- [Razorpay Error Codes](https://razorpay.com/docs/api/errors/)
- [Test Mode Guide](https://razorpay.com/docs/payments/dashboard/test-mode/)

---

**Last Updated:** December 7, 2025  
**Logging Status:** ✅ Enhanced logging active  
**Validation:** ✅ Input validation added
