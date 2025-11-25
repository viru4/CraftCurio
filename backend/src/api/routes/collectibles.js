import express from 'express';
import {
  createCollectible,
  createCollectibles,
  getCollectibles,
  getCollectibleById,
  updateCollectible,
  deleteCollectible,
  likeCollectible,
  getCollectorListings
} from '../controllers/collectibleController.js';
import { authenticate, optionalAuth } from '../../middleware/authMiddleware.js';
import { validateBody, validateObjectId, schemas } from '../../middleware/validation.js';
import Collectible from '../../models/Collectible.js';

/**
 * Collectible Routes - Enhanced with auction and direct sale support
 * Handles all collectible listing operations with proper authentication
 */

const router = express.Router();

/**
 * @route   POST /api/collectibles
 * @desc    Create a new collectible listing (direct sale or auction)
 * @access  Private (Authenticated collectors only)
 * @body    CollectibleData with saleType: 'direct' | 'auction'
 */
router.post(
  '/',
  authenticate,
  validateBody(schemas.createCollectible),
  createCollectible
);

/**
 * @route   POST /api/collectibles/bulk
 * @desc    Bulk create collectibles (for seeding/admin)
 * @access  Private (Admin only)
 */
router.post('/bulk', createCollectibles);

/**
 * @route   GET /api/collectibles
 * @desc    Get all collectibles with filtering, pagination, and search
 * @access  Public
 * @query   page, limit, category, status, saleType, promoted, featured, popular, recent, minPrice, maxPrice, search
 */
router.get('/', getCollectibles);

/**
 * @route   GET /api/collectibles/featured
 * @desc    Get featured collectibles
 * @access  Public
 */
router.get('/featured', async (req, res) => {
  try {
    const collectibles = await Collectible.find({ featured: true, status: 'active' })
      .sort({ promoted: -1, createdAt: -1 })
      .limit(10)
      .populate('owner', 'name profilePhotoUrl')
      .lean();

    res.status(200).json({
      message: 'Featured collectibles retrieved successfully',
      count: collectibles.length,
      data: collectibles
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route   GET /api/collectibles/popular
 * @desc    Get popular collectibles based on views and likes
 * @access  Public
 */
router.get('/popular', async (req, res) => {
  try {
    const collectibles = await Collectible.find({ popular: true, status: 'active' })
      .sort({ views: -1, likes: -1, createdAt: -1 })
      .limit(10)
      .populate('owner', 'name profilePhotoUrl')
      .lean();

    res.status(200).json({
      message: 'Popular collectibles retrieved successfully',
      count: collectibles.length,
      data: collectibles
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route   GET /api/collectibles/recent
 * @desc    Get recently added collectibles
 * @access  Public
 */
router.get('/recent', async (req, res) => {
  try {
    const collectibles = await Collectible.find({ recent: true, status: 'active' })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('owner', 'name profilePhotoUrl')
      .lean();

    res.status(200).json({
      message: 'Recent collectibles retrieved successfully',
      count: collectibles.length,
      data: collectibles
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route   GET /api/collectibles/promoted
 * @desc    Get promoted/sponsored collectibles
 * @access  Public
 */
router.get('/promoted', async (req, res) => {
  try {
    const now = new Date();
    const collectibles = await Collectible.find({
      promoted: true,
      status: 'active',
      $or: [
        { promotionEndDate: { $exists: false } },
        { promotionEndDate: { $gt: now } }
      ]
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('owner', 'name profilePhotoUrl')
      .lean();

    res.status(200).json({
      message: 'Promoted collectibles retrieved successfully',
      count: collectibles.length,
      data: collectibles
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route   GET /api/collectibles/collector/:id/listings
 * @desc    Get all collectibles listed by a specific collector
 * @access  Public
 * @query   status, saleType, page, limit
 */
router.get('/collector/:id/listings', validateObjectId('id'), getCollectorListings);

/**
 * @route   GET /api/collectibles/:id
 * @desc    Get single collectible by ID
 * @access  Public
 */
router.get('/:id', validateObjectId('id'), getCollectibleById);

/**
 * @route   PUT /api/collectibles/:id
 * @desc    Update a collectible listing
 * @access  Private (Owner or Admin only)
 */
router.put(
  '/:id',
  authenticate,
  validateObjectId('id'),
  validateBody(schemas.updateCollectible),
  updateCollectible
);

/**
 * @route   PATCH /api/collectibles/:id
 * @desc    Partially update a collectible listing
 * @access  Private (Owner or Admin only)
 */
router.patch(
  '/:id',
  authenticate,
  validateObjectId('id'),
  updateCollectible
);

/**
 * @route   DELETE /api/collectibles/:id
 * @desc    Delete a collectible listing
 * @access  Private (Owner or Admin only)
 */
router.delete(
  '/:id',
  authenticate,
  validateObjectId('id'),
  deleteCollectible
);

/**
 * @route   PUT /api/collectibles/:id/like
 * @desc    Like/favorite a collectible
 * @access  Public
 */
router.put('/:id/like', validateObjectId('id'), likeCollectible);

export default router;
