import express from 'express';
import { authenticate } from '../../middleware/authMiddleware.js';
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist
} from '../controllers/wishlistController.js';

const router = express.Router();

// All wishlist routes require authentication
router.use(authenticate);

// Get user's wishlist
router.get('/', getWishlist);

// Add item to wishlist
router.post('/', addToWishlist);

// Remove item from wishlist
router.delete('/:productId', removeFromWishlist);

// Clear wishlist
router.delete('/', clearWishlist);

export default router;
