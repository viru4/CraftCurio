import Collectible from '../models/Collectible.js';
import { updateAuctionStatus, checkExpiredAuctions } from '../services/auctionService.js';

/**
 * Auction Socket Handler - Manages real-time auction features
 * Handles bid updates, countdown timers, and auction status notifications
 */

/**
 * Initialize Socket.io for auction features
 * @param {Object} io - Socket.io server instance
 */
export const initializeAuctionSockets = (io) => {
  // Make io globally accessible for controllers
  global.io = io;

  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    /**
     * Join an auction room to receive real-time updates
     * Client emits: { collectibleId: String }
     */
    socket.on('joinAuction', async (data) => {
      try {
        const { collectibleId } = data;
        
        if (!collectibleId) {
          socket.emit('error', { message: 'Collectible ID is required' });
          return;
        }

        // Join the auction-specific room
        socket.join(`auction-${collectibleId}`);
        console.log(`Socket ${socket.id} joined auction room: auction-${collectibleId}`);

        // Send current auction data to the client
        const collectible = await Collectible.findById(collectibleId)
          .populate('owner', 'name profilePhotoUrl')
          .lean();

        if (!collectible) {
          socket.emit('error', { message: 'Auction not found' });
          return;
        }

        if (collectible.saleType !== 'auction') {
          socket.emit('error', { message: 'Not an auction item' });
          return;
        }

        // Update status if needed
        await updateAuctionStatus(collectibleId);
        
        // Re-fetch after potential update
        const updatedCollectible = await Collectible.findById(collectibleId).lean();

        socket.emit('auctionData', {
          collectibleId: updatedCollectible._id,
          title: updatedCollectible.title,
          currentBid: updatedCollectible.auction.currentBid,
          totalBids: updatedCollectible.auction.totalBids,
          endTime: updatedCollectible.auction.endTime,
          auctionStatus: updatedCollectible.auction.auctionStatus,
          bidHistory: updatedCollectible.auction.bidHistory.slice(-10), // Last 10 bids
          timeRemaining: Math.max(0, new Date(updatedCollectible.auction.endTime) - new Date())
        });
      } catch (error) {
        console.error('Error joining auction:', error);
        socket.emit('error', { message: 'Failed to join auction', error: error.message });
      }
    });

    /**
     * Leave an auction room
     * Client emits: { collectibleId: String }
     */
    socket.on('leaveAuction', (data) => {
      const { collectibleId } = data;
      if (collectibleId) {
        socket.leave(`auction-${collectibleId}`);
        console.log(`Socket ${socket.id} left auction room: auction-${collectibleId}`);
      }
    });

    /**
     * Request current auction status
     * Client emits: { collectibleId: String }
     */
    socket.on('getAuctionStatus', async (data) => {
      try {
        const { collectibleId } = data;
        
        const collectible = await Collectible.findById(collectibleId).lean();
        
        if (!collectible || collectible.saleType !== 'auction') {
          socket.emit('error', { message: 'Invalid auction' });
          return;
        }

        const now = new Date();
        const timeRemaining = Math.max(0, new Date(collectible.auction.endTime) - now);

        socket.emit('auctionStatus', {
          collectibleId: collectible._id,
          auctionStatus: collectible.auction.auctionStatus,
          currentBid: collectible.auction.currentBid,
          totalBids: collectible.auction.totalBids,
          timeRemaining,
          isActive: collectible.auction.auctionStatus === 'live' && timeRemaining > 0
        });
      } catch (error) {
        console.error('Error getting auction status:', error);
        socket.emit('error', { message: 'Failed to get auction status' });
      }
    });

    /**
     * Watch multiple auctions at once
     * Client emits: { collectibleIds: String[] }
     */
    socket.on('watchAuctions', async (data) => {
      try {
        const { collectibleIds } = data;
        
        if (!Array.isArray(collectibleIds)) {
          socket.emit('error', { message: 'collectibleIds must be an array' });
          return;
        }

        // Join all auction rooms
        collectibleIds.forEach(id => {
          socket.join(`auction-${id}`);
        });

        console.log(`Socket ${socket.id} watching ${collectibleIds.length} auctions`);

        // Send current status for all auctions
        const auctions = await Collectible.find({
          _id: { $in: collectibleIds },
          saleType: 'auction'
        }).lean();

        const auctionStatuses = auctions.map(auction => ({
          collectibleId: auction._id,
          currentBid: auction.auction.currentBid,
          totalBids: auction.auction.totalBids,
          auctionStatus: auction.auction.auctionStatus,
          timeRemaining: Math.max(0, new Date(auction.auction.endTime) - new Date())
        }));

        socket.emit('auctionStatuses', auctionStatuses);
      } catch (error) {
        console.error('Error watching auctions:', error);
        socket.emit('error', { message: 'Failed to watch auctions' });
      }
    });

    /**
     * Client disconnects
     */
    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  /**
   * Broadcast countdown updates for all live auctions
   * Runs every 10 seconds
   */
  setInterval(async () => {
    try {
      const liveAuctions = await Collectible.find({
        saleType: 'auction',
        'auction.auctionStatus': 'live',
        'auction.endTime': { $gt: new Date() }
      }).select('_id auction.endTime auction.currentBid').lean();

      liveAuctions.forEach(auction => {
        const timeRemaining = Math.max(0, new Date(auction.auction.endTime) - new Date());
        
        // Broadcast countdown update to auction room
        io.to(`auction-${auction._id}`).emit('countdownUpdate', {
          collectibleId: auction._id,
          timeRemaining,
          currentBid: auction.auction.currentBid
        });

        // Alert when auction is ending soon (less than 5 minutes)
        if (timeRemaining < 5 * 60 * 1000 && timeRemaining > 4 * 60 * 1000) {
          io.to(`auction-${auction._id}`).emit('auctionEndingSoon', {
            collectibleId: auction._id,
            timeRemaining,
            message: 'Auction ending in less than 5 minutes!'
          });
        }
      });
    } catch (error) {
      console.error('Error broadcasting countdown:', error);
    }
  }, 10000); // Every 10 seconds

  /**
   * Check for expired auctions and finalize them
   * Runs every minute
   */
  setInterval(async () => {
    try {
      console.log('Checking for expired auctions...');
      const finalized = await checkExpiredAuctions();
      
      if (finalized > 0) {
        console.log(`Finalized ${finalized} expired auctions`);
      }
    } catch (error) {
      console.error('Error checking expired auctions:', error);
    }
  }, 60000); // Every minute

  console.log('✅ Auction Socket.io handlers initialized');
  console.log('   - Real-time bid updates enabled');
  console.log('   - Countdown timers active');
  console.log('   - Auction status monitoring running');
};

