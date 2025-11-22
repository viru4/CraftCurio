import { Search, Filter, Calendar } from 'lucide-react';

const OrdersFilters = ({ filters, onFilterChange }) => {
  return (
    <div className="bg-white dark:bg-[#2a1e14] rounded-lg shadow-sm p-4 mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9a6c4c] dark:text-[#a88e79]" />
          <input
            type="text"
            placeholder="Search by order number..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#e7d9cf] dark:border-[#4a392b] bg-[#f8f7f6] dark:bg-[#221810] text-[#1b130d] dark:text-[#f3ece7] placeholder-[#9a6c4c] dark:placeholder-[#a88e79] focus:ring-2 focus:ring-[#ec6d13] focus:border-transparent transition-colors text-sm"
          />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9a6c4c] dark:text-[#a88e79]" />
          <select
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#e7d9cf] dark:border-[#4a392b] bg-[#f8f7f6] dark:bg-[#221810] text-[#1b130d] dark:text-[#f3ece7] focus:ring-2 focus:ring-[#ec6d13] focus:border-transparent transition-colors text-sm appearance-none cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Date From */}
        <div className="relative">
          <label className="block text-xs font-medium text-[#9a6c4c] dark:text-[#a88e79] mb-1.5 ml-1">
            From Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9a6c4c] dark:text-[#a88e79]" />
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => onFilterChange('dateFrom', e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#e7d9cf] dark:border-[#4a392b] bg-[#f8f7f6] dark:bg-[#221810] text-[#1b130d] dark:text-[#f3ece7] focus:ring-2 focus:ring-[#ec6d13] focus:border-transparent transition-colors text-sm"
            />
          </div>
        </div>

        {/* Date To */}
        <div className="relative">
          <label className="block text-xs font-medium text-[#9a6c4c] dark:text-[#a88e79] mb-1.5 ml-1">
            To Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9a6c4c] dark:text-[#a88e79]" />
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => onFilterChange('dateTo', e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#e7d9cf] dark:border-[#4a392b] bg-[#f8f7f6] dark:bg-[#221810] text-[#1b130d] dark:text-[#f3ece7] focus:ring-2 focus:ring-[#ec6d13] focus:border-transparent transition-colors text-sm"
            />
          </div>
        </div>
      </div>

      {/* Clear Filters */}
      {(filters.status !== 'all' || filters.search || filters.dateFrom || filters.dateTo) && (
        <button
          onClick={() => {
            onFilterChange('status', 'all');
            onFilterChange('search', '');
            onFilterChange('dateFrom', '');
            onFilterChange('dateTo', '');
          }}
          className="mt-4 text-sm text-[#ec6d13] hover:underline font-medium"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
};

export default OrdersFilters;
