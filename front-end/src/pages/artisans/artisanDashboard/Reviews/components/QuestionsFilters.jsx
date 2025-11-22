import { Search, Filter } from 'lucide-react';

const QuestionsFilters = ({ filters, setFilters }) => {
  const handleClearFilters = () => {
    setFilters({
      status: 'all',
      search: '',
      sortBy: 'createdAt',
      order: 'desc',
      page: 1,
      limit: 10
    });
  };

  const hasActiveFilters = 
    filters.status !== 'all' || 
    filters.search !== '';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#e8d5c4] p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-[#ec6d13]" />
        <h3 className="text-lg font-semibold text-[#1b130d]">Filters</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9a6c4c]" />
          <input
            type="text"
            placeholder="Search questions..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
            className="w-full pl-10 pr-4 py-2.5 border border-[#e8d5c4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec6d13] focus:border-transparent text-sm"
          />
        </div>

        {/* Status Filter */}
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
          className="px-4 py-2.5 border border-[#e8d5c4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec6d13] focus:border-transparent text-sm"
        >
          <option value="all">All Questions</option>
          <option value="pending">Pending</option>
          <option value="answered">Answered</option>
          <option value="archived">Archived</option>
        </select>

        {/* Sort By */}
        <select
          value={`${filters.sortBy}-${filters.order}`}
          onChange={(e) => {
            const [sortBy, order] = e.target.value.split('-');
            setFilters({ ...filters, sortBy, order, page: 1 });
          }}
          className="px-4 py-2.5 border border-[#e8d5c4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec6d13] focus:border-transparent text-sm"
        >
          <option value="createdAt-desc">Newest First</option>
          <option value="createdAt-asc">Oldest First</option>
          <option value="helpful-desc">Most Helpful</option>
        </select>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 text-sm text-[#ec6d13] hover:bg-[#ec6d13]/5 rounded-lg transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default QuestionsFilters;