/**
 * Emit a new bid event to all clients in an auction room
 * Called from auction controller when a bid is placed
 * @param {String} collectibleId - The auction collectible ID
 * @param {Object} bidData - The bid data to broadcast
 */
export const emitNewBid = (collectibleId, bidData) => {
  if (global.io) {
    global.io.to(`auction-${collectibleId}`).emit('newBid', bidData);
  }
};

/**
 * Emit auction ended event
 * @param {String} collectibleId - The auction collectible ID
 * @param {Object} endData - The auction end data
 */
export const emitAuctionEnded = (collectibleId, endData) => {
  if (global.io) {
    global.io.to(`auction-${collectibleId}`).emit('auctionEnded', endData);
  }
};

/**
 * Emit auction cancelled event
 * @param {String} collectibleId - The auction collectible ID
 * @param {String} reason - Cancellation reason
 */
export const emitAuctionCancelled = (collectibleId, reason) => {
  if (global.io) {
    global.io.to(`auction-${collectibleId}`).emit('auctionCancelled', {
      collectibleId,
      message: reason || 'This auction has been cancelled'
    });
  }
};

/**
 * Emit auction status change
 * @param {String} collectibleId - The auction collectible ID
 * @param {String} newStatus - The new auction status
 */
export const emitAuctionStatusChange = (collectibleId, newStatus) => {
  if (global.io) {
    global.io.to(`auction-${collectibleId}`).emit('auctionStatusChanged', {
      collectibleId,
      newStatus
    });
  }
};

export default {
  initializeAuctionSockets,
  emitNewBid,
  emitAuctionEnded,
  emitAuctionCancelled,
  emitAuctionStatusChange
};
