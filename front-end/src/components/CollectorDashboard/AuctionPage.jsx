import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useAuction, usePlaceBid, useBuyNow } from '../../hooks/useAuction';
import { formatTimeRemainingString } from '../../utils/socket';

/**
 * AuctionPage Component - Live auction viewing and bidding interface
 * Real-time updates via Socket.io for bids, countdown, and auction status
 * Displays item details, current bid, bid history, and bidding form
 */

const AuctionPage = ({ auctionId, onClose, onBuySuccess }) => {
  const { auction, isLoading, error, timeRemaining } = useAuction(auctionId);
  const { placeBid, isPlacingBid, bidError } = usePlaceBid();
  const { buyNow, isBuying, buyError } = useBuyNow();

  const [bidAmount, setBidAmount] = useState('');
  const [localError, setLocalError] = useState('');
  const [showBidHistory, setShowBidHistory] = useState(false);

  // Update minimum bid when auction changes
  useEffect(() => {
    if (auction) {
      const minBid = calculateMinimumBid();
      setBidAmount(minBid.toFixed(2));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auction?.auction?.currentBid]);

  // Calculate minimum bid
  const calculateMinimumBid = () => {
    if (!auction?.auction) return 0;
    
    const currentBid = auction.auction.currentBid || auction.auction.startingBid || 0;
    const increment = currentBid * 0.05; // 5% increment
    const minIncrement = Math.max(1, increment); // At least $1
    
    return currentBid + minIncrement;
  };

  // Handle bid placement
  const handlePlaceBid = async (e) => {
    e.preventDefault();
    setLocalError('');

    const amount = parseFloat(bidAmount);
    const minBid = calculateMinimumBid();

    // Validation
    if (isNaN(amount) || amount <= 0) {
      setLocalError('Please enter a valid bid amount');
      return;
    }

    if (amount < minBid) {
      setLocalError(`Bid must be at least $${minBid.toFixed(2)}`);
      return;
    }

    try {
      await placeBid(auctionId, amount);
      // Success - bid amount will auto-update to new minimum
    } catch (err) {
      setLocalError(err.message || 'Failed to place bid');
    }
  };

  // Handle buy now
  const handleBuyNow = async () => {
    if (!window.confirm('Are you sure you want to buy this item now?')) {
      return;
    }

    try {
      await buyNow(auctionId);
      onBuySuccess && onBuySuccess(auction);
      alert('Purchase successful! Auction has been finalized.');
    } catch (err) {
      setLocalError(err.message || 'Failed to complete purchase');
    }
  };

  // Determine if auction is live
  const isLive = auction?.auction?.auctionStatus === 'live';
  const isEnded = ['ended', 'sold', 'cancelled'].includes(auction?.auction?.auctionStatus);

  // Get status badge configuration
  const getStatusBadge = () => {
    const status = auction?.auction?.auctionStatus || 'scheduled';
    
    const config = {
      scheduled: { color: 'bg-blue-500', text: 'Scheduled' },
      live: { color: 'bg-green-500 animate-pulse', text: '🔴 LIVE' },
      ended: { color: 'bg-gray-500', text: 'Ended' },
      sold: { color: 'bg-purple-500', text: 'Sold' },
      cancelled: { color: 'bg-red-500', text: 'Cancelled' },
    };

    return config[status] || config.scheduled;
  };

  const statusBadge = getStatusBadge();

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-600 mb-4"></div>
            <p className="text-gray-600">Loading auction...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full">
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Auction</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!auction) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full m-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-gray-900">{auction.title}</h2>
            <span className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${statusBadge.color}`}>
              {statusBadge.text}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-3xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
          {/* Left Column - Image and Details */}
          <div>
            {/* Image */}
            <div className="mb-6">
              <img
                src={auction.image}
                alt={auction.title}
                className="w-full h-96 object-cover rounded-lg shadow-md"
              />
            </div>

            {/* Item Details */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Item Details</h3>
              
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600">Category:</span>
                  <p className="font-medium">{auction.category}</p>
                </div>

                <div>
                  <span className="text-sm text-gray-600">Description:</span>
                  <p className="text-gray-700">{auction.description}</p>
                </div>

                {auction.auction?.reservePrice && (
                  <div className="pt-3 border-t border-gray-200">
                    <span className="text-sm text-gray-600">Reserve Status:</span>
                    <p className={`font-medium ${
                      auction.auction.currentBid >= auction.auction.reservePrice
                        ? 'text-green-600'
                        : 'text-orange-600'
                    }`}>
                      {auction.auction.currentBid >= auction.auction.reservePrice
                        ? '✓ Reserve Met'
                        : 'Reserve Not Met'
                      }
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Bidding Interface */}
          <div>
            {/* Countdown Timer */}
            {isLive && timeRemaining > 0 && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Time Remaining</p>
                  <p className="text-3xl font-bold text-orange-600">
                    {formatTimeRemainingString(timeRemaining)}
                  </p>
                </div>
              </div>
            )}

            {/* Current Bid */}
            <div className="bg-white border-2 border-orange-500 rounded-lg p-6 mb-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Current Bid</p>
                <p className="text-4xl font-bold text-orange-600">
                  ${auction.auction?.currentBid?.toFixed(2) || auction.auction?.startingBid?.toFixed(2)}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  {auction.auction?.totalBids || 0} bid{auction.auction?.totalBids !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            {/* Buy Now Option */}
            {auction.auction?.buyNowPrice && isLive && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">Buy It Now</p>
                    <p className="text-2xl font-bold text-green-600">
                      ${auction.auction.buyNowPrice.toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={handleBuyNow}
                    disabled={isBuying}
                    className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 font-medium"
                  >
                    {isBuying ? 'Processing...' : 'Buy Now'}
                  </button>
                </div>
              </div>
            )}

            {/* Bidding Form */}
            {isLive && !isEnded && (
              <form onSubmit={handlePlaceBid} className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Place Your Bid</h3>
                
                {(localError || bidError || buyError) && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                    {localError || bidError || buyError}
                  </div>
                )}

                <div className="mb-4">
                  <label htmlFor="bidAmount" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Bid Amount ($)
                  </label>
                  <input
                    type="number"
                    id="bidAmount"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    step="0.01"
                    min={calculateMinimumBid()}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-lg"
                    disabled={isPlacingBid}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Minimum bid: ${calculateMinimumBid().toFixed(2)}
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isPlacingBid}
                  className="w-full px-6 py-3 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors disabled:opacity-50 font-medium text-lg"
                >
                  {isPlacingBid ? 'Placing Bid...' : 'Place Bid'}
                </button>
              </form>
            )}

            {/* Auction Ended Message */}
            {isEnded && (
              <div className="bg-gray-100 rounded-lg p-6 mb-6 text-center">
                <p className="text-xl font-semibold text-gray-900 mb-2">Auction Has Ended</p>
                {auction.auction?.winner && (
                  <p className="text-gray-600">
                    Winner: {auction.auction.winner.name || 'Anonymous'}
                  </p>
                )}
              </div>
            )}

            {/* Bid History */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Bid History</h3>
                <button
                  onClick={() => setShowBidHistory(!showBidHistory)}
                  className="text-sm text-orange-600 hover:text-orange-700"
                >
                  {showBidHistory ? 'Hide' : 'Show'}
                </button>
              </div>

              {showBidHistory && (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {auction.auction?.bidHistory && auction.auction.bidHistory.length > 0 ? (
                    auction.auction.bidHistory
                      .slice()
                      .reverse()
                      .map((bid, index) => (
                        <div
                          key={bid._id || index}
                          className={`flex justify-between items-center p-3 rounded ${
                            index === 0 ? 'bg-orange-50' : 'bg-gray-50'
                          }`}
                        >
                          <div>
                            <p className="font-medium text-gray-900">
                              {bid.bidder?.name || 'Anonymous'}
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(bid.timestamp).toLocaleString()}
                            </p>
                          </div>
                          <p className={`text-lg font-bold ${index === 0 ? 'text-orange-600' : 'text-gray-600'}`}>
                            ${bid.amount.toFixed(2)}
                          </p>
                        </div>
                      ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No bids yet</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

AuctionPage.propTypes = {
  auctionId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onBuySuccess: PropTypes.func,
};

export default AuctionPage;
