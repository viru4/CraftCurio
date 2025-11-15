import express from 'express';
import { 
  createOrder, 
  getUserOrders, 
  getOrderById, 
  updateOrderStatus,
  updatePaymentStatus,
  cancelOrder,
  getAllOrders
} from '../controllers/orderController.js';
import { authenticate } from '../../middleware/authMiddleware.js';

const router = express.Router();

// Protected routes (require authentication)
router.post('/', authenticate, createOrder);
router.get('/my-orders', authenticate, getUserOrders);
router.get('/:id', authenticate, getOrderById);
router.patch('/:id/cancel', authenticate, cancelOrder);

// Admin routes (you can add admin middleware later)
router.get('/', authenticate, getAllOrders);
router.patch('/:id/status', authenticate, updateOrderStatus);
router.patch('/:id/payment', authenticate, updatePaymentStatus);

export default router;
