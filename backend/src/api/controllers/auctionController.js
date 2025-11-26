import mongoose from 'mongoose';
import Collectible from '../../models/Collectible.js';
import Collector from '../../models/Collector.js';
import { 
  validateBid, 
  finalizeAuction, 
  getAuctionStats,
  updateAuctionStatus 
} from '../../services/auctionService.js';

/**
 * Auction Controller - Handles all auction-related endpoints
 * Manages bid placement, buy-now purchases, and auction lifecycle
 */

/**
 * Place a bid on an auction item
 * POST /api/auction/:id/bid
 * @route POST /api/auction/:id/bid
 * @access Private - Authenticated collectors only
 */
export const placeBid = async (req, res) => {
  try {
    const { id } = req.params;
    const { bidAmount, bidderId, bidderName, bidderEmail } = req.validatedBody || req.body;

    // Find the collectible
    let collectible = await Collectible.findById(id);
    if (!collectible) {
      collectible = await Collectible.findOne({ id });
    }

    if (!collectible) {
      return res.status(404).json({ error: 'Collectible not found' });
    }

    // Update auction status if needed (scheduled -> live)
    await updateAuctionStatus(collectible._id);
    
    // Refresh collectible after potential status update
    collectible = await Collectible.findById(collectible._id);

    // Validate the bid
    const validation = validateBid(collectible, bidderId, bidAmount);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    // Create bid entry
    const newBid = {
      bidder: bidderId,
      amount: bidAmount,
      timestamp: new Date(),
      bidderName,
      bidderEmail
    };

    // Add bid to history
    collectible.auction.bidHistory.push(newBid);
    collectible.auction.currentBid = bidAmount;
    collectible.auction.totalBids = collectible.auction.bidHistory.length;

    // Update unique bidders count
    const uniqueBidders = new Set(
      collectible.auction.bidHistory.map(bid => bid.bidder.toString())
    );
    collectible.auction.uniqueBidders = uniqueBidders.size;

    await collectible.save();

    // Update collector's active bids
    await Collector.findByIdAndUpdate(
      bidderId,
      {
        $pull: { activeBids: { collectibleId: collectible._id } }, // Remove old bid
      }
    );
    
    await Collector.findByIdAndUpdate(
      bidderId,
      {
        $push: {
          activeBids: {
            collectibleId: collectible._id,
            currentBid: bidAmount,
            lastBidTime: new Date()
          }
        }
      }
    );

    // Emit socket event for real-time update (handled in socket handler)
    if (global.io) {
      global.io.to(`auction-${collectible._id}`).emit('newBid', {
        collectibleId: collectible._id,
        bidAmount,
        bidderName,
        timestamp: newBid.timestamp,
        totalBids: collectible.auction.totalBids,
        currentBid: collectible.auction.currentBid
      });
    }

    res.status(200).json({
      message: 'Bid placed successfully',
      data: {
        collectibleId: collectible._id,
        currentBid: collectible.auction.currentBid,
        totalBids: collectible.auction.totalBids,
        bidHistory: collectible.auction.bidHistory.slice(-5) // Last 5 bids
      }
    });
  } catch (error) {
    console.error('Error placing bid:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Execute buy-now purchase (for auctions with buy-now option)
 * POST /api/auction/:id/buy-now
 * @route POST /api/auction/:id/buy-now
 * @access Private - Authenticated collectors only
 */
export const buyNow = async (req, res) => {
  try {
    const { id } = req.params;
    const bodyData = req.validatedBody || req.body;
    const { buyerId, buyerName, buyerEmail } = bodyData;

    console.log('Buy-now request received:', { buyerId, buyerName, buyerEmail, bodyData });

    // Validate required fields
    if (!buyerId || !buyerName || !buyerEmail) {
      console.error('Missing fields in buy-now request:', { buyerId, buyerName, buyerEmail });
      return res.status(400).json({ 
        error: 'Missing required fields: buyerId, buyerName, and buyerEmail are required',
        received: { buyerId: !!buyerId, buyerName: !!buyerName, buyerEmail: !!buyerEmail }
      });
    }

    // Find the collectible
    let collectible = await Collectible.findById(id);
    if (!collectible) {
      collectible = await Collectible.findOne({ id });
    }

    if (!collectible) {
      return res.status(404).json({ error: 'Collectible not found' });
    }

    // Check if item is available for purchase
    if (collectible.saleType === 'direct') {
      // Direct sale purchase
      if (collectible.status !== 'active') {
        return res.status(400).json({ error: 'Item is not available for purchase' });
      }

      collectible.status = 'sold';
      collectible.owner = buyerId;
      
    } else if (collectible.saleType === 'auction') {
      // Auction buy-now purchase
      if (collectible.auction.auctionStatus !== 'live') {
        return res.status(400).json({ error: 'Auction is not currently active' });
      }

      if (!collectible.auction.buyNowPrice) {
        return res.status(400).json({ error: 'Buy now option is not available for this auction' });
      }

      // Check if buyer is the owner
      if (collectible.owner && collectible.owner.toString() === buyerId) {
        return res.status(400).json({ error: 'You cannot buy your own item' });
      }

      // Record the buy-now purchase
      collectible.auction.winner = buyerId;
      collectible.auction.winningBid = collectible.auction.buyNowPrice;
      collectible.auction.auctionStatus = 'sold';
      collectible.status = 'sold';

      // Add to bid history for record keeping
      collectible.auction.bidHistory.push({
        bidder: buyerId,
        amount: collectible.auction.buyNowPrice,
        timestamp: new Date(),
        bidderName,
        bidderEmail
      });

      // Update collector's won auctions
      await Collector.findByIdAndUpdate(buyerId, {
        $push: {
          wonAuctions: {
            collectibleId: collectible._id,
            winningBid: collectible.auction.buyNowPrice,
            wonAt: new Date()
          }
        }
      });

      // Emit socket event
      if (global.io) {
        global.io.to(`auction-${collectible._id}`).emit('auctionEnded', {
          collectibleId: collectible._id,
          status: 'sold',
          winner: buyerName,
          finalPrice: collectible.auction.buyNowPrice,
          endReason: 'buy-now'
        });
      }
    }

    await collectible.save();

    res.status(200).json({
      message: 'Purchase completed successfully',
      data: {
        collectibleId: collectible._id,
        purchasePrice: collectible.saleType === 'auction' 
          ? collectible.auction.buyNowPrice 
          : collectible.price,
        saleType: collectible.saleType,
        status: collectible.status
      }
    });
  } catch (error) {
    console.error('Error processing buy-now:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get all live auctions
 * GET /api/auction/live
 * @route GET /api/auction/live
 * @access Public
 */
export const getLiveAuctions = async (req, res) => {
  try {
    const { page = 1, limit = 20, category, sortBy = 'endingSoon' } = req.query;
    
    const pageNum = parseInt(page, 10);
    const limitNum = Math.min(parseInt(limit, 10), 100);
    const skip = (pageNum - 1) * limitNum;

    const now = new Date();

    // Build query - include both 'live' and 'scheduled' auctions that should be live
    const query = {
      saleType: 'auction',
      $or: [
        { 'auction.auctionStatus': 'live' },
        { 
          'auction.auctionStatus': 'scheduled',
          'auction.startTime': { $lte: now }
        }
      ],
      'auction.endTime': { $gt: now }
    };

    if (category) {
      query.category = category;
    }

    // Determine sort order
    let sort = {};
    switch (sortBy) {
      case 'endingSoon':
        sort = { 'auction.endTime': 1 }; // Earliest ending first
        break;
      case 'mostBids':
        sort = { 'auction.totalBids': -1 };
        break;
      case 'highestBid':
        sort = { 'auction.currentBid': -1 };
        break;
      case 'newest':
        sort = { createdAt: -1 };
        break;
      default:
        sort = { 'auction.endTime': 1 };
    }

    const auctions = await Collectible.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .populate('owner', 'name profilePhotoUrl')
      .lean();

    // Update auction statuses for scheduled auctions that should be live
    for (const auction of auctions) {
      if (auction.auction.auctionStatus === 'scheduled' && new Date(auction.auction.startTime) <= now) {
        await updateAuctionStatus(auction._id);
      }
    }

    // Refetch to get updated statuses
    const updatedAuctions = await Collectible.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .populate('owner', 'name profilePhotoUrl')
      .lean();

    const total = await Collectible.countDocuments(query);

    // Add auction stats to each item
    const auctionsWithStats = updatedAuctions.map(auction => ({
      ...auction,
      stats: getAuctionStats(auction)
    }));

    res.status(200).json({
      message: 'Live auctions retrieved successfully',
      data: auctionsWithStats,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
        hasNextPage: pageNum < Math.ceil(total / limitNum),
        hasPrevPage: pageNum > 1
      }
    });
  } catch (error) {
    console.error('Error fetching live auctions:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get auction details with stats
 * GET /api/auction/:id
 * @route GET /api/auction/:id
 * @access Public
 */
export const getAuctionDetails = async (req, res) => {
  try {
    const { id } = req.params;

    let collectible = await Collectible.findById(id)
      .populate('owner', 'name profilePhotoUrl location')
      .lean();
      
    if (!collectible) {
      collectible = await Collectible.findOne({ id })
        .populate('owner', 'name profilePhotoUrl location')
        .lean();
    }

    if (!collectible) {
      return res.status(404).json({ error: 'Collectible not found' });
    }

    if (collectible.saleType !== 'auction') {
      return res.status(400).json({ error: 'This item is not an auction' });
    }

    // Update status if needed
    await updateAuctionStatus(collectible._id);
    
    // Refresh after potential update with safe populate
    collectible = await Collectible.findById(collectible._id)
      .populate('owner', 'name profilePhotoUrl location')
      .lean();

    // Manually populate bidHistory bidders to handle null references
    if (collectible.auction?.bidHistory && collectible.auction.bidHistory.length > 0) {
      const bidderIds = collectible.auction.bidHistory
        .map(bid => bid.bidder)
        .filter(id => id); // Filter out null/undefined
      
      if (bidderIds.length > 0) {
        const bidders = await Collector.find({ _id: { $in: bidderIds } })
          .select('name profilePhotoUrl')
          .lean();
        
        const bidderMap = new Map(bidders.map(b => [b._id.toString(), b]));
        
        collectible.auction.bidHistory = collectible.auction.bidHistory.map(bid => ({
          ...bid,
          bidder: bid.bidder ? bidderMap.get(bid.bidder.toString()) || bid.bidder : null
        }));
      }
    }

    const stats = getAuctionStats(collectible);

    res.status(200).json({
      message: 'Auction details retrieved successfully',
      data: {
        ...collectible,
        stats
      }
    });
  } catch (error) {
    console.error('Error fetching auction details:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Cancel an auction (owner only)
 * POST /api/auction/:id/cancel
 * @route POST /api/auction/:id/cancel
 * @access Private - Owner only
 */
export const cancelAuction = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id || req.user?.id;

    let collectible = await Collectible.findById(id);
    if (!collectible) {
      collectible = await Collectible.findOne({ id });
    }

    if (!collectible) {
      return res.status(404).json({ error: 'Collectible not found' });
    }

    // Check ownership
    if (collectible.owner.toString() !== userId.toString() && req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'You do not have permission to cancel this auction' });
    }

    // Check if auction can be cancelled
    if (collectible.auction.auctionStatus === 'sold') {
      return res.status(400).json({ error: 'Cannot cancel a completed auction' });
    }

    if (collectible.auction.bidHistory.length > 0) {
      return res.status(400).json({ 
        error: 'Cannot cancel auction with existing bids. Contact support for assistance.' 
      });
    }

    collectible.auction.auctionStatus = 'cancelled';
    collectible.status = 'inactive';
    await collectible.save();

    // Emit socket event
    if (global.io) {
      global.io.to(`auction-${collectible._id}`).emit('auctionCancelled', {
        collectibleId: collectible._id,
        message: 'This auction has been cancelled by the seller'
      });
    }

    res.status(200).json({
      message: 'Auction cancelled successfully',
      data: collectible
    });
  } catch (error) {
    console.error('Error cancelling auction:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Manually finalize an auction (admin only, or automatic via cron)
 * POST /api/auction/:id/finalize
 * @route POST /api/auction/:id/finalize
 * @access Private - Admin only
 */
export const manuallyFinalizeAuction = async (req, res) => {
  try {
    const { id } = req.params;

    const collectible = await finalizeAuction(id);

    res.status(200).json({
      message: 'Auction finalized successfully',
      data: collectible
    });
  } catch (error) {
    console.error('Error finalizing auction:', error);
    res.status(500).json({ error: error.message });
  }
};

export default {
  placeBid,
  buyNow,
  getLiveAuctions,
  getAuctionDetails,
  cancelAuction,
  manuallyFinalizeAuction
};
