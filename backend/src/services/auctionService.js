import Collectible from '../models/Collectible.js';
import Collector from '../models/Collector.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import { sendEmail } from './emailService.js';
import { createNotification, createBulkNotifications } from './notificationService.js';

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
  // Raw minimum = current bid + configured increment
  const rawMinimumBid = collectible.auction.currentBid + collectible.auction.minimumBidIncrement;
  // Round up to next whole currency unit so we don't show long decimals
  const minimumBid = Math.ceil(rawMinimumBid);

  if (bidAmount < minimumBid) {
    return { 
      valid: false, 
      // Use a rounded, human‑friendly amount in the error
      error: `Bid must be at least ₹${minimumBid}` 
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

    // Create order for the auction winner
    try {
      const winnerBid = collectible.auction.bidHistory.find(
        bid => bid.bidder.toString() === winner.toString()
      );

      // Fetch winner's saved addresses
      const winnerUser = await User.findById(winner).select('savedAddresses');
      let shippingAddress = {
        fullName: winnerBid?.bidderName || '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
      };

      // Use default address or first saved address if available
      if (winnerUser && winnerUser.savedAddresses && winnerUser.savedAddresses.length > 0) {
        const defaultAddress = winnerUser.savedAddresses.find(addr => addr.isDefault);
        const addressToUse = defaultAddress || winnerUser.savedAddresses[0];
        
        shippingAddress = {
          fullName: addressToUse.fullName,
          address: addressToUse.address,
          city: addressToUse.city,
          state: addressToUse.state,
          zipCode: addressToUse.zipCode,
          country: addressToUse.country
        };
        
        console.log(`📦 Using ${defaultAddress ? 'default' : 'first saved'} address for order`);
      } else {
        console.log('ℹ️ No saved addresses found for winner, order created with empty address');
      }

      const order = new Order({
        user: winner,
        items: [{
          productId: collectible._id.toString(),
          productType: 'collectible',
          name: collectible.title,
          price: winningBid,
          quantity: 1,
          image: collectible.image,
          artisan: collectible.owner?.name || 'Unknown',
          category: collectible.category
        }],
        shippingAddress,
        subtotal: winningBid,
        shipping: 0,
        tax: 0,
        total: winningBid,
        paymentMethod: 'pending',
        paymentStatus: 'pending',
        orderStatus: 'pending',
        notes: `Auction win - Payment deadline: ${new Date(Date.now() + 48 * 60 * 60 * 1000).toLocaleString()}`
      });

      await order.save();
      
      // Link order to collectible
      collectible.orderId = order._id;
      
      console.log(`✅ Order ${order.orderNumber} created for auction winner (User: ${winner})`);
      console.log(`   Order ID: ${order._id}`);
      console.log(`   Order Number: ${order.orderNumber}`);
      console.log(`   Total: ₹${winningBid}`);
    } catch (orderError) {
      console.error('❌ Error creating order for auction:', orderError.message);
      console.error('   Full error:', orderError);
      // Don't fail the auction finalization if order creation fails
    }
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
    const notifications = [];

    if (winner && meetsReserve) {
      // Notify winner
      const winnerBid = collectible.auction.bidHistory.find(
        bid => bid.bidder.toString() === winner.toString()
      );
      
      if (winnerBid && winnerBid.bidderEmail) {
        // Email notification
        await sendEmail({
          to: winnerBid.bidderEmail,
          subject: 'Congratulations! You won the auction',
          html: `
            <h2>Auction Won!</h2>
            <p>Congratulations! You have won the auction for "${collectible.title}".</p>
            <p><strong>Winning Bid:</strong> $${winningBid.toFixed(2)}</p>
            <p>Please proceed with payment within 48 hours to complete your purchase.</p>
            <p><a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/collector-dashboard">View Order</a></p>
          `
        });

        // In-app notification for winner
        notifications.push({
          userId: winner,
          type: 'auction',
          title: '🎉 Auction Won!',
          message: `Congratulations! You won the auction for "${collectible.title}" with a bid of $${winningBid.toFixed(2)}. Please complete payment within 48 hours.`,
          relatedId: collectible._id
        });
      }

      // Notify seller
      if (ownerEmail && collectible.owner) {
        // Email notification
        await sendEmail({
          to: ownerEmail,
          subject: 'Your auction has ended with a winner',
          html: `
            <h2>Auction Ended Successfully</h2>
            <p>Your auction for "${collectible.title}" has ended with a winning bid.</p>
            <p><strong>Final Bid:</strong> $${winningBid.toFixed(2)}</p>
            <p><strong>Winner:</strong> ${winnerBid?.bidderName || 'Anonymous'}</p>
            <p>The buyer will proceed with payment. You'll be notified once payment is completed.</p>
          `
        });

        // In-app notification for seller
        notifications.push({
          userId: collectible.owner._id,
          type: 'auction',
          title: '✅ Auction Sold!',
          message: `Your auction for "${collectible.title}" ended successfully with a final bid of $${winningBid.toFixed(2)}.`,
          relatedId: collectible._id
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
          // Email notification
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

          // In-app notification for losing bidders
          notifications.push({
            userId: bid.bidder,
            type: 'auction',
            title: 'Auction Ended',
            message: `The auction for "${collectible.title}" has ended. You were outbid with a final price of $${winningBid.toFixed(2)}.`,
            relatedId: collectible._id
          });
        }
      }
    } else {
      // Reserve not met or no bids - notify seller
      if (ownerEmail && collectible.owner) {
        const reason = !meetsReserve ? 'reserve price was not met' : 'there were no bids';
        
        // Email notification
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

        // In-app notification
        notifications.push({
          userId: collectible.owner._id,
          type: 'auction',
          title: 'Auction Ended - No Sale',
          message: `Your auction for "${collectible.title}" ended without a sale. ${reason.charAt(0).toUpperCase() + reason.slice(1)}.`,
          relatedId: collectible._id
        });
      }
    }

    // Create all in-app notifications in bulk
    if (notifications.length > 0) {
      await createBulkNotifications(notifications);
      console.log(`✅ Created ${notifications.length} in-app notifications for auction end`);
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
