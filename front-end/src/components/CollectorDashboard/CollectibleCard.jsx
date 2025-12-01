import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { formatTimeRemainingString } from '../../utils/socket';

/**
 * CollectibleCard Component - Displays a collectible item in card format
 * Shows image, title, price/bid, status, and action buttons
 * Responsive design for mobile and desktop
 */

const CollectibleCard = ({
  collectible,
  onEdit,
  onDelete,
  onPromote,
  onView,
  showActions = true,
}) => {
  const [imageError, setImageError] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Determine if this is an auction
  const isAuction = collectible.saleType === 'auction';
  const auction = collectible.auction;

  // Status badge configuration
  const getStatusBadge = () => {
    if (isAuction) {
      const status = auction?.auctionStatus || 'scheduled';
      
      const statusConfig = {
        scheduled: { color: 'bg-blue-100 text-blue-800', text: 'Scheduled' },
        live: { color: 'bg-green-100 text-green-800 animate-pulse', text: 'Live' },
        ended: { color: 'bg-gray-100 text-gray-800', text: 'Ended' },
        sold: { color: 'bg-purple-100 text-purple-800', text: 'Sold' },
        cancelled: { color: 'bg-red-100 text-red-800', text: 'Cancelled' },
      };

      return statusConfig[status] || statusConfig.scheduled;
    } else {
      const status = collectible.status || 'active';
      
      const statusConfig = {
        active: { color: 'bg-green-100 text-green-800', text: 'Active' },
        sold: { color: 'bg-purple-100 text-purple-800', text: 'Sold' },
        inactive: { color: 'bg-gray-100 text-gray-800', text: 'Inactive' },
        pending: { color: 'bg-yellow-100 text-yellow-800', text: 'Pending' },
      };

      return statusConfig[status] || statusConfig.active;
    }
  };

  const statusBadge = getStatusBadge();

  // Calculate time remaining for live auctions
  const getTimeRemaining = () => {
    if (!isAuction || !auction?.endTime) return null;
    
    const endTime = new Date(auction.endTime).getTime();
    const now = Date.now();
    const remaining = endTime - now;
    
    if (remaining <= 0) return 'Expired';
    
    return formatTimeRemainingString(remaining);
  };

  const timeRemaining = getTimeRemaining();

  // Handle delete with confirmation
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this listing?')) {
      return;
    }

    setIsDeleting(true);
    try {
      await onDelete(collectible._id);
    } catch (error) {
      console.error('Error deleting collectible:', error);
      alert('Failed to delete listing. ' + (error.message || ''));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Image Section */}
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        {!imageError ? (
          <img
            src={collectible.image}
            alt={collectible.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
            onError={() => setImageError(true)}
            onClick={() => onView && onView(collectible)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-300">
            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {/* Badges Overlay */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {/* Status Badge */}
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusBadge.color}`}>
            {statusBadge.text}
          </span>

          {/* Sale Type Badge */}
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
            isAuction ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'
          }`}>
            {isAuction ? '🔨 Auction' : '💰 Direct Sale'}
          </span>

          {/* Promoted Badge */}
          {collectible.promoted && (
            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
              ⭐ Promoted
            </span>
          )}
        </div>

        {/* Time Remaining (for live auctions) */}
        {isAuction && auction?.auctionStatus === 'live' && timeRemaining && (
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-3 py-1 rounded-full text-sm font-semibold">
            ⏰ {timeRemaining}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Title */}
        <h3 
          className="text-lg font-semibold text-gray-900 mb-2 truncate cursor-pointer hover:text-orange-600"
          onClick={() => onView && onView(collectible)}
          title={collectible.title}
        >
          {collectible.title}
        </h3>

        {/* Category */}
        <p className="text-sm text-gray-500 mb-3">{collectible.category}</p>

        {/* Price/Bid Information */}
        <div className="mb-4">
          {isAuction ? (
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-600">Current Bid:</span>
                <span className="text-lg font-bold text-orange-600">
                  ₹{auction?.currentBid?.toFixed(2) || collectible.price?.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Total Bids:</span>
                <span className="font-semibold">{auction?.totalBids || 0}</span>
              </div>
              {auction?.buyNowPrice && (
                <div className="flex justify-between items-center text-sm mt-1">
                  <span className="text-gray-500">Buy Now:</span>
                  <span className="text-green-600 font-semibold">
                    ₹{auction.buyNowPrice.toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Price:</span>
              <span className="text-xl font-bold text-green-600">
                ₹{collectible.price?.toFixed(2)}
              </span>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="flex justify-between text-sm text-gray-500 mb-4">
          <span>👁️ {collectible.views || 0} views</span>
          <span>❤️ {collectible.likes || 0} likes</span>
        </div>

        {/* Action Buttons */}
        {showActions && (
          <div className="flex gap-2">
            <button
              onClick={() => onView && onView(collectible)}
              className="flex-1 px-3 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors text-sm font-medium"
            >
              View
            </button>
            
            {!['sold', 'cancelled'].includes(collectible.status) && (
              <>
                <button
                  onClick={() => onEdit && onEdit(collectible)}
                  className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                  title="Edit"
                >
                  ✏️
                </button>
                
                {!collectible.promoted && (
                  <button
                    onClick={() => onPromote && onPromote(collectible)}
                    className="px-3 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors text-sm font-medium"
                    title="Promote"
                  >
                    ⭐
                  </button>
                )}
                
                <button
                  onClick={handleDelete}
                  disabled={isDeleting || (isAuction && auction?.totalBids > 0)}
                  className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                  title={isAuction && auction?.totalBids > 0 ? 'Cannot delete auction with bids' : 'Delete'}
                >
                  {isDeleting ? '...' : '🗑️'}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

CollectibleCard.propTypes = {
  collectible: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    price: PropTypes.number,
    category: PropTypes.string,
    image: PropTypes.string.isRequired,
    saleType: PropTypes.oneOf(['direct', 'auction']).isRequired,
    status: PropTypes.string,
    promoted: PropTypes.bool,
    views: PropTypes.number,
    likes: PropTypes.number,
    auction: PropTypes.shape({
      currentBid: PropTypes.number,
      totalBids: PropTypes.number,
      auctionStatus: PropTypes.string,
      endTime: PropTypes.string,
      buyNowPrice: PropTypes.number,
    }),
  }).isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onPromote: PropTypes.func,
  onView: PropTypes.func,
  showActions: PropTypes.bool,
};

export default CollectibleCard;
