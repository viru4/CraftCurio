import express from 'express';
import {
  createPaymentOrder,
  verifyPayment,
  paymentFailure,
  fetchPaymentDetails,
  refundPayment,
  handleWebhook
} from '../controllers/paymentController.js';
import { authenticate } from '../../middleware/authMiddleware.js';
import { requireRole } from '../../middleware/roleMiddleware.js';

const router = express.Router();

/**
 * Payment Routes
 * Base path: /api/payments
 */

// Create Razorpay order for payment
router.post('/create-order', authenticate, createPaymentOrder);

// Verify payment after successful transaction
router.post('/verify', authenticate, verifyPayment);

// Handle payment failure
router.post('/failure', authenticate, paymentFailure);

// Get payment details
router.get('/:paymentId', authenticate, fetchPaymentDetails);

// Process refund (admin only)
router.post('/refund', authenticate, requireRole(['admin']), refundPayment);

// Webhook endpoint (no auth - verified by signature)
router.post('/webhook', handleWebhook);

export default router;
