import { Eye, ChevronLeft, ChevronRight, Package } from 'lucide-react';
import { format } from 'date-fns';

const OrdersTable = ({
  orders,
  loading,
  selectedOrders,
  onSelectOrder,
  onSelectAll,
  onViewDetails,
  pagination,
  onPageChange
}) => {
  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
      processing: 'bg-purple-50 text-purple-700 border-purple-200',
      shipped: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      delivered: 'bg-green-50 text-green-700 border-green-200',
      cancelled: 'bg-red-50 text-red-700 border-red-200'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusConfig[status] || statusConfig.pending}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getPaymentBadge = (status) => {
    const statusConfig = {
      pending: 'bg-orange-50 text-orange-700 border-orange-200',
      paid: 'bg-green-50 text-green-700 border-green-200',
      failed: 'bg-red-50 text-red-700 border-red-200',
      refunded: 'bg-gray-50 text-gray-700 border-gray-200'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusConfig[status] || statusConfig.pending}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-[#e8d5c4] p-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ec6d13] mx-auto"></div>
        <p className="text-[#6b5d54] mt-4">Loading orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-[#e8d5c4] p-12 text-center">
        <Package size={48} className="mx-auto text-[#e8d5c4] mb-4" />
        <p className="text-[#6b5d54]">No orders found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-[#e8d5c4] overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#f8f7f6] border-b border-[#e8d5c4]">
            <tr>
              <th className="px-6 py-4 text-left">
                <input
                  type="checkbox"
                  checked={selectedOrders.length === orders.length}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  className="w-4 h-4 text-[#ec6d13] border-[#e8d5c4] rounded focus:ring-[#ec6d13]"
                />
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#1b130d]">Order #</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#1b130d]">Customer</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#1b130d]">Date</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#1b130d]">Items</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#1b130d]">Total</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#1b130d]">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#1b130d]">Payment</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#1b130d]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e8d5c4]">
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-[#f8f7f6] transition-colors">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedOrders.includes(order._id)}
                    onChange={() => onSelectOrder(order._id)}
                    className="w-4 h-4 text-[#ec6d13] border-[#e8d5c4] rounded focus:ring-[#ec6d13]"
                  />
                </td>
                <td className="px-6 py-4">
                  <span className="font-mono text-sm text-[#1b130d]">{order.orderNumber}</span>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-[#1b130d]">{order.shippingAddress.fullName}</p>
                    <p className="text-sm text-[#6b5d54]">{order.user?.email}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-[#6b5d54]">
                  {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                </td>
                <td className="px-6 py-4 text-sm text-[#6b5d54]">
                  {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                </td>
                <td className="px-6 py-4 font-medium text-[#1b130d]">
                  ${order.total.toFixed(2)}
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(order.orderStatus)}
                </td>
                <td className="px-6 py-4">
                  {getPaymentBadge(order.paymentStatus)}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => onViewDetails(order)}
                    className="p-2 text-[#ec6d13] hover:bg-[#ec6d13] hover:text-white rounded-lg transition-colors"
                    title="View Details"
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden divide-y divide-[#e8d5c4]">
        {orders.map((order) => (
          <div key={order._id} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={selectedOrders.includes(order._id)}
                  onChange={() => onSelectOrder(order._id)}
                  className="mt-1 w-4 h-4 text-[#ec6d13] border-[#e8d5c4] rounded focus:ring-[#ec6d13]"
                />
                <div>
                  <p className="font-mono text-sm font-medium text-[#1b130d]">{order.orderNumber}</p>
                  <p className="text-sm text-[#6b5d54]">{format(new Date(order.createdAt), 'MMM dd, yyyy')}</p>
                </div>
              </div>
              <button
                onClick={() => onViewDetails(order)}
                className="p-2 text-[#ec6d13] hover:bg-[#f8f7f6] rounded-lg transition-colors"
              >
                <Eye size={18} />
              </button>
            </div>
            
            <div className="space-y-2 mb-3">
              <div>
                <p className="font-medium text-[#1b130d]">{order.shippingAddress.fullName}</p>
                <p className="text-sm text-[#6b5d54]">{order.items.length} items • ${order.total.toFixed(2)}</p>
              </div>
              <div className="flex gap-2">
                {getStatusBadge(order.orderStatus)}
                {getPaymentBadge(order.paymentStatus)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="border-t border-[#e8d5c4] px-6 py-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#6b5d54]">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
              {pagination.total} orders
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => onPageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="p-2 border border-[#e8d5c4] rounded-lg hover:bg-[#f8f7f6] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <div className="flex items-center px-4 py-2 border border-[#e8d5c4] rounded-lg bg-[#f8f7f6]">
                <span className="text-sm font-medium text-[#1b130d]">
                  {pagination.page} / {pagination.totalPages}
                </span>
              </div>
              <button
                onClick={() => onPageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="p-2 border border-[#e8d5c4] rounded-lg hover:bg-[#f8f7f6] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersTable;
