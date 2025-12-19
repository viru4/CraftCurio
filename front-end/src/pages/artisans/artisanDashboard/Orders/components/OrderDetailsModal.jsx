import { useState } from 'react';
import { X, Package, MapPin, CreditCard, Truck, CheckCircle, XCircle, Clock } from 'lucide-react';
import { formatDate, formatDateTime } from '../../../../../lib/date';

const OrderDetailsModal = ({ order, isOpen, onClose, onUpdateStatus }) => {
  const [newStatus, setNewStatus] = useState(order?.orderStatus || '');
  const [trackingNumber, setTrackingNumber] = useState(order?.trackingNumber || '');
  const [updating, setUpdating] = useState(false);

  if (!isOpen || !order) return null;

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700',
      confirmed: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-700',
      processing: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-700',
      shipped: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700',
      delivered: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-300 dark:border-green-700',
      cancelled: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-300 dark:border-red-700'
    };
    return colors[status] || 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300 border-gray-300 dark:border-gray-700';
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
      paid: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
      failed: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
      refunded: 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300'
    };
    return colors[status] || 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: Clock,
      confirmed: CheckCircle,
      processing: Package,
      shipped: Truck,
      delivered: CheckCircle,
      cancelled: XCircle
    };
    return icons[status] || Clock;
  };

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const handleUpdateStatus = async () => {
    setUpdating(true);
    try {
      await onUpdateStatus(order._id, newStatus, trackingNumber);
      onClose();
    } catch (error) {
      console.error('Failed to update order status:', error);
    } finally {
      setUpdating(false);
    }
  };

  const StatusIcon = getStatusIcon(order.orderStatus);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white dark:bg-[#2a1e14] rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white dark:bg-[#2a1e14] border-b border-[#e7d9cf] dark:border-[#4a392b] px-6 py-4 flex items-center justify-between z-10">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1b130d] dark:text-[#f3ece7]">
                Order Details
              </h2>
              <p className="text-sm text-[#9a6c4c] dark:text-[#a88e79] mt-1">
                Order #{order.orderNumber}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#f8f7f6] dark:hover:bg-[#221810] rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-[#9a6c4c] dark:text-[#a88e79]" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Status and Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#f8f7f6] dark:bg-[#221810] rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <StatusIcon className="w-5 h-5 text-[#ec6d13]" />
                  <span className="text-sm font-medium text-[#9a6c4c] dark:text-[#a88e79]">
                    Order Status
                  </span>
                </div>
                <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(order.orderStatus)}`}>
                  {order.orderStatus?.charAt(0).toUpperCase() + order.orderStatus?.slice(1)}
                </span>
              </div>

              <div className="bg-[#f8f7f6] dark:bg-[#221810] rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="w-5 h-5 text-[#ec6d13]" />
                  <span className="text-sm font-medium text-[#9a6c4c] dark:text-[#a88e79]">
                    Payment Status
                  </span>
                </div>
                <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                  {order.paymentStatus?.charAt(0).toUpperCase() + order.paymentStatus?.slice(1)}
                </span>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-[#f8f7f6] dark:bg-[#221810] rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <Package className="w-5 h-5 text-[#ec6d13]" />
                <h3 className="text-lg font-semibold text-[#1b130d] dark:text-[#f3ece7]">
                  Order Items
                </h3>
              </div>
              <div className="space-y-3">
                {order.items?.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-3 bg-white dark:bg-[#2a1e14] rounded-lg border border-[#e7d9cf] dark:border-[#4a392b]"
                  >
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-[#1b130d] dark:text-[#f3ece7] mb-1">
                        {item.name}
                      </h4>
                      <p className="text-xs text-[#9a6c4c] dark:text-[#a88e79]">
                        Quantity: {item.quantity} × ₹{item.price?.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-[#1b130d] dark:text-[#f3ece7]">
                        ₹{(item.quantity * item.price)?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="mt-4 pt-4 border-t border-[#e7d9cf] dark:border-[#4a392b] space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#9a6c4c] dark:text-[#a88e79]">Subtotal</span>
                  <span className="text-[#1b130d] dark:text-[#f3ece7]">₹{order.subtotal?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#9a6c4c] dark:text-[#a88e79]">Shipping</span>
                  <span className="text-[#1b130d] dark:text-[#f3ece7]">₹{order.shipping?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#9a6c4c] dark:text-[#a88e79]">Tax</span>
                  <span className="text-[#1b130d] dark:text-[#f3ece7]">₹{order.tax?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-base font-semibold pt-2 border-t border-[#e7d9cf] dark:border-[#4a392b]">
                  <span className="text-[#1b130d] dark:text-[#f3ece7]">Total</span>
                  <span className="text-[#ec6d13]">₹{order.total?.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-[#f8f7f6] dark:bg-[#221810] rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-5 h-5 text-[#ec6d13]" />
                <h3 className="text-lg font-semibold text-[#1b130d] dark:text-[#f3ece7]">
                  Shipping Address
                </h3>
              </div>
              <div className="text-sm text-[#1b130d] dark:text-[#f3ece7] space-y-1">
                <p className="font-medium">{order.shippingAddress?.fullName}</p>
                <p>{order.shippingAddress?.address}</p>
                <p>
                  {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}
                </p>
                <p>{order.shippingAddress?.country}</p>
              </div>
            </div>

            {/* Update Status Section */}
            {order.orderStatus !== 'delivered' && order.orderStatus !== 'cancelled' && (
              <div className="bg-[#f8f7f6] dark:bg-[#221810] rounded-lg p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Truck className="w-5 h-5 text-[#ec6d13]" />
                  <h3 className="text-lg font-semibold text-[#1b130d] dark:text-[#f3ece7]">
                    Update Order Status
                  </h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#1b130d] dark:text-[#f3ece7] mb-2">
                      New Status
                    </label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-[#e7d9cf] dark:border-[#4a392b] bg-white dark:bg-[#2a1e14] text-[#1b130d] dark:text-[#f3ece7] focus:ring-2 focus:ring-[#ec6d13] focus:border-transparent transition-colors"
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {(newStatus === 'shipped' || order.trackingNumber) && (
                    <div>
                      <label className="block text-sm font-medium text-[#1b130d] dark:text-[#f3ece7] mb-2">
                        Tracking Number (Optional)
                      </label>
                      <input
                        type="text"
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                        placeholder="Enter tracking number"
                        className="w-full px-4 py-2.5 rounded-lg border border-[#e7d9cf] dark:border-[#4a392b] bg-white dark:bg-[#2a1e14] text-[#1b130d] dark:text-[#f3ece7] placeholder-[#9a6c4c] dark:placeholder-[#a88e79] focus:ring-2 focus:ring-[#ec6d13] focus:border-transparent transition-colors"
                      />
                    </div>
                  )}

                  <button
                    onClick={handleUpdateStatus}
                    disabled={updating || newStatus === order.orderStatus}
                    className="w-full px-4 py-2.5 bg-[#ec6d13] text-white rounded-lg hover:bg-[#d65d0f] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    {updating ? 'Updating...' : 'Update Status'}
                  </button>
                </div>
              </div>
            )}

            {/* Order Timeline */}
            <div className="bg-[#f8f7f6] dark:bg-[#221810] rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-[#ec6d13]" />
                <h3 className="text-lg font-semibold text-[#1b130d] dark:text-[#f3ece7]">
                  Order Timeline
                </h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#9a6c4c] dark:text-[#a88e79]">Order Placed:</span>
                  <span className="text-[#1b130d] dark:text-[#f3ece7]">
                    {formatDateTime(order.createdAt)}
                  </span>
                </div>
                {order.deliveredAt && (
                  <div className="flex justify-between">
                    <span className="text-[#9a6c4c] dark:text-[#a88e79]">Delivered:</span>
                    <span className="text-[#1b130d] dark:text-[#f3ece7]">
                      {formatDateTime(order.deliveredAt)}
                    </span>
                  </div>
                )}
                {order.estimatedDelivery && (
                  <div className="flex justify-between">
                    <span className="text-[#9a6c4c] dark:text-[#a88e79]">Estimated Delivery:</span>
                    <span className="text-[#1b130d] dark:text-[#f3ece7]">
                      {formatDate(order.estimatedDelivery)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
