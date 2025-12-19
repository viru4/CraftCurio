# CraftCurio - Razorpay Payment Gateway Setup Guide

## 📋 Overview

Razorpay payment gateway has been successfully integrated into CraftCurio for both:
- **Auction orders** (from collector dashboard)
- **Regular product orders** (from checkout page)

## 🚀 Setup Instructions

### 1. Get Razorpay API Keys

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Sign up or log in
3. Navigate to **Settings > API Keys**
4. Generate **Test Mode** keys first for development
5. Copy your:
   - **Key ID** (starts with `rzp_test_`)
   - **Key Secret**

### 2. Configure Backend

Add these environment variables to `backend/.env`:

```env
# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_your_key_id_here
RAZORPAY_KEY_SECRET=your_key_secret_here
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_here
```

### 3. Test the Integration

#### Test Mode (Free - No Real Money)

Razorpay provides test cards for development:

**Test Card Details:**
- Card Number: `4111 1111 1111 1111`
- CVV: Any 3 digits (e.g., `123`)
- Expiry: Any future date (e.g., `12/25`)
- Name: Any name

**Test UPI ID:**
- UPI ID: `success@razorpay`

**Test Scenarios:**
- Success: Use above test cards
- Failure: Card number `4000 0000 0000 0002`

### 4. Go Live

When ready for production:

1. Complete KYC verification on Razorpay
2. Switch to **Live Mode** in dashboard
3. Generate **Live API Keys** (starts with `rzp_live_`)
4. Update `.env` with live keys
5. Test with small real transactions first

## 💡 Features Implemented

### Backend
- ✅ Payment order creation
- ✅ Payment signature verification
- ✅ Order status update after payment
- ✅ Payment failure handling
- ✅ Webhook support (for automated updates)
- ✅ Refund processing (admin only)

### Frontend
- ✅ Custom `useRazorpay` hook
- ✅ Razorpay checkout integration
- ✅ Payment success/failure callbacks
- ✅ Loading states and error handling
- ✅ Address validation before payment
- ✅ Responsive payment UI

## 📂 Files Created/Modified

### Backend
- `backend/src/services/paymentService.js` - Payment business logic
- `backend/src/api/controllers/paymentController.js` - Payment endpoints
- `backend/src/api/routes/payments.js` - Payment routes
- `backend/src/config/appConfig.js` - Razorpay configuration
- `backend/src/models/Order.js` - Added Razorpay fields
- `backend/src/app.js` - Registered payment routes

### Frontend
- `front-end/src/hooks/useRazorpay.js` - Custom payment hook
- `front-end/src/utils/api.js` - Payment API functions
- `front-end/src/pages/collector/components/OrderDetailsModal.jsx` - Auction order payment
- `front-end/src/pages/Order/CheckOut.jsx` - Regular checkout payment
- `front-end/index.html` - Added Razorpay script

## 🔧 Testing Checklist

- [ ] Backend server running with Razorpay keys configured
- [ ] Frontend can create payment orders
- [ ] Razorpay checkout opens successfully
- [ ] Test payment succeeds and order updates to "paid"
- [ ] Test payment failure is handled gracefully
- [ ] Address validation works
- [ ] Loading states display correctly
- [ ] Success/failure messages show properly

## 🎯 Payment Flow

1. **User places order** → Order created with `paymentStatus: 'pending'`
2. **Payment button clicked** → Backend creates Razorpay order
3. **Razorpay checkout opens** → User selects payment method
4. **Payment completed** → Razorpay sends response with signature
5. **Signature verified** → Backend verifies payment authenticity
6. **Order updated** → Status changes to `paid`, `orderStatus: 'processing'`
7. **User redirected** → Confirmation page or orders list

## 🛡️ Security Features

- ✅ Payment signature verification (prevents tampering)
- ✅ Server-side order amount validation
- ✅ Secure webhook verification
- ✅ HTTPS required for production
- ✅ No sensitive data stored in frontend
- ✅ Token-based authentication

## 📱 Supported Payment Methods

- **Credit/Debit Cards** (Visa, Mastercard, Amex, RuPay)
- **UPI** (Google Pay, PhonePe, Paytm, etc.)
- **Net Banking** (All major banks)
- **Wallets** (Paytm, PhonePe, Mobikwik, etc.)
- **EMI Options** (for eligible cards)

## 💰 Pricing

- **Test Mode**: Free forever
- **Live Mode**: 2% per successful transaction
- No setup fees, no monthly fees
- Instant settlements available

## 🐛 Troubleshooting

### "Razorpay SDK not loaded"
- Check if `<script src="https://checkout.razorpay.com/v1/checkout.js">` is in `index.html`
- Refresh the page

### "Invalid key ID"
- Verify `RAZORPAY_KEY_ID` in `.env`
- Make sure to restart backend after changing `.env`

### "Payment verification failed"
- Check `RAZORPAY_KEY_SECRET` is correct
- Ensure signature verification logic is correct

### "Order not found"
- Order must be created before payment
- Check if order ID is being passed correctly

## 📞 Support

- **Razorpay Docs**: https://razorpay.com/docs/
- **Test Credentials**: https://razorpay.com/docs/payments/payments/test-card-details/
- **Support**: https://razorpay.com/support/

## 🎉 Next Steps

1. **Test thoroughly** in test mode
2. **Complete KYC** on Razorpay
3. **Switch to live keys** when ready
4. **Monitor transactions** in Razorpay dashboard
5. **Set up webhooks** for automated updates (optional)

---

**Ready to accept payments! 🚀**

Test the integration now:
1. Start backend: `cd backend && npm start`
2. Start frontend: `cd front-end && npm run dev`
3. Create an order and try test payment
