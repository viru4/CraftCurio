import Collectible from '../models/Collectible.js';
import Collector from '../models/Collector.js';
import { sendEmail } from './emailService.js';

/**
 * Auction Service - Handles all auction-related business logic
 * Includes bid validation, winner calculation, and notifications
 */

/**
 * Validate if a bid is allowed for the given auction
 * @param {Object} collectible - The collectible with auction details
 * @param {String} bidderId - The ID of the bidder
 * @param {Number} bidAmount - The proposed bid amount
 * @returns {Object} - { valid: boolean, error: string }
 */
export const validateBid = (collectible, bidderId, bidAmount) => {
  // Check if item is auction type
  if (collectible.saleType !== 'auction') {
    return { valid: false, error: 'This item is not available for auction' };
  }

  // Check auction status
  if (collectible.auction.auctionStatus !== 'live') {
    return { valid: false, error: 'This auction is not currently active' };
  }

  // Check if auction has started
  const now = new Date();
  if (now < collectible.auction.startTime) {
    return { valid: false, error: 'Auction has not started yet' };
  }

  // Check if auction has ended
  if (now > collectible.auction.endTime) {
    return { valid: false, error: 'Auction has already ended' };
  }

  // Check if bidder is the owner
  if (collectible.owner && collectible.owner.toString() === bidderId) {
    return { valid: false, error: 'You cannot bid on your own auction' };
  }

  // Validate minimum bid amount
  const minimumBid = collectible.auction.currentBid + collectible.auction.minimumBidIncrement;
  if (bidAmount < minimumBid) {
    return { 
      valid: false, 
      error: `Bid must be at least $${minimumBid.toFixed(2)}` 
    };
  }

  // Check if bidder is already the highest bidder
  if (collectible.auction.bidHistory.length > 0) {
    const lastBid = collectible.auction.bidHistory[collectible.auction.bidHistory.length - 1];
    if (lastBid.bidder.toString() === bidderId) {
      return { valid: false, error: 'You are already the highest bidder' };
    }
  }

  return { valid: true };
};

/**
 * Calculate the winner of an auction
 * @param {Object} collectible - The collectible with auction details
 * @returns {Object} - { winner: ObjectId, winningBid: Number, meetsReserve: Boolean }
 */
export const calculateAuctionWinner = (collectible) => {
  if (!collectible.auction.bidHistory || collectible.auction.bidHistory.length === 0) {
    return { winner: null, winningBid: 0, meetsReserve: false };
  }

  // Get the highest bid (last bid in history since bids are ascending)
  const highestBid = collectible.auction.bidHistory[collectible.auction.bidHistory.length - 1];
  const meetsReserve = !collectible.auction.reservePrice || 
                        highestBid.amount >= collectible.auction.reservePrice;

  return {
    winner: meetsReserve ? highestBid.bidder : null,
    winningBid: highestBid.amount,
    meetsReserve
  };
};

/**
 * Finalize an auction and determine the winner
 * @param {String} collectibleId - The ID of the collectible
 * @returns {Object} - Updated collectible with winner information
 */
export const finalizeAuction = async (collectibleId) => {
  const collectible = await Collectible.findById(collectibleId)
    .populate('owner', 'name email')
    .populate('auction.bidHistory.bidder', 'name email');

  if (!collectible || collectible.saleType !== 'auction') {
    throw new Error('Invalid collectible for auction finalization');
  }

  const { winner, winningBid, meetsReserve } = calculateAuctionWinner(collectible);

  // Update auction status
  if (winner && meetsReserve) {
    collectible.auction.winner = winner;
    collectible.auction.winningBid = winningBid;
    collectible.auction.auctionStatus = 'sold';
    collectible.status = 'sold';

    // Update collector's won auctions
    await Collector.findByIdAndUpdate(winner, {
      $push: {
        wonAuctions: {
          collectibleId: collectible._id,
          winningBid,
          wonAt: new Date()
        }
      }
    });
  } else {
    collectible.auction.auctionStatus = 'ended';
    // Reserve not met or no bids
  }

  await collectible.save();

  // Send notifications
  await sendAuctionEndNotifications(collectible, winner, winningBid, meetsReserve);

  return collectible;
};

/**
 * Send notifications when auction ends
 * @param {Object} collectible - The collectible with populated owner and bidders
 * @param {ObjectId} winner - The winning bidder ID
 * @param {Number} winningBid - The winning bid amount
 * @param {Boolean} meetsReserve - Whether reserve price was met
 */
