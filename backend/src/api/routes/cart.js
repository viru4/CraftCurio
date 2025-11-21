import express from 'express';
import { authenticate } from '../../middleware/authMiddleware.js';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} from '../controllers/cartController.js';

const router = express.Router();

// All cart routes require authentication
router.use(authenticate);

// Get user's cart
router.get('/', getCart);

// Add item to cart
router.post('/', addToCart);

// Update item quantity
router.put('/:productId', updateCartItem);

// Remove item from cart
router.delete('/:productId', removeFromCart);

// Clear cart
router.post('/clear', clearCart);

export default router;
