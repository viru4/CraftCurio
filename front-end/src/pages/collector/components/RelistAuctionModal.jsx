import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { X } from 'lucide-react';

const RelistAuctionModal = ({ auction, onClose, onRelist }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Calculate default dates (start in 1 hour, end in 7 days)
  const defaultStart = new Date(Date.now() + 60 * 60 * 1000);
  const defaultEnd = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  
  const [formData, setFormData] = useState({
    startTime: defaultStart.toISOString().slice(0, 16),
    endTime: defaultEnd.toISOString().slice(0, 16),
    startingBid: auction.auction?.startingBid || 0,
    reservePrice: auction.auction?.reservePrice || 0,
    minimumBidIncrement: auction.auction?.minimumBidIncrement || 10
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('Bid') || name.includes('Price') || name.includes('Increment') 
        ? parseFloat(value) || 0 
        : value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate dates
      const start = new Date(formData.startTime);
      const end = new Date(formData.endTime);
      const now = new Date();

      if (start < now) {
        throw new Error('Start time must be in the future');
      }

      if (end <= start) {
        throw new Error('End time must be after start time');
      }

      // Call parent handler
      await onRelist(auction._id, formData);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to relist auction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Relist Auction</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Auction Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">{auction.title}</h3>
            <p className="text-sm text-gray-600">
              Previous auction ended without a sale. Set new dates and optionally update pricing.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Start Date & Time <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 bg-white h-12 px-3 text-base focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                End Date & Time <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 bg-white h-12 px-3 text-base focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Pricing (Optional Updates)</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Starting Bid (₹)
                </label>
                <input
                  type="number"
                  name="startingBid"
                  value={formData.startingBid}
                  onChange={handleChange}
                  min="0"
                  step="10"
                  className="w-full rounded-lg border border-gray-300 bg-white h-12 px-3 text-base focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Reserve Price (₹)
                </label>
                <input
                  type="number"
                  name="reservePrice"
                  value={formData.reservePrice}
                  onChange={handleChange}
                  min="0"
                  step="10"
                  className="w-full rounded-lg border border-gray-300 bg-white h-12 px-3 text-base focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Min Bid Increment (₹)
                </label>
                <input
                  type="number"
                  name="minimumBidIncrement"
                  value={formData.minimumBidIncrement}
                  onChange={handleChange}
                  min="1"
                  step="5"
                  className="w-full rounded-lg border border-gray-300 bg-white h-12 px-3 text-base focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                />
              </div>
            </div>

            <p className="text-xs text-gray-500">
              Leave pricing fields unchanged to use the same values from the previous auction.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-5 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-orange-300 font-medium transition-colors"
            >
              {loading ? 'Relisting...' : 'Relist Auction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

RelistAuctionModal.propTypes = {
  auction: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onRelist: PropTypes.func.isRequired
};

export default RelistAuctionModal;