const sendAuctionEndNotifications = async (collectible, winner, winningBid, meetsReserve) => {
  try {
    const ownerEmail = collectible.owner?.email;
    const ownerName = collectible.owner?.name || 'Seller';

    if (winner && meetsReserve) {
      // Notify winner
      const winnerBid = collectible.auction.bidHistory.find(
        bid => bid.bidder.toString() === winner.toString()
      );
      
      if (winnerBid && winnerBid.bidderEmail) {
        await sendEmail({
          to: winnerBid.bidderEmail,
          subject: 'Congratulations! You won the auction',
          html: `
            <h2>Auction Won!</h2>
            <p>Congratulations! You have won the auction for "${collectible.title}".</p>
            <p><strong>Winning Bid:</strong> $${winningBid.toFixed(2)}</p>
            <p>Please proceed with payment to complete your purchase.</p>
          `
        });
      }

      // Notify seller
      if (ownerEmail) {
        await sendEmail({
          to: ownerEmail,
          subject: 'Your auction has ended with a winner',
          html: `
            <h2>Auction Ended Successfully</h2>
            <p>Your auction for "${collectible.title}" has ended with a winning bid.</p>
            <p><strong>Final Bid:</strong> $${winningBid.toFixed(2)}</p>
            <p>The buyer will contact you to arrange payment and delivery.</p>
          `
        });
      }

      // Notify losing bidders
      const losingBidders = collectible.auction.bidHistory
        .filter(bid => bid.bidder.toString() !== winner.toString())
        .filter((bid, index, self) => 
          index === self.findIndex(b => b.bidder.toString() === bid.bidder.toString())
        );

      for (const bid of losingBidders) {
        if (bid.bidderEmail) {
          await sendEmail({
            to: bid.bidderEmail,
            subject: 'Auction ended - You were outbid',
            html: `
              <h2>Auction Ended</h2>
              <p>The auction for "${collectible.title}" has ended.</p>
              <p>Unfortunately, you were outbid. The winning bid was $${winningBid.toFixed(2)}.</p>
              <p>Thank you for participating!</p>
            `
          });
        }
      }
    } else {
      // Reserve not met or no bids - notify seller
      if (ownerEmail) {
        const reason = !meetsReserve ? 'reserve price was not met' : 'there were no bids';
        await sendEmail({
          to: ownerEmail,
          subject: 'Your auction has ended without a sale',
          html: `
            <h2>Auction Ended</h2>
            <p>Your auction for "${collectible.title}" has ended without a sale.</p>
            <p>Reason: ${reason}</p>
            ${winningBid > 0 ? `<p>Highest bid: $${winningBid.toFixed(2)}</p>` : ''}
            <p>You can relist the item or adjust the reserve price.</p>
          `
        });
      }
    }
  } catch (error) {
    console.error('Error sending auction end notifications:', error);
    // Don't throw error - notification failure shouldn't break auction finalization
  }
};

/**
 * Check and finalize expired auctions
 * Should be called periodically (e.g., via cron job)
 */
export const checkExpiredAuctions = async () => {
  try {
    const now = new Date();
    const expiredAuctions = await Collectible.find({
      saleType: 'auction',
      'auction.auctionStatus': 'live',
      'auction.endTime': { $lte: now }
    });

    console.log(`Found ${expiredAuctions.length} expired auctions to finalize`);

    for (const auction of expiredAuctions) {
      try {
        await finalizeAuction(auction._id);
        console.log(`Finalized auction: ${auction.title}`);
      } catch (error) {
        console.error(`Error finalizing auction ${auction._id}:`, error);
      }
    }

    return expiredAuctions.length;
  } catch (error) {
    console.error('Error checking expired auctions:', error);
    throw error;
  }
};

/**
 * Update auction status based on time
 * Scheduled auctions become live, live auctions check for expiry
 */
export const updateAuctionStatus = async (collectibleId) => {
  const collectible = await Collectible.findById(collectibleId);
  if (!collectible || collectible.saleType !== 'auction') {
    return null;
  }

  const now = new Date();
  const { startTime, endTime, auctionStatus } = collectible.auction;

  // Update status based on time
  if (auctionStatus === 'scheduled' && now >= startTime && now < endTime) {
    collectible.auction.auctionStatus = 'live';
    collectible.status = 'active';
    await collectible.save();
  } else if (auctionStatus === 'live' && now >= endTime) {
    // Auction expired - finalize it
    await finalizeAuction(collectibleId);
  }

  return collectible;
};

/**
 * Get auction statistics
 * @param {String} collectibleId - The ID of the collectible
 * @returns {Object} - Statistics about the auction
 */
export const getAuctionStats = (collectible) => {
  if (!collectible || collectible.saleType !== 'auction') {
    return null;
  }

  const bidHistory = collectible.auction.bidHistory || [];
  const uniqueBidders = new Set(bidHistory.map(bid => bid.bidder.toString())).size;

  return {
    totalBids: bidHistory.length,
    uniqueBidders,
    currentBid: collectible.auction.currentBid,
    startingBid: collectible.price,
    reservePrice: collectible.auction.reservePrice,
    reserveMet: !collectible.auction.reservePrice || 
                collectible.auction.currentBid >= collectible.auction.reservePrice,
    timeRemaining: Math.max(0, collectible.auction.endTime - new Date()),
    isActive: collectible.isAuctionActive
  };
};

export default {
  validateBid,
  calculateAuctionWinner,
  finalizeAuction,
  checkExpiredAuctions,
  updateAuctionStatus,
  getAuctionStats
};
