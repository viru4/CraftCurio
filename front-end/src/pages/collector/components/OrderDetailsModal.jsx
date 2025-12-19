import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { updateOrderShippingAddress } from '../../../utils/api';
import { useRazorpay } from '../../../hooks/useRazorpay';
import { useAuth } from '../../../contexts/AuthContext';
import { formatDate } from '../../../lib/date';

/**
 * OrderDetailsModal - Display and manage order details
 */
const OrderDetailsModal = ({ order, onClose, onRefresh }) => {
  const { user } = useAuth();
  const { processPayment, loading: paymentLoading } = useRazorpay();
  
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [shippingAddress, setShippingAddress] = useState(order.shippingAddress || {
    fullName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [paymentError, setPaymentError] = useState(null);

  const handleAddressChange = (field, value) => {
    setShippingAddress(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveAddress = async () => {
    setIsSaving(true);
    setError(null);
    try {
      await updateOrderShippingAddress(order._id, shippingAddress);
      setIsEditingAddress(false);
      onRefresh();
      alert('Shipping address updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update address');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePayment = async () => {
    // Validate shipping address is complete
    const requiredFields = ['fullName', 'address', 'city', 'state', 'zipCode', 'country'];
    const isAddressComplete = requiredFields.every(field => 
      shippingAddress[field] && shippingAddress[field].trim() !== ''
    );

    if (!isAddressComplete) {
      setPaymentError('Please complete your shipping address before payment');
      setIsEditingAddress(true);
      return;
    }

    setPaymentError(null);

    await processPayment({
      orderId: order._id,
      amount: order.total,
      name: user?.name || shippingAddress.fullName,
      email: user?.email || '',
      phone: user?.phone || '',
      description: `Order #${order.orderNumber}`,
      onSuccess: (updatedOrder) => {
        console.log('Payment successful:', updatedOrder);
        alert('Payment completed successfully! Your order is being processed.');
        onRefresh();
        onClose();
      },
      onFailure: (error) => {
        console.error('Payment failed:', error);

        let userMessage = 'Payment failed. Please try again or use a different payment method.';
        if (error && error.description) {
          userMessage = `Payment failed: ${error.description}. Please try again or use a different payment method.`;
        } else if (error && error.reason) {
          // Fallback to reason if description is missing
          userMessage = `Payment failed: ${error.reason}. Please try again or use a different payment method.`;
        }

        setPaymentError(userMessage);

        // TODO: Log this error to your backend for monitoring and debugging
        // Example: sendErrorToBackend('/api/log-payment-failure', error);
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Order Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Order Number</p>
                <p className="font-semibold text-gray-900">{order.orderNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Order Date</p>
                <p className="font-semibold text-gray-900">
                  {formatDate(order.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Payment Status</p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                  order.paymentStatus === 'paid' 
                    ? 'bg-green-100 text-green-800'
                    : order.paymentStatus === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {order.paymentStatus.toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Order Status</p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                  order.orderStatus === 'delivered' 
                    ? 'bg-green-100 text-green-800'
                    : order.orderStatus === 'shipped'
                    ? 'bg-blue-100 text-blue-800'
                    : order.orderStatus === 'processing'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {order.orderStatus.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Items */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Items</h3>
            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center space-x-4 bg-white border border-gray-200 rounded-lg p-4">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    {item.category && (
                      <span className="inline-block mt-1 px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                        {item.category}
                      </span>
                    )}
                  </div>
                  <p className="font-bold text-gray-900">₹{item.price.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-gray-900">Shipping Address</h3>
              {!isEditingAddress && order.paymentStatus === 'pending' && (
                <button
                  onClick={() => setIsEditingAddress(true)}
                  className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                >
                  Edit
                </button>
              )}
            </div>

            {error && (
              <div className="mb-3 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
                {error}
              </div>
            )}

            {isEditingAddress ? (
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={shippingAddress.fullName}
                  onChange={(e) => handleAddressChange('fullName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Address"
                  value={shippingAddress.address}
                  onChange={(e) => handleAddressChange('address', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="City"
                    value={shippingAddress.city}
                    onChange={(e) => handleAddressChange('city', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={shippingAddress.state}
                    onChange={(e) => handleAddressChange('state', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="ZIP Code"
                    value={shippingAddress.zipCode}
                    onChange={(e) => handleAddressChange('zipCode', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Country"
                    value={shippingAddress.country}
                    onChange={(e) => handleAddressChange('country', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div className="flex space-x-2 pt-2">
                  <button
                    onClick={handleSaveAddress}
                    disabled={isSaving}
                    className="flex-1 bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {isSaving ? 'Saving...' : 'Save Address'}
                  </button>
                  <button
                    onClick={() => setIsEditingAddress(false)}
                    disabled={isSaving}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-4">
                {shippingAddress.fullName ? (
                  <div className="text-gray-900">
                    <p className="font-semibold">{shippingAddress.fullName}</p>
                    <p className="text-sm mt-1">{shippingAddress.address}</p>
                    <p className="text-sm">
                      {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}
                    </p>
                    <p className="text-sm">{shippingAddress.country}</p>
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No shipping address provided</p>
                )}
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="border-t border-gray-200 pt-4">
            <div className="space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>₹{order.shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>₹{order.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-900 pt-4 border-t border-gray-200">
                <span>Total</span>
                <span>₹{order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> {order.notes}
              </p>
            </div>
          )}

          {/* Actions */}
          {order.paymentStatus === 'pending' && (
            <div className="space-y-3">
              {paymentError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {paymentError}
                </div>
              )}
              <button
                className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors font-semibold text-lg disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                onClick={handlePayment}
                disabled={paymentLoading || isSaving}
              >
                {paymentLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  `Complete Payment - ₹${order.total.toFixed(2)}`
                )}
              </button>
            </div>
          )}

          {order.trackingNumber && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <strong>Tracking Number:</strong> {order.trackingNumber}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

OrderDetailsModal.propTypes = {
  order: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired
};

export default OrderDetailsModal;
