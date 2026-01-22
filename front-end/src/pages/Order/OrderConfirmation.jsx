import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import api from '@/utils/api';
import { CheckCircle, Package, Truck, MapPin, Calendar, CreditCard } from 'lucide-react';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          navigate('/sign-in');
          return;
        }

        const response = await api.get(`/orders/${orderId}`);

        if (response.data) {
          setOrder(response.data.order || response.data.data);
        }
      } catch (err) {
        if (import.meta.env.DEV) {
          console.error('Fetch order error:', err);
        }
        const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch order';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId, navigate]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[var(--primary-color)] mx-auto mb-4"></div>
            <p className="text-stone-600">Loading order details...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !order) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen pt-24 pb-12 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-stone-900 mb-4">Order Not Found</h2>
            <p className="text-stone-600 mb-8">{error || 'Unable to find this order'}</p>
            <Link
              to="/"
              className="inline-block bg-[var(--primary-color)] text-white px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#f8f7f6] pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Success Message */}
          <div className="bg-white rounded-xl shadow-sm p-8 mb-8 text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-20 w-20 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-[#1b130d] mb-2">Order Confirmed!</h1>
            <p className="text-[#9a6c4c] text-lg mb-4">
              Thank you for your order. We'll send you shipping confirmation soon.
            </p>
            <div className="inline-block bg-[#f8f7f6] px-6 py-3 rounded-lg">
              <p className="text-sm text-[#9a6c4c]">Order Number</p>
              <p className="text-xl font-bold text-[#1b130d]">{order.orderNumber}</p>
            </div>
          </div>

          {/* Order Details */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold text-[#1b130d] mb-6 flex items-center gap-2">
              <Package className="h-5 w-5" />
              Order Details
            </h2>

            {/* Order Items */}
            <div className="space-y-4 mb-6">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center gap-4 py-4 border-b border-[#e7d9cf] last:border-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-20 w-20 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#1b130d] truncate">{item.name}</p>
                    <p className="text-sm text-[#9a6c4c]">Qty: {item.quantity}</p>
                    {item.artisan && (
                      <p className="text-xs text-[#9a6c4c]">By {item.artisan}</p>
                    )}
                  </div>
                  <p className="font-semibold text-[#1b130d] flex-shrink-0">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            {/* Price Summary */}
            <div className="border-t border-[#e7d9cf] pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#9a6c4c]">Subtotal</span>
                <span className="font-medium text-[#1b130d]">₹{order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#9a6c4c]">Shipping</span>
                <span className="font-medium text-[#1b130d]">₹{order.shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#9a6c4c]">Tax</span>
                <span className="font-medium text-[#1b130d]">₹{order.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-[#e7d9cf]">
                <span className="text-[#1b130d]">Total</span>
                <span className="text-[#1b130d]">₹{order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Shipping & Payment Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Shipping Address */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-[#1b130d] mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Shipping Address
              </h3>
              <div className="text-sm text-[#9a6c4c] space-y-1">
                <p className="font-semibold text-[#1b130d]">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.address}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                </p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>

            {/* Order Status & Payment */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-[#1b130d] mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Order Status
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#9a6c4c]">Order Status:</span>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full capitalize">
                    {order.orderStatus}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#9a6c4c]">Payment Status:</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full capitalize">
                    {order.paymentStatus}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#9a6c4c]">Order Date:</span>
                  <span className="text-sm text-[#1b130d] font-medium">
                    {formatDate(order.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/"
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[var(--primary-color)] text-white rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
            >
              Continue Shopping
            </Link>
            <Link
              to="/my-orders"
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border-2 border-[var(--primary-color)] text-[var(--primary-color)] rounded-lg font-semibold hover:bg-[var(--primary-color)] hover:text-white transition-colors"
            >
              <Truck className="h-5 w-5" />
              View All Orders
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrderConfirmation;
