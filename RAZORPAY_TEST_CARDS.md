# Razorpay Test Cards - Quick Reference

## ✅ WORKING Test Cards (Domestic Indian Cards)

### Mastercard (Domestic) - **RECOMMENDED**
```
Card Number: 5267 3181 8797 5449
CVV: 123 (any 3 digits)
Expiry: 12/25 (any future date)
Cardholder Name: Any name
OTP: 1234
```

### Rupay Card
```
Card Number: 6076 5900 0000 0002
CVV: 123
Expiry: 12/25
Cardholder Name: Any name
OTP: 1234
```

### Mastercard (Another variant)
```
Card Number: 5104 0600 0000 0008
CVV: 123
Expiry: 12/25
Cardholder Name: Any name
OTP: 1234
```

---

## ❌ DO NOT USE (Will Fail)

### International Visa Card
```
Card Number: 4111 1111 1111 1111
❌ Error: "International cards are not supported"
```

**Why it fails:**
- This is an international test card
- Your Razorpay account has international payments disabled by default
- You'll get error: `international_transaction_not_allowed`

---

## Test Transaction Scenarios

### Successful Payment
```
Card: 5267 3181 8797 5449
CVV: 123
Expiry: 12/25
OTP: 1234
Result: ✅ Payment Success
```

### Failed Payment (Insufficient Funds)
```
Card: 4000 0000 0000 0002
CVV: 123
Expiry: 12/25
OTP: 1234
Result: ❌ Payment Failed - Insufficient funds
```

### Authentication Failed
```
Card: 5267 3181 8797 5449
CVV: 123
Expiry: 12/25
OTP: 0000 (wrong OTP)
Result: ❌ Authentication failed
```

---

## Important Notes

1. **Always use domestic cards** unless you've enabled international payments in Razorpay dashboard
2. **OTP is always 1234** for successful test transactions
3. **Any CVV works** (typically use 123)
4. **Expiry must be in future** (e.g., 12/25, 01/26, etc.)
5. **Amount doesn't matter** - all test cards work for any amount

---

## Enable International Cards (Optional)

If you need to accept international cards:

1. Login to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Navigate to: **Settings** → **Payment Methods**
3. Find: **International Cards** section
4. Click: **Enable International Cards**
5. Complete verification if required

**Note:** International cards may require additional KYC verification.

---

## Quick Test Checklist

Before testing payment:
- [ ] Backend server running on http://localhost:5000
- [ ] Frontend server running on http://localhost:5173
- [ ] Ad blocker disabled or whitelisted
- [ ] Using domestic test card (5267 3181 8797 5449)
- [ ] Razorpay script loaded (check console for `window.Razorpay`)

During payment:
- [ ] Razorpay modal opens properly
- [ ] Enter card: 5267 3181 8797 5449
- [ ] Enter CVV: 123
- [ ] Enter Expiry: 12/25
- [ ] Enter OTP: 1234
- [ ] Payment completes successfully

---

## Common Issues

### "International cards not supported"
**Solution:** Use domestic card `5267 3181 8797 5449` instead of `4111 1111 1111 1111`

### "Payment could not be completed"
**Solution:** Check backend logs, verify Razorpay keys are correct

### Razorpay modal doesn't open
**Solution:** Disable ad blocker, check console for errors

---

## More Test Cards

Full list available at:
https://razorpay.com/docs/payments/payments/test-card-details/

**Recommended for testing:**
- Success: `5267 3181 8797 5449`
- Failure: `4000 0000 0000 0002`
- Auth Fail: Use wrong OTP

---

**Last Updated:** December 7, 2025
**Razorpay Test Mode:** Active
**International Cards:** Disabled (use domestic cards only)
