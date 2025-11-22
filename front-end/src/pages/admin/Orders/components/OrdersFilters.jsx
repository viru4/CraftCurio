import { Search, Filter, Download, Calendar } from 'lucide-react';

const OrdersFilters = ({ filters, onFilterChange, onExport }) => {
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const paymentStatusOptions = [
    { value: 'all', label: 'All Payments' },
    { value: 'pending', label: 'Pending' },
    { value: 'paid', label: 'Paid' },
    { value: 'failed', label: 'Failed' },
    { value: 'refunded', label: 'Refunded' }
  ];

  return (
    <div className="bg-white rounded-lg border border-[#e8d5c4] p-4 lg:p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter size={20} className="text-[#ec6d13]" />
        <h3 className="font-semibold text-[#1b130d]">Filters</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b5d54]" size={18} />
          <input
            type="text"
            placeholder="Search orders..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-[#e8d5c4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec6d13] focus:border-transparent"
          />
        </div>

        {/* Order Status */}
        <select
          value={filters.status}
          onChange={(e) => onFilterChange('status', e.target.value)}
          className="px-4 py-2 border border-[#e8d5c4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec6d13] focus:border-transparent"
        >
          {statusOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Payment Status */}
        <select
          value={filters.paymentStatus}
          onChange={(e) => onFilterChange('paymentStatus', e.target.value)}
          className="px-4 py-2 border border-[#e8d5c4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec6d13] focus:border-transparent"
        >
          {paymentStatusOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Export Button */}
        <button
          onClick={onExport}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-[#ec6d13] text-white rounded-lg hover:bg-[#d96012] transition-colors"
        >
          <Download size={18} />
          <span className="hidden sm:inline">Export CSV</span>
          <span className="sm:hidden">Export</span>
        </button>
      </div>

      {/* Date Range */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#6b5d54] mb-2">
            <Calendar size={16} className="inline mr-1" />
            From Date
          </label>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => onFilterChange('dateFrom', e.target.value)}
            className="w-full px-4 py-2 border border-[#e8d5c4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec6d13] focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#6b5d54] mb-2">
            <Calendar size={16} className="inline mr-1" />
            To Date
          </label>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => onFilterChange('dateTo', e.target.value)}
            className="w-full px-4 py-2 border border-[#e8d5c4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec6d13] focus:border-transparent"
          />
        </div>
      </div>

      {/* Clear Filters */}
      {(filters.search || filters.status !== 'all' || filters.paymentStatus !== 'all' || filters.dateFrom || filters.dateTo) && (
        <button
          onClick={() => {
            onFilterChange('search', '');
            onFilterChange('status', 'all');
            onFilterChange('paymentStatus', 'all');
            onFilterChange('dateFrom', '');
            onFilterChange('dateTo', '');
          }}
          className="mt-4 text-sm text-[#ec6d13] hover:underline"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
};

export default OrdersFilters;
