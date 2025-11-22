import { useState } from 'react';
import { X, Package, MapPin, CreditCard, Truck, User, Phone, Mail, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import API_BASE_URL from '../../../../config/api';

const OrderDetailsModal = ({ order, onClose, onUpdateStatus, onRefresh }) => {
  const [updating, setUpdating] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber || '');
  const [estimatedDelivery, setEstimatedDelivery] = useState(
    order.estimatedDelivery ? format(new Date(order.estimatedDelivery), 'yyyy-MM-dd') : ''
  );

  const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'confirmed', label: 'Confirmed', color: 'bg-blue-100 text-blue-800' },
    { value: 'processing', label: 'Processing', color: 'bg-purple-100 text-purple-800' },
    { value: 'shipped', label: 'Shipped', color: 'bg-indigo-100 text-indigo-800' },
    { value: 'delivered', label: 'Delivered', color: 'bg-green-100 text-green-800' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' }
  ];

  const handleUpdateOrder = async () => {
    try {
      setUpdating(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(
        `${API_BASE_URL}/api/orders/${order._id}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            orderStatus: order.orderStatus,
            trackingNumber: trackingNumber || undefined,
            estimatedDelivery: estimatedDelivery || undefined
          })
        }
      );

      const data = await response.json();

      if (data.success) {
        onRefresh();
        onClose();
      }
    } catch (error) {
      console.error('Error updating order:', error);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-[#e8d5c4] px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#1b130d]">Order Details</h2>
            <p className="text-sm text-[#6b5d54] font-mono">{order.orderNumber}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#f8f7f6] rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Order Status */}
          <div className="bg-[#f8f7f6] rounded-lg p-6 border border-[#e8d5c4]">
            <h3 className="font-semibold text-[#1b130d] mb-4 flex items-center gap-2">
              <Package size={20} className="text-[#ec6d13]" />
              Order Status
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-[#6b5d54] mb-2">
                  Current Status
                </label>
                <select
                  value={order.orderStatus}
                  onChange={(e) => {
                    order.orderStatus = e.target.value;
                    onUpdateStatus(order._id, e.target.value);
                  }}
                  className="w-full px-4 py-2 border border-[#e8d5c4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec6d13]"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#6b5d54] mb-2">
                  Payment Status
                </label>
                <span className={`inline-block px-4 py-2 rounded-lg font-medium ${
                  order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                  order.paymentStatus === 'pending' ? 'bg-orange-100 text-orange-800' :
                  order.paymentStatus === 'failed' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#6b5d54] mb-2">
                  <Truck size={16} className="inline mr-1" />
                  Tracking Number
                </label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Enter tracking number"
                  className="w-full px-4 py-2 border border-[#e8d5c4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec6d13]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#6b5d54] mb-2">
                  <Calendar size={16} className="inline mr-1" />
                  Estimated Delivery
                </label>
                <input
                  type="date"
                  value={estimatedDelivery}
                  onChange={(e) => setEstimatedDelivery(e.target.value)}
                  className="w-full px-4 py-2 border border-[#e8d5c4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec6d13]"
                />
              </div>
            </div>

            <button
              onClick={handleUpdateOrder}
              disabled={updating}
              className="mt-4 px-6 py-2 bg-[#ec6d13] text-white rounded-lg hover:bg-[#d96012] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updating ? 'Updating...' : 'Update Order Info'}
            </button>
          </div>

          {/* Customer Information */}
          <div className="bg-white rounded-lg p-6 border border-[#e8d5c4]">
            <h3 className="font-semibold text-[#1b130d] mb-4 flex items-center gap-2">
              <User size={20} className="text-[#ec6d13]" />
              Customer Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-[#6b5d54] mb-1">Name</p>
                <p className="font-medium text-[#1b130d]">{order.shippingAddress.fullName}</p>
              </div>
              <div>
                <p className="text-sm text-[#6b5d54] mb-1">
                  <Mail size={14} className="inline mr-1" />
                  Email
                </p>
                <p className="font-medium text-[#1b130d]">{order.user?.email}</p>
              </div>
              <div>
                <p className="text-sm text-[#6b5d54] mb-1">
                  <Phone size={14} className="inline mr-1" />
                  Phone
                </p>
                <p className="font-medium text-[#1b130d]">{order.user?.phone || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-[#6b5d54] mb-1">Order Date</p>
                <p className="font-medium text-[#1b130d]">
                  {format(new Date(order.createdAt), 'MMM dd, yyyy HH:mm')}
                </p>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-lg p-6 border border-[#e8d5c4]">
            <h3 className="font-semibold text-[#1b130d] mb-4 flex items-center gap-2">
              <MapPin size={20} className="text-[#ec6d13]" />
              Shipping Address
            </h3>
            <div className="space-y-1 text-[#6b5d54]">
              <p>{order.shippingAddress.address}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
              </p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-lg p-6 border border-[#e8d5c4]">
            <h3 className="font-semibold text-[#1b130d] mb-4 flex items-center gap-2">
              <Package size={20} className="text-[#ec6d13]" />
              Order Items ({order.items.length})
            </h3>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex gap-4 pb-4 border-b border-[#e8d5c4] last:border-0">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-[#1b130d]">{item.name}</p>
                    {item.artisan && (
                      <p className="text-sm text-[#6b5d54]">by {item.artisan}</p>
                    )}
                    <p className="text-sm text-[#6b5d54]">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-[#1b130d]">${item.price.toFixed(2)}</p>
                    <p className="text-sm text-[#6b5d54]">
                      Total: ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-[#f8f7f6] rounded-lg p-6 border border-[#e8d5c4]">
            <h3 className="font-semibold text-[#1b130d] mb-4 flex items-center gap-2">
              <CreditCard size={20} className="text-[#ec6d13]" />
              Payment Summary
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-[#6b5d54]">
                <span>Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#6b5d54]">
                <span>Shipping</span>
                <span>${order.shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#6b5d54]">
                <span>Tax</span>
                <span>${order.tax.toFixed(2)}</span>
              </div>
              <div className="pt-2 border-t border-[#e8d5c4]">
                <div className="flex justify-between font-bold text-[#1b130d] text-lg">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
              <div className="pt-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#6b5d54]">Payment Method</span>
                  <span className="font-medium text-[#1b130d] uppercase">{order.paymentMethod}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <h3 className="font-semibold text-[#1b130d] mb-2">Customer Notes</h3>
              <p className="text-[#6b5d54]">{order.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
