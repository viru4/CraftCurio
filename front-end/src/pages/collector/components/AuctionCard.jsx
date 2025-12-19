import React from 'react';
import PropTypes from 'prop-types';
import { formatDateTime } from '../../../lib/date';

/**
 * AuctionCard - Display auction with status and actions
 */
const AuctionCard = ({ auction, onView }) => {
  const isAuction = auction.saleType === 'auction';
  const auctionStatus = auction.auction?.auctionStatus || 'scheduled';
  const currentBid = auction.auction?.currentBid || auction.price;
  const totalBids = auction.auction?.totalBids || 0;
  const endTime = auction.auction?.endTime;

  // Calculate time remaining
  const getTimeRemaining = () => {
    if (!endTime) return null;
    const now = new Date();
    const end = new Date(endTime);
    const diff = end - now;

    if (diff <= 0) return 'Ended';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  // Get status badge
  const getStatusBadge = () => {
    const configs = {
      scheduled: { color: 'bg-blue-100 text-blue-800', text: 'Scheduled' },
      live: { color: 'bg-green-100 text-green-800 animate-pulse', text: 'Live' },
      ended: { color: 'bg-gray-100 text-gray-800', text: 'Ended' },
      sold: { color: 'bg-purple-100 text-purple-800', text: 'Sold' },
      cancelled: { color: 'bg-red-100 text-red-800', text: 'Cancelled' }
    };
    return configs[auctionStatus] || configs.scheduled;
  };

  const statusBadge = getStatusBadge();
  const timeRemaining = getTimeRemaining();

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Image */}
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        {auction.image ? (
          <img
            src={auction.image}
            alt={auction.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-300">
            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-2 left-2">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadge.color}`}>
            {statusBadge.text}
          </span>
        </div>

        {/* Time Remaining (for live auctions) */}
        {auctionStatus === 'live' && timeRemaining && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
            ⏰ {timeRemaining}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2 text-gray-900">
          {auction.title}
        </h3>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {auction.description}
        </p>

        {/* Auction Info */}
        {isAuction && (
          <div className="space-y-2 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Current Bid</span>
              <span className="font-bold text-orange-600 text-lg">
                ₹{currentBid.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Bids</span>
              <span className="font-semibold text-gray-900">{totalBids}</span>
            </div>

            {auction.auction?.reservePrice && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Reserve</span>
                <span className="text-sm text-gray-600">
                  Reserve: ₹{auction.auction.reservePrice.toFixed(2)}
                </span>
              </div>
            )}

            {endTime && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  {auctionStatus === 'live' ? 'Ends' : 'Ended'}
                </span>
                <span className="text-sm text-gray-900">
                  {formatDateTime(endTime)}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Winner Badge (for sold auctions) */}
        {auctionStatus === 'sold' && auction.auction?.winner && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center text-green-800">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-semibold">
                Sold for ₹{auction.auction.winningBid?.toFixed(2)}
              </span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-2">
          <button
            onClick={onView}
            className="flex-1 bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors font-medium text-sm"
          >
            View Details
          </button>

          {auctionStatus === 'ended' && !auction.auction?.winner && (
            <button
              onClick={() => {
                if (confirm('Would you like to relist this auction?')) {
                  // TODO: Implement relist functionality
                  alert('Relist functionality coming soon!');
                }
              }}
              className="px-4 py-2 border border-orange-600 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors font-medium text-sm"
            >
              Relist
            </button>
          )}
        </div>
      </div>

      {/* Category */}
      {auction.category && (
        <div className="px-4 pb-4">
          <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
            {auction.category}
          </span>
        </div>
      )}
    </div>
  );
};

AuctionCard.propTypes = {
  auction: PropTypes.object.isRequired,
  onView: PropTypes.func.isRequired
};

export default AuctionCard;
