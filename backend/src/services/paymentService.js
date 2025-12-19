import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/Order.js';
import appConfig from '../config/appConfig.js';

/**
 * Payment Service - Handles Razorpay payment integration
 */

// Validate Razorpay configuration
if (!appConfig.razorpay.keyId || !appConfig.razorpay.keySecret) {
  console.error('❌ [Payment Service] RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be set in environment variables');
  console.error('Current config:', {
    keyId: appConfig.razorpay.keyId ? `${appConfig.razorpay.keyId.substring(0, 10)}...` : 'NOT SET',
    keySecret: appConfig.razorpay.keySecret ? 'SET (hidden)' : 'NOT SET'
  });
}

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: appConfig.razorpay.keyId,
  key_secret: appConfig.razorpay.keySecret
});

console.log('✅ [Payment Service] Razorpay initialized with key:', 
  appConfig.razorpay.keyId ? `${appConfig.razorpay.keyId.substring(0, 15)}...` : 'MISSING');

/**
 * Create a Razorpay order
 * @param {String} orderId - MongoDB order ID
 * @param {Number} amount - Amount in rupees
 * @returns {Object} Razorpay order details
 */
export const createRazorpayOrder = async (orderId, amount) => {
  try {
    console.log('[Payment Service] Creating Razorpay order for:', { orderId, amount });

    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    // Validate amount matches order total (with small tolerance for rounding)
    const orderTotal = order.total;
    const amountDifference = Math.abs(amount - orderTotal);
    if (amountDifference > 0.01) {
      console.warn('[Payment Service] Amount mismatch:', {
        orderTotal,
        providedAmount: amount,
        difference: amountDifference
      });
      // Use order total instead of provided amount for security
      amount = orderTotal;
    }

    console.log('[Payment Service] Order found:', {
      orderNumber: order.orderNumber,
      totalAmount: order.total,
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus
    });

    // Check if order is already paid
    if (order.paymentStatus === 'paid') {
      throw new Error('Order is already paid');
    }

    // Prepare Razorpay order payload
    const orderPayload = {
      amount: Math.round(amount * 100), // Convert to paise
      currency: 'INR',
      receipt: order.orderNumber,
      notes: {
        orderId: orderId.toString(),
        orderNumber: order.orderNumber
      }
    };

    // Log the exact payload being sent to Razorpay
    console.log('[Payment Service] Razorpay order payload:', JSON.stringify(orderPayload, null, 2));

    // Validate payload before sending
    if (!orderPayload.amount || orderPayload.amount <= 0) {
      throw new Error(`Invalid amount: ${orderPayload.amount}. Amount must be positive.`);
    }
    if (orderPayload.amount < 100) {
      throw new Error(`Amount too small: ${orderPayload.amount} paise. Minimum is 100 paise (₹1).`);
    }

    // Create Razorpay order
    console.log('[Payment Service] Sending request to Razorpay API...');
    
    let razorpayOrder;
    try {
      razorpayOrder = await razorpay.orders.create(orderPayload);
    } catch (razorpayError) {
      console.error('[Payment Service] Razorpay API error:', {
        message: razorpayError.message,
        statusCode: razorpayError.statusCode,
        error: razorpayError.error,
        description: razorpayError.error?.description
      });
      
      // Provide more helpful error messages
      if (razorpayError.statusCode === 401) {
        throw new Error('Invalid Razorpay API credentials. Please check your API keys.');
      } else if (razorpayError.statusCode === 400) {
        throw new Error(`Invalid payment request: ${razorpayError.error?.description || razorpayError.message}`);
      } else if (razorpayError.statusCode >= 500) {
        throw new Error('Razorpay service is temporarily unavailable. Please try again in a few moments.');
      } else {
        throw new Error(`Payment service error: ${razorpayError.error?.description || razorpayError.message}`);
      }
    }

    console.log('[Payment Service] Razorpay order created:', {
      id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      status: razorpayOrder.status
    });

    // Store Razorpay order ID in our order
    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    return {
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: appConfig.razorpay.keyId
    };
  } catch (error) {
    console.error('[Payment Service] Error creating Razorpay order:', {
      message: error.message,
      stack: error.stack,
      response: error.error // Razorpay error response if available
    });
    throw error;
  }
};

/**
 * Verify Razorpay payment signature
 * @param {Object} paymentData - Payment verification data
 * @returns {Boolean} Whether signature is valid
 */
export const verifyPaymentSignature = (paymentData) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = paymentData;

  // Validate required fields
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    console.error('[Payment Service] Missing required fields for signature verification');
    return false;
  }

  const body = razorpay_order_id + '|' + razorpay_payment_id;
  
  const expectedSignature = crypto
    .createHmac('sha256', appConfig.razorpay.keySecret)
    .update(body)
    .digest('hex');

  const isValid = expectedSignature === razorpay_signature;
  
  if (!isValid) {
    console.error('[Payment Service] Signature verification failed', {
      expected: expectedSignature.substring(0, 20) + '...',
      received: razorpay_signature.substring(0, 20) + '...'
    });
  }

  return isValid;
};

/**
 * Update order after successful payment
 * @param {String} orderId - MongoDB order ID
 * @param {Object} paymentDetails - Razorpay payment details
 * @returns {Object} Updated order
 */
export const updateOrderPayment = async (orderId, paymentDetails) => {
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    // Verify payment signature
    const isValid = verifyPaymentSignature(paymentDetails);
    if (!isValid) {
      throw new Error('Invalid payment signature');
    }

    // Update order
    order.paymentStatus = 'paid';
    order.paymentMethod = 'razorpay';
    order.razorpayPaymentId = paymentDetails.razorpay_payment_id;
    order.orderStatus = 'processing';
    order.paidAt = new Date();

    await order.save();

    return order;
  } catch (error) {
    console.error('Error updating order payment:', error);
    throw error;
  }
};

/**
 * Handle payment failure
 * @param {String} orderId - MongoDB order ID
 * @param {Object} errorDetails - Error details from Razorpay
 * @returns {Object} Updated order
 */
export const handlePaymentFailure = async (orderId, errorDetails) => {
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    order.paymentStatus = 'failed';
    const failureMessage = `Payment failed: ${errorDetails.description || errorDetails.reason || 'Unknown error'}`;
    order.notes = order.notes ? `${order.notes}\n${failureMessage}` : failureMessage;

    await order.save();

    return order;
  } catch (error) {
    console.error('Error handling payment failure:', error);
    throw error;
  }
};

/**
 * Get Razorpay payment details
 * @param {String} paymentId - Razorpay payment ID
 * @returns {Object} Payment details
 */
export const getPaymentDetails = async (paymentId) => {
  try {
    const payment = await razorpay.payments.fetch(paymentId);
    return payment;
  } catch (error) {
    console.error('Error fetching payment details:', error);
    throw error;
  }
};

/**
 * Process refund
 * @param {String} paymentId - Razorpay payment ID
 * @param {Number} amount - Amount to refund (optional, full refund if not provided)
 * @returns {Object} Refund details
 */
export const processRefund = async (paymentId, amount = null) => {
  try {
    const refundData = amount 
      ? { amount: Math.round(amount * 100) } // Partial refund in paise
      : {}; // Full refund

    const refund = await razorpay.payments.refund(paymentId, refundData);
    return refund;
  } catch (error) {
    console.error('Error processing refund:', error);
    throw error;
  }
};

export default {
  createRazorpayOrder,
  verifyPaymentSignature,
  updateOrderPayment,
  handlePaymentFailure,
  getPaymentDetails,
  processRefund
};
