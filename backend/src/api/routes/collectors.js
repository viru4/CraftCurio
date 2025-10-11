import express from 'express';
import {
  getCollectors,
  getCollectorById,
  createCollector,
  updateCollector,
  deleteCollector,
  addToWishlist,
  removeFromWishlist
} from '../controllers/collectorController.js';

const router = express.Router();

// GET /api/collectors - Get all collectors with pagination
router.get('/', getCollectors);

// GET /api/collectors/:id - Get collector by ID
router.get('/:id', getCollectorById);

// POST /api/collectors - Create new collector
router.post('/', createCollector);

// PUT /api/collectors/:id - Update collector
router.put('/:id', updateCollector);

// DELETE /api/collectors/:id - Delete collector
router.delete('/:id', deleteCollector);

// POST /api/collectors/:id/wishlist - Add item to wishlist
router.post('/:id/wishlist', addToWishlist);

// DELETE /api/collectors/:id/wishlist/:productId - Remove item from wishlist
router.delete('/:id/wishlist/:productId', removeFromWishlist);

export default router;