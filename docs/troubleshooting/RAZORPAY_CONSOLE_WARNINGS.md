# Razorpay Console Warnings - Quick Reference

## ✅ Safe to Ignore (These Don't Break Functionality)

### 1. `Unrecognized feature: 'otp-credentials'`
- **Source:** Razorpay checkout library
- **Cause:** Browser doesn't support a new web API feature Razorpay is trying to use
- **Impact:** None - payment works fine
- **Action:** Ignore

---

### 2. `"serviceworker" must be a dictionary in your web app manifest`
- **Source:** Razorpay checkout library
- **Cause:** Razorpay's internal manifest format issue
- **Impact:** None - doesn't affect payment
- **Action:** Ignore (repeated 6 times, but harmless)

---

### 3. `Error: <svg> attribute height: Expected length, "auto"`
- **Source:** Razorpay checkout library (v2-entry-app-53bd26ed.modern.js)
- **Cause:** Razorpay's code incorrectly sets `height="auto"` on SVG elements
- **Impact:** None - just a validation warning
- **Action:** Ignore (this is Razorpay's code, not yours)
- **Note:** Can't be fixed without Razorpay updating their library

---

### 4. `Download the React DevTools...`
- **Source:** React development build
- **Cause:** React suggesting helpful dev tools
- **Impact:** None - just a suggestion
- **Action:** Ignore or install React DevTools if you want

---

## ⚠️ Errors That Need Attention

### 1. `net::ERR_BLOCKED_BY_CLIENT`
- **Source:** Browser ad blocker or privacy extension
- **Cause:** Extensions blocking Razorpay API requests
- **Impact:** **PAYMENT WILL FAIL**
- **Action:** **Disable ad blocker** on localhost:5173

**Affected requests:**
- `lumberjack.razorpay.com` - Analytics/tracking (non-critical)
- `api.razorpay.com` - Payment API (critical)
- `browser.sentry-cdn.com` - Error tracking (non-critical)

---

### 2. `Failed to load resource: net::ERR_SSL_PROTOCOL_ERROR`
- **Source:** Logo image path using `https://localhost`
- **Cause:** Localhost doesn't support HTTPS by default
- **Impact:** Logo won't show in Razorpay modal (non-critical)
- **Status:** ✅ **FIXED** - Logo commented out in code

---

### 3. `400 (Bad Request)` from Razorpay API
- **Source:** Your backend → Razorpay API
- **Cause:** Invalid payload sent to Razorpay
- **Impact:** **PAYMENT ORDER CREATION FAILS**
- **Action:** Check backend logs for detailed error

**Common causes:**
- Invalid amount (must be ≥ 100 paise)
- Missing or invalid Razorpay keys
- Incorrect payload format

**Debug steps:**
1. Check backend terminal for `[Payment Service]` logs
2. Verify payload being sent
3. Verify Razorpay keys in `.env`

---

### 4. `Payment failed: International cards are not supported`
- **Source:** Razorpay API response
- **Cause:** Using international test card (4111 1111 1111 1111)
- **Impact:** **PAYMENT FAILS**
- **Action:** **Use domestic test card instead**

**✅ Working domestic card:**
```
Card: 5267 3181 8797 5449
CVV: 123
Expiry: 12/25
OTP: 1234
```

---

### 5. `500 (Internal Server Error)` from Razorpay
- **Source:** Razorpay API
- **Cause:** Usually invalid/expired API keys
- **Impact:** **PAYMENT VALIDATION FAILS**
- **Action:** 
  1. Regenerate keys in Razorpay dashboard
  2. Update `.env` file
  3. Restart backend

---

## 🎯 Critical vs Non-Critical Errors

### ❌ **Critical (Block Payment):**
1. `ERR_BLOCKED_BY_CLIENT` for `api.razorpay.com`
2. `400 Bad Request` from payment API
3. `International cards not supported`
4. `500 Internal Server Error`

### ⚠️ **Non-Critical (Payment Still Works):**
1. `otp-credentials` warning
2. `serviceworker` warnings
3. `SVG height: auto` error
4. `ERR_BLOCKED_BY_CLIENT` for `lumberjack.razorpay.com`
5. Logo SSL error

---

## 📋 Clean Console Checklist

To get a clean console during payment:

- [x] Disable ad blocker (**required**)
- [x] Logo path fixed (no SSL error)
- [ ] Install React DevTools (optional)
- [ ] Filter console to hide Razorpay warnings (optional)

**Expected warnings after fixes:**
- `otp-credentials` ← Safe to ignore
- `serviceworker` (6x) ← Safe to ignore  
- `SVG height: auto` ← Safe to ignore

**No errors should appear** if:
- Ad blocker is disabled
- Razorpay keys are correct
- Using domestic test card
- Backend is running

---

## 🔍 How to Filter Console Warnings

**In Chrome DevTools:**
1. Open Console (F12)
2. Click the filter icon (funnel)
3. Add negative filters:
   - `-otp-credentials`
   - `-serviceworker`
   - `-<svg>`
   - `-React DevTools`

This will hide the harmless Razorpay warnings.

---

## 📊 Expected Console Flow (Clean)

### Before Payment:
```
✅ App initialized
✅ User logged in
✅ Cart loaded
```

### During Checkout:
```
✅ Creating payment order...
✅ Razorpay order created: order_xxxxx
✅ Opening Razorpay modal...
⚠️ Unrecognized feature: 'otp-credentials' [IGNORE]
⚠️ serviceworker warnings [IGNORE]
⚠️ SVG height warning [IGNORE]
```

### After Payment:
```
✅ Payment successful
✅ Order updated
✅ Redirecting to confirmation...
```

---

## 🚨 When to Worry

**Only worry about these:**

1. **"ERR_BLOCKED_BY_CLIENT" for api.razorpay.com**
   → Disable ad blocker

2. **"400 Bad Request" from Razorpay**
   → Check backend logs, verify keys

3. **"Payment failed: ..." messages**
   → Check error description, use domestic card

4. **Backend not responding**
   → Restart backend server

**Everything else is safe to ignore!**

---

## 📞 Need Help?

If you see errors NOT listed here:
1. Copy the full error message
2. Check backend terminal logs
3. Refer to `RAZORPAY_400_DEBUG.md` for detailed debugging
4. Contact support with error details

---

**Last Updated:** December 7, 2025  
**Status:** All non-critical warnings documented  
**Action Required:** Only disable ad blocker for testing
