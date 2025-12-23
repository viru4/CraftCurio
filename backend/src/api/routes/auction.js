import express from 'express';
import {
  placeBid,
  buyNow,
  getLiveAuctions,
  getAuctionDetails,
  cancelAuction,
  manuallyFinalizeAuction,
  relistAuction
} from '../controllers/auctionController.js';
import { authenticate, optionalAuth } from '../../middleware/authMiddleware.js';
import { validateBody, validateObjectId, schemas } from '../../middleware/validation.js';

/**
 * Auction Routes - Handles all auction-specific endpoints
 * Includes bidding, buy-now, and auction management
 */

const router = express.Router();

/**
 * @route   GET /api/auction/live
 * @desc    Get all live auctions with filtering and sorting
 * @access  Public
 * @query   page, limit, category, sortBy (endingSoon|mostBids|highestBid|newest)
 */
router.get('/live', getLiveAuctions);

/**
 * @route   GET /api/auction/:id
 * @desc    Get detailed auction information including bid history and stats
 * @access  Public
 */
router.get('/:id', validateObjectId('id'), getAuctionDetails);

/**
 * @route   POST /api/auction/:id/bid
 * @desc    Place a bid on an auction item
 * @access  Private (Authenticated collectors only)
 * @body    { bidAmount: Number, bidderId: String, bidderName: String, bidderEmail: String }
 */
router.post(
  '/:id/bid',
  authenticate,
  validateObjectId('id'),
  validateBody(schemas.placeBid),
  placeBid
);

/**
 * @route   POST /api/auction/:id/buy-now
 * @desc    Purchase auction item instantly using buy-now price
 * @access  Private (Authenticated collectors only)
 * @body    { buyerId: String, buyerName: String, buyerEmail: String }
 */
router.post(
  '/:id/buy-now',
  authenticate,
  validateObjectId('id'),
  validateBody(schemas.buyNow),
  buyNow
);

/**
 * @route   POST /api/auction/:id/cancel
 * @desc    Cancel an auction (only if no bids placed)
 * @access  Private (Owner or Admin only)
 */
router.post(
  '/:id/cancel',
  authenticate,
  validateObjectId('id'),
  cancelAuction
);

/**
 * @route   POST /api/auction/:id/finalize
 * @desc    Manually finalize an expired auction
 * @access  Private (Admin only)
 */
router.post(
  '/:id/finalize',
  authenticate,
  validateObjectId('id'),
  manuallyFinalizeAuction
);

/**
 * @route   POST /api/auction/:id/relist
 * @desc    Relist an ended/unsold auction with new dates and optional updated pricing
 * @access  Private (Owner only)
 * @body    { startTime: Date, endTime: Date, startingBid?: Number, reservePrice?: Number, minimumBidIncrement?: Number }
 */
router.post(
  '/:id/relist',
  authenticate,
  validateObjectId('id'),
  relistAuction
);

export default router;
