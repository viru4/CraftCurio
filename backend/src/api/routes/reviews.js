import express from 'express';
import { 
  getArtisanReviews,
  replyToReview,
  updateReply,
  deleteReply,
  getProductReviews,
  submitReview
} from '../controllers/reviewController.js';
import { authenticate } from '../../middleware/authMiddleware.js';
import { requireRole } from '../../middleware/roleMiddleware.js';

const router = express.Router();

// Public routes
router.get('/product/:productId', getProductReviews);

// Authenticated customer routes
router.post('/product/:productId', authenticate, submitReview);

// Artisan routes - require authentication and artisan role
router.get('/artisan/my-reviews', authenticate, requireRole('artisan'), getArtisanReviews);
router.post('/artisan/:reviewId/reply', authenticate, requireRole('artisan'), replyToReview);
router.put('/artisan/:reviewId/reply', authenticate, requireRole('artisan'), updateReply);
router.delete('/artisan/:reviewId/reply', authenticate, requireRole('artisan'), deleteReply);

export default router;
