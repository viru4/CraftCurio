import express from 'express';
import { 
  createOrder, 
  getUserOrders, 
  getOrderById, 
  updateOrderStatus,
  updatePaymentStatus,
  updateOrderShippingAddress,
  cancelOrder,
  getAllOrders,
  getArtisanOrders,
  bulkUpdateOrders
} from '../controllers/orderController.js';
import { authenticate } from '../../middleware/authMiddleware.js';
import { requireRole } from '../../middleware/roleMiddleware.js';

const router = express.Router();

// Specific routes first (before dynamic :id routes)
router.post('/', authenticate, createOrder);
router.get('/my-orders', authenticate, getUserOrders);
router.get('/artisan/my-orders', authenticate, requireRole('artisan'), getArtisanOrders);
router.post('/bulk-update', authenticate, requireRole('admin'), bulkUpdateOrders);

// Admin-only route for all orders (with query params support)
router.get('/all', authenticate, requireRole('admin'), getAllOrders);

// Dynamic routes last
router.get('/:id', authenticate, getOrderById);
router.patch('/:id/status', authenticate, requireRole('admin'), updateOrderStatus);
router.patch('/:id/payment', authenticate, requireRole('admin'), updatePaymentStatus);
router.patch('/:id/shipping-address', authenticate, updateOrderShippingAddress);
router.patch('/:id/cancel', authenticate, cancelOrder);

export default router;
