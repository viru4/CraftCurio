import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Package, Download, HelpCircle, Truck } from 'lucide-react';
import { formatPrice } from '@/lib/currency';
import { formatDate } from '@/lib/date';

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/sign-in');
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch order details');
      }

      const data = await response.json();
      // Handle both response formats: { data: order } or { order: order }
      setOrder(data.data || data.order);
    } catch (error) {
      console.error('Error fetching order details:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200',
      processing: 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200',
      shipped: 'bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200',
      delivered: 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200',
      cancelled: 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200',
    };
    return colors[status] || colors.pending;
  };

  const getStatusProgress = (status) => {
    const progress = {
      pending: 25,
      processing: 45,
      shipped: 75,
      delivered: 100,
      cancelled: 0,
    };
    return progress[status] || 0;
  };

  const handleTrackPackage = () => {
    // Implement tracking logic
    alert('Tracking functionality will be implemented with shipping provider integration');
  };

  const handleDownloadInvoice = () => {
    // Implement invoice download
    alert('Invoice download functionality will be implemented');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-stone-900 px-4 py-8 md:px-10 lg:px-20 xl:px-40">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-stone-200 dark:bg-stone-700 rounded w-1/4 mb-4"></div>
            <div className="h-12 bg-stone-200 dark:bg-stone-700 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <div className="lg:col-span-3 space-y-4">
                <div className="h-64 bg-stone-200 dark:bg-stone-700 rounded-lg"></div>
              </div>
              <div className="lg:col-span-2 space-y-4">
                <div className="h-48 bg-stone-200 dark:bg-stone-700 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-stone-900 px-4 py-8 md:px-10 lg:px-20 xl:px-40">
        <div className="max-w-7xl mx-auto text-center">
          <Package className="w-16 h-16 mx-auto mb-4 text-stone-400" />
          <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-200 mb-2">Order Not Found</h2>
          <p className="text-stone-600 dark:text-stone-400 mb-6">We couldn't find the order you're looking for.</p>
          <Link
            to="/my-orders"
            className="inline-flex items-center px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors"
          >
            View All Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-900">
      <main className="px-4 py-8 md:px-10 lg:px-20 xl:px-40">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Link
              to="/my-orders"
              className="text-stone-600 dark:text-stone-400 text-sm font-medium hover:text-amber-500 dark:hover:text-amber-500 transition-colors"
            >
              Order History
            </Link>
            <span className="text-stone-400 dark:text-stone-600 text-sm font-medium">/</span>
            <span className="text-stone-800 dark:text-stone-200 text-sm font-medium">
              Order #{order.orderNumber || order._id?.slice(-8)}
            </span>
          </div>

          {/* Header */}
          <div className="flex flex-col sm:flex-row flex-wrap justify-between items-start gap-4 mb-8">
            <div className="flex flex-col gap-1">
              <h1 className="text-stone-800 dark:text-stone-200 text-3xl md:text-4xl font-black leading-tight tracking-tight">
                Order #{order.orderNumber || order._id?.slice(-8)}
              </h1>
              <p className="text-stone-600 dark:text-stone-400 text-base">
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>
            <div className="flex flex-shrink-0 gap-3">
              <button
                onClick={handleTrackPackage}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-lg transition-colors"
              >
                <Truck className="w-4 h-4" />
                <span>Track Package</span>
              </button>
              <button
                onClick={handleDownloadInvoice}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 text-sm font-bold rounded-lg hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download Invoice</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Left Column - Order Items */}
            <div className="lg:col-span-3 flex flex-col gap-8">
              {/* Items Ordered */}
              <div className="flex flex-col">
                <h2 className="text-stone-800 dark:text-stone-200 text-xl md:text-2xl font-bold mb-4">
                  Items Ordered
                </h2>
                <div className="overflow-hidden rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800">
                  <table className="w-full">
                    <thead className="hidden md:table-header-group">
                      <tr className="bg-stone-50 dark:bg-stone-900">
                        <th className="px-4 py-3 text-left text-stone-800 dark:text-stone-200 text-sm font-medium">
                          Product
                        </th>
                        <th className="px-4 py-3 text-left text-stone-800 dark:text-stone-200 text-sm font-medium">
                          Price
                        </th>
                        <th className="px-4 py-3 text-center text-stone-800 dark:text-stone-200 text-sm font-medium">
                          Quantity
                        </th>
                        <th className="px-4 py-3 text-right text-stone-800 dark:text-stone-200 text-sm font-medium">
                          Subtotal
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map((item, index) => (
                        <tr
                          key={index}
                          className={`flex flex-col md:table-row p-4 md:p-0 ${
                            index !== order.items.length - 1
                              ? 'border-b border-stone-200 dark:border-stone-700'
                              : ''
                          }`}
                        >
                          <td className="md:px-4 md:py-3 align-middle">
                            <div className="flex items-center gap-4">
                              <img
                                className="aspect-square bg-cover rounded-md w-16 h-16 object-cover"
                                src={item.product?.image || item.image || 'https://via.placeholder.com/64'}
                                alt={item.product?.name || item.name}
                              />
                              <div className="flex flex-col">
                                <Link
                                  to={`/product/${item.product?.type || 'artisan-product'}/${item.product?._id || item.productId}`}
                                  className="text-stone-800 dark:text-stone-200 font-medium hover:text-amber-500 dark:hover:text-amber-500 transition-colors"
                                >
                                  {item.product?.name || item.name}
                                </Link>
                                <span className="text-stone-600 dark:text-stone-400 text-sm">
                                  By {item.product?.artisan || item.artisan || 'Artisan'}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="md:px-4 md:py-3 text-stone-800 dark:text-stone-200 text-sm align-middle pt-2 md:pt-0">
                            <span className="md:hidden font-medium">Price: </span>
                            {formatPrice(item.price)}
                          </td>
                          <td className="md:px-4 md:py-3 text-stone-800 dark:text-stone-200 text-sm align-middle md:text-center pt-2 md:pt-0">
                            <span className="md:hidden font-medium">Qty: </span>
                            {item.quantity}
                          </td>
                          <td className="md:px-4 md:py-3 text-stone-800 dark:text-stone-200 text-sm font-medium align-middle md:text-right pt-2 md:pt-0">
                            <span className="md:hidden font-medium">Subtotal: </span>
                            {formatPrice(item.price * item.quantity)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Order Summary */}
                  <div className="border-t border-stone-200 dark:border-stone-700 p-4 flex justify-end">
                    <div className="w-full max-w-sm flex flex-col gap-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-stone-600 dark:text-stone-400">Subtotal</span>
                        <span className="text-stone-800 dark:text-stone-200">
                          {formatPrice(order.subtotal || (order.total - (order.shipping || 0) - (order.tax || 0)))}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-600 dark:text-stone-400">Shipping</span>
                        <span className="text-stone-800 dark:text-stone-200">
                          {formatPrice(order.shipping || order.shippingCost || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-600 dark:text-stone-400">Taxes</span>
                        <span className="text-stone-800 dark:text-stone-200">
                          {formatPrice(order.tax || 0)}
                        </span>
                      </div>
                      <div className="border-t border-stone-200 dark:border-stone-700 my-2"></div>
                      <div className="flex justify-between font-bold text-base">
                        <span className="text-stone-800 dark:text-stone-200">Order Total</span>
                        <span className="text-stone-800 dark:text-stone-200">
                          {formatPrice(order.total || order.totalAmount)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Addresses */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-stone-800 p-6 rounded-lg border border-stone-200 dark:border-stone-700">
                  <h3 className="text-lg font-bold text-stone-800 dark:text-stone-200 mb-3">
                    Shipping Address
                  </h3>
                  <address className="text-stone-600 dark:text-stone-400 text-sm not-italic leading-relaxed">
                    {order.shippingAddress?.fullName || order.shippingAddress?.name}<br />
                    {order.shippingAddress?.street || order.shippingAddress?.address}<br />
                    {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode || order.shippingAddress?.postalCode}<br />
                    {order.shippingAddress?.country}
                  </address>
                </div>
                <div className="bg-white dark:bg-stone-800 p-6 rounded-lg border border-stone-200 dark:border-stone-700">
                  <h3 className="text-lg font-bold text-stone-800 dark:text-stone-200 mb-3">
                    Billing Address
                  </h3>
                  <address className="text-stone-600 dark:text-stone-400 text-sm not-italic leading-relaxed">
                    {order.billingAddress?.fullName || order.billingAddress?.name || order.shippingAddress?.fullName}<br />
                    {order.billingAddress?.street || order.billingAddress?.address || order.shippingAddress?.street}<br />
                    {order.billingAddress?.city || order.shippingAddress?.city}, {order.billingAddress?.state || order.shippingAddress?.state} {order.billingAddress?.zipCode || order.shippingAddress?.zipCode}<br />
                    {order.billingAddress?.country || order.shippingAddress?.country}
                  </address>
                </div>
              </div>
            </div>

            {/* Right Column - Status & Info */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {/* Order Status */}
              <div className="bg-white dark:bg-stone-800 p-6 rounded-lg border border-stone-200 dark:border-stone-700">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-stone-800 dark:text-stone-200">Order Status</h3>
                  <span className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-sm font-medium capitalize ${getStatusColor(order.orderStatus || order.status)}`}>
                    {order.orderStatus || order.status}
                  </span>
                </div>

                {/* Progress Bar */}
                  <div className="relative w-full mb-12">
                  <div className="h-2 w-full rounded-full bg-stone-200 dark:bg-stone-700 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-amber-500 transition-all duration-500"
                      style={{ width: `${getStatusProgress(order.orderStatus || order.status)}%` }}
                    ></div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-between px-1">
                    {['pending', 'processing', 'shipped', 'delivered'].map((status, index) => {
                      const currentStatus = order.orderStatus || order.status;
                      const isActive = ['pending', 'processing', 'shipped', 'delivered'].indexOf(currentStatus) >= index;
                      const isCurrent = currentStatus === status;
                      return (
                        <div key={status} className="relative">
                          <div
                            className={`h-4 w-4 rounded-full border-2 border-white dark:border-stone-800 ${
                              isActive ? 'bg-amber-500' : 'bg-stone-200 dark:bg-stone-700'
                            }`}
                          ></div>
                          <span
                            className={`absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-medium capitalize whitespace-nowrap ${
                              isCurrent
                                ? 'text-amber-500'
                                : isActive
                                ? 'text-stone-800 dark:text-stone-200'
                                : 'text-stone-400 dark:text-stone-600'
                            }`}
                          >
                            {status === 'pending' ? 'Placed' : status}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <p className="text-stone-600 dark:text-stone-400 text-sm">
                  {(order.orderStatus || order.status) === 'pending' && 'Your order has been received and is awaiting confirmation.'}
                  {(order.orderStatus || order.status) === 'processing' && 'Your order is being prepared by the artisans and will be shipped soon.'}
                  {(order.orderStatus || order.status) === 'shipped' && 'Your order has been shipped and is on its way to you.'}
                  {(order.orderStatus || order.status) === 'delivered' && 'Your order has been delivered. Enjoy your handcrafted items!'}
                  {(order.orderStatus || order.status) === 'cancelled' && 'This order has been cancelled.'}
                </p>
              </div>

              {/* Payment & Shipping */}
              <div className="bg-white dark:bg-stone-800 p-6 rounded-lg border border-stone-200 dark:border-stone-700">
                <h3 className="text-lg font-bold text-stone-800 dark:text-stone-200 mb-4">
                  Payment & Shipping
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-stone-600 dark:text-stone-400">Shipping Method</span>
                    <span className="text-stone-800 dark:text-stone-200 font-medium">
                      {order.shippingMethod || 'Standard Shipping'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-600 dark:text-stone-400">Payment Method</span>
                    <span className="text-stone-800 dark:text-stone-200 font-medium capitalize">
                      {order.paymentMethod || 'Card Payment'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-600 dark:text-stone-400">Payment Status</span>
                    <span className={`font-medium capitalize ${
                      order.paymentStatus === 'paid' 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-yellow-600 dark:text-yellow-400'
                    }`}>
                      {order.paymentStatus || 'Pending'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Need Help */}
              <div className="bg-white dark:bg-stone-800 p-6 rounded-lg border border-stone-200 dark:border-stone-700">
                <h3 className="text-lg font-bold text-stone-800 dark:text-stone-200 mb-3">
                  Need Help?
                </h3>
                <p className="text-stone-600 dark:text-stone-400 text-sm mb-4">
                  If you have any questions about your order, feel free to reach out.
                </p>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 text-sm font-bold text-amber-500 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                >
                  <HelpCircle className="w-4 h-4" />
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderDetails;
