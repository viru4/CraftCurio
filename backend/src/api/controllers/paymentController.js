import crypto from 'crypto';
import {
  createRazorpayOrder,
  updateOrderPayment,
  handlePaymentFailure,
  getPaymentDetails,
  processRefund
} from '../../services/paymentService.js';

/**
 * Create Razorpay order for payment
 * @route POST /api/payments/create-order
 * @access Private
 */
export const createPaymentOrder = async (req, res) => {
  try {
    const { orderId, amount } = req.body;

    // Log incoming request for debugging
    console.log('[Payment Controller] Create order request:', {
      orderId,
      amount,
      userId: req.user?._id
    });

    if (!orderId || !amount) {
      console.error('[Payment Controller] Missing required fields:', { orderId, amount });
      return res.status(400).json({
        success: false,
        message: 'Order ID and amount are required'
      });
    }

    // Validate amount
    if (typeof amount !== 'number' || amount <= 0) {
      console.error('[Payment Controller] Invalid amount:', amount);
      return res.status(400).json({
        success: false,
        message: 'Amount must be a positive number'
      });
    }

    const razorpayOrder = await createRazorpayOrder(orderId, amount);

    console.log('[Payment Controller] Razorpay order created successfully:', {
      razorpayOrderId: razorpayOrder.razorpayOrderId,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency
    });

    res.status(200).json({
      success: true,
      data: razorpayOrder
    });
  } catch (error) {
    console.error('[Payment Controller] Error in createPaymentOrder:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create payment order'
    });
  }
};

/**
 * Verify payment and update order
 * @route POST /api/payments/verify
 * @access Private
 */
export const verifyPayment = async (req, res) => {
  try {
    const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!orderId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Missing payment verification data'
      });
    }

    const paymentData = {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    };

    const updatedOrder = await updateOrderPayment(orderId, paymentData);

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      data: {
        order: updatedOrder
      }
    });
  } catch (error) {
    console.error('Error in verifyPayment:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Payment verification failed'
    });
  }
};

/**
 * Handle payment failure
 * @route POST /api/payments/failure
 * @access Private
 */
export const paymentFailure = async (req, res) => {
  try {
    const { orderId, error } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required'
      });
    }

    const updatedOrder = await handlePaymentFailure(orderId, error || {});

    res.status(200).json({
      success: true,
      message: 'Payment failure recorded',
      data: {
        order: updatedOrder
      }
    });
  } catch (error) {
    console.error('Error in paymentFailure:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to handle payment failure'
    });
  }
};

/**
 * Get payment details
 * @route GET /api/payments/:paymentId
 * @access Private
 */
export const fetchPaymentDetails = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const paymentDetails = await getPaymentDetails(paymentId);

    res.status(200).json({
      success: true,
      data: paymentDetails
    });
  } catch (error) {
    console.error('Error in fetchPaymentDetails:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch payment details'
    });
  }
};

/**
 * Process refund
 * @route POST /api/payments/refund
 * @access Private (Admin only)
 */
export const refundPayment = async (req, res) => {
  try {
    const { paymentId, amount } = req.body;

    if (!paymentId) {
      return res.status(400).json({
        success: false,
        message: 'Payment ID is required'
      });
    }

    const refund = await processRefund(paymentId, amount);

    res.status(200).json({
      success: true,
      message: 'Refund processed successfully',
      data: refund
    });
  } catch (error) {
    console.error('Error in refundPayment:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to process refund'
    });
  }
};

/**
 * Webhook handler for Razorpay events
 * @route POST /api/payments/webhook
 * @access Public (webhook)
 */
export const handleWebhook = async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers['x-razorpay-signature'];

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (signature !== expectedSignature) {
      return res.status(400).json({
        success: false,
        message: 'Invalid webhook signature'
      });
    }

    const event = req.body.event;
    const payload = req.body.payload;

    console.log('Razorpay webhook event:', event);

    // Handle different events
    switch (event) {
      case 'payment.authorized':
        console.log('Payment authorized:', payload.payment.entity.id);
        break;
      
      case 'payment.captured':
        console.log('Payment captured:', payload.payment.entity.id);
        break;
      
      case 'payment.failed':
        console.log('Payment failed:', payload.payment.entity.id);
        break;
      
      case 'refund.created':
        console.log('Refund created:', payload.refund.entity.id);
        break;
      
      default:
        console.log('Unhandled webhook event:', event);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error in handleWebhook:', error);
    res.status(500).json({
      success: false,
      message: 'Webhook processing failed'
    });
  }
};
