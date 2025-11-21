import { Search, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const UsersToolbar = ({
  searchQuery,
  onSearch,
  roleFilter,
  onRoleFilter,
  statusFilter,
  onStatusFilter
}) => {
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const roleDropdownRef = useRef(null);
  const statusDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(event.target)) {
        setRoleDropdownOpen(false);
      }
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target)) {
        setStatusDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const roleOptions = [
    { value: 'all', label: 'All Roles' },
    { value: 'admin', label: 'Admin' },
    { value: 'artisan', label: 'Artisan' },
    { value: 'collector', label: 'Collector' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'suspended', label: 'Suspended' },
    { value: 'pending', label: 'Pending Approval' }
  ];

  const getRoleLabel = () => roleOptions.find(opt => opt.value === roleFilter)?.label || 'All Roles';
  const getStatusLabel = () => statusOptions.find(opt => opt.value === statusFilter)?.label || 'All Status';

  return (
    <div className="bg-white dark:bg-[#2a1e14] p-3 sm:p-4 rounded-xl border border-[#e7d9cf] dark:border-[#4a392b] mb-4 md:mb-6">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
        {/* Search Bar */}
        <div className="flex-grow min-w-0 sm:min-w-[200px] md:min-w-[250px]">
          <div className="relative h-10 sm:h-12">
            <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
              <Search className="h-4 w-4 sm:h-5 sm:w-5 text-[#9a6c4c] dark:text-[#a88e79]" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              className="block w-full h-full pl-10 sm:pl-12 pr-3 sm:pr-4 rounded-lg border border-[#e7d9cf] dark:border-[#4a392b] bg-[#f8f7f6] dark:bg-[#221810] text-[#1b130d] dark:text-[#f3ece7] placeholder-[#9a6c4c] dark:placeholder-[#a88e79] focus:ring-2 focus:ring-[#ec6d13] focus:border-transparent text-xs sm:text-sm"
              placeholder="Search by name or email..."
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap sm:flex-nowrap gap-2 sm:gap-3">
          {/* Role Filter */}
          <div className="relative flex-1 sm:flex-none" ref={roleDropdownRef}>
            <button
              type="button"
              onClick={() => {
                setRoleDropdownOpen(!roleDropdownOpen);
                setStatusDropdownOpen(false);
              }}
              className={`flex h-10 sm:h-12 w-full sm:w-auto items-center justify-between gap-x-1.5 sm:gap-x-2 rounded-lg border transition-colors pl-3 sm:pl-4 pr-2 sm:pr-3 min-w-[120px] sm:min-w-[140px] ${
                roleFilter !== 'all'
                  ? 'bg-[#ec6d13]/10 border-[#ec6d13] text-[#ec6d13]'
                  : 'bg-[#f8f7f6] dark:bg-[#221810] border-[#e7d9cf] dark:border-[#4a392b]'
              }`}
            >
              <span className={`text-xs sm:text-sm font-medium truncate ${roleFilter !== 'all' ? 'text-[#ec6d13]' : 'text-[#1b130d] dark:text-[#f3ece7]'}`}>
                {getRoleLabel()}
              </span>
              <ChevronDown className={`h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform flex-shrink-0 ${roleDropdownOpen ? 'rotate-180' : ''} ${roleFilter !== 'all' ? 'text-[#ec6d13]' : 'text-[#9a6c4c] dark:text-[#a88e79]'}`} />
            </button>
            {roleDropdownOpen && (
              <div className="absolute z-50 mt-2 w-full sm:w-48 rounded-lg bg-white dark:bg-[#2a1e14] border border-[#e7d9cf] dark:border-[#4a392b] shadow-xl overflow-hidden">
                {roleOptions.map((option, index) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onRoleFilter(option.value);
                      setRoleDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                      index > 0 ? 'border-t border-[#e7d9cf] dark:border-[#4a392b]' : ''
                    } ${
                      roleFilter === option.value
                        ? 'bg-[#ec6d13]/10 text-[#ec6d13] font-medium'
                        : 'text-[#1b130d] dark:text-[#f3ece7] hover:bg-[#f8f7f6] dark:hover:bg-[#221810]'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Status Filter */}
          <div className="relative flex-1 sm:flex-none" ref={statusDropdownRef}>
            <button
              type="button"
              onClick={() => {
                setStatusDropdownOpen(!statusDropdownOpen);
                setRoleDropdownOpen(false);
              }}
              className={`flex h-10 sm:h-12 w-full sm:w-auto items-center justify-between gap-x-1.5 sm:gap-x-2 rounded-lg border transition-colors pl-3 sm:pl-4 pr-2 sm:pr-3 min-w-[140px] sm:min-w-[160px] ${
                statusFilter !== 'all'
                  ? 'bg-[#ec6d13]/10 border-[#ec6d13] text-[#ec6d13]'
                  : 'bg-[#f8f7f6] dark:bg-[#221810] border-[#e7d9cf] dark:border-[#4a392b]'
              }`}
            >
              <span className={`text-xs sm:text-sm font-medium truncate ${statusFilter !== 'all' ? 'text-[#ec6d13]' : 'text-[#1b130d] dark:text-[#f3ece7]'}`}>
                {getStatusLabel()}
              </span>
              <ChevronDown className={`h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform flex-shrink-0 ${statusDropdownOpen ? 'rotate-180' : ''} ${statusFilter !== 'all' ? 'text-[#ec6d13]' : 'text-[#9a6c4c] dark:text-[#a88e79]'}`} />
            </button>
            {statusDropdownOpen && (
              <div className="absolute z-50 mt-2 w-full sm:w-52 rounded-lg bg-white dark:bg-[#2a1e14] border border-[#e7d9cf] dark:border-[#4a392b] shadow-xl overflow-hidden">
                {statusOptions.map((option, index) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onStatusFilter(option.value);
                      setStatusDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                      index > 0 ? 'border-t border-[#e7d9cf] dark:border-[#4a392b]' : ''
                    } ${
                      statusFilter === option.value
                        ? 'bg-[#ec6d13]/10 text-[#ec6d13] font-medium'
                        : 'text-[#1b130d] dark:text-[#f3ece7] hover:bg-[#f8f7f6] dark:hover:bg-[#221810]'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersToolbar;
