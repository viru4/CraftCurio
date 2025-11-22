import { Eye, ChevronLeft, ChevronRight } from 'lucide-react';

const OrdersTable = ({ orders, pagination, onViewDetails, onPageChange }) => {
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

  return (
    <div className="bg-white dark:bg-[#2a1e14] rounded-lg shadow-sm overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#f8f7f6] dark:bg-[#221810] border-b border-[#e7d9cf] dark:border-[#4a392b]">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-[#1b130d] dark:text-[#f3ece7] uppercase tracking-wider">
                Order
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-[#1b130d] dark:text-[#f3ece7] uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-[#1b130d] dark:text-[#f3ece7] uppercase tracking-wider">
                Items
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-[#1b130d] dark:text-[#f3ece7] uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-[#1b130d] dark:text-[#f3ece7] uppercase tracking-wider">
                Payment
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-[#1b130d] dark:text-[#f3ece7] uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-[#1b130d] dark:text-[#f3ece7] uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-[#1b130d] dark:text-[#f3ece7] uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e7d9cf] dark:divide-[#4a392b]">
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-[#f8f7f6] dark:hover:bg-[#221810] transition-colors">
                <td className="px-6 py-4">
                  <div className="text-sm font-semibold text-[#1b130d] dark:text-[#f3ece7]">
                    #{order.orderNumber}
                  </div>
                  {order.trackingNumber && (
                    <div className="text-xs text-[#9a6c4c] dark:text-[#a88e79]">
                      Track: {order.trackingNumber}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-[#1b130d] dark:text-[#f3ece7]">
                    {order.shippingAddress?.fullName || 'N/A'}
                  </div>
                  <div className="text-xs text-[#9a6c4c] dark:text-[#a88e79]">
                    {order.shippingAddress?.city}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-[#1b130d] dark:text-[#f3ece7]">
                    {order.items?.length || 0} items
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-semibold text-[#1b130d] dark:text-[#f3ece7]">
                    ₹{order.total?.toLocaleString() || 0}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                    {order.paymentStatus?.charAt(0).toUpperCase() + order.paymentStatus?.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.orderStatus)}`}>
                    {order.orderStatus?.charAt(0).toUpperCase() + order.orderStatus?.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-[#9a6c4c] dark:text-[#a88e79]">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => onViewDetails(order._id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#ec6d13] text-white rounded-lg hover:bg-[#d65d0f] transition-colors text-sm font-medium"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden divide-y divide-[#e7d9cf] dark:divide-[#4a392b]">
        {orders.map((order) => (
          <div key={order._id} className="p-4 hover:bg-[#f8f7f6] dark:hover:bg-[#221810] transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold text-[#1b130d] dark:text-[#f3ece7] mb-1">
                  #{order.orderNumber}
                </h3>
                <p className="text-xs text-[#9a6c4c] dark:text-[#a88e79]">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.orderStatus)}`}>
                {order.orderStatus?.charAt(0).toUpperCase() + order.orderStatus?.slice(1)}
              </span>
            </div>

            <div className="space-y-2 mb-3">
              <div className="flex justify-between text-sm">
                <span className="text-[#9a6c4c] dark:text-[#a88e79]">Customer:</span>
                <span className="text-[#1b130d] dark:text-[#f3ece7] font-medium">
                  {order.shippingAddress?.fullName || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#9a6c4c] dark:text-[#a88e79]">Items:</span>
                <span className="text-[#1b130d] dark:text-[#f3ece7]">{order.items?.length || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#9a6c4c] dark:text-[#a88e79]">Total:</span>
                <span className="text-[#1b130d] dark:text-[#f3ece7] font-semibold">
                  ₹{order.total?.toLocaleString() || 0}
                </span>
              </div>
              <div className="flex justify-between text-sm items-center">
                <span className="text-[#9a6c4c] dark:text-[#a88e79]">Payment:</span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                  {order.paymentStatus?.charAt(0).toUpperCase() + order.paymentStatus?.slice(1)}
                </span>
              </div>
            </div>

            <button
              onClick={() => onViewDetails(order._id)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#ec6d13] text-white rounded-lg hover:bg-[#d65d0f] transition-colors text-sm font-medium"
            >
              <Eye className="w-4 h-4" />
              View Details
            </button>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="px-4 sm:px-6 py-4 border-t border-[#e7d9cf] dark:border-[#4a392b] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-[#9a6c4c] dark:text-[#a88e79]">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} orders
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="inline-flex items-center gap-1 px-3 py-2 border border-[#e7d9cf] dark:border-[#4a392b] rounded-lg hover:bg-[#f8f7f6] dark:hover:bg-[#221810] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium text-[#1b130d] dark:text-[#f3ece7]"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="inline-flex items-center gap-1 px-3 py-2 border border-[#e7d9cf] dark:border-[#4a392b] rounded-lg hover:bg-[#f8f7f6] dark:hover:bg-[#221810] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium text-[#1b130d] dark:text-[#f3ece7]"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersTable;
