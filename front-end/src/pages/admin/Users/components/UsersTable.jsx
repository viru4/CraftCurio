import { MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import UserTableRow from './UserTableRow';

const UsersTable = ({
  users,
  selectedUsers,
  onSelectUser,
  onSelectAll,
  onUserAction,
  currentPage,
  totalPages,
  totalUsers,
  usersPerPage,
  onPageChange
}) => {
  const allSelected = users.length > 0 && users.every(u => selectedUsers.includes(u._id));
  const startIndex = (currentPage - 1) * usersPerPage + 1;
  const endIndex = Math.min(currentPage * usersPerPage, totalUsers);

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="overflow-hidden rounded-lg sm:rounded-xl border border-[#e7d9cf] dark:border-[#4a392b] bg-white dark:bg-[#2a1e14] shadow-sm">
      {/* Table - Horizontal Scroll Wrapper */}
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-[#ec6d13] scrollbar-track-[#f8f7f6] dark:scrollbar-track-[#221810]">
        <table className="w-full min-w-[700px] sm:min-w-[800px] text-xs sm:text-sm">
          <thead className="bg-[#f8f7f6] dark:bg-[#221810]">
            <tr>
              <th className="p-2 sm:p-3 md:p-4 w-10 sm:w-12 text-center">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  className="h-4 w-4 sm:h-5 sm:w-5 rounded border-[#e7d9cf] dark:border-[#4a392b] bg-transparent text-[#ec6d13] focus:ring-[#ec6d13] focus:ring-offset-0"
                />
              </th>
              <th className="p-2 sm:p-3 md:p-4 text-left font-medium text-[#1b130d] dark:text-[#f3ece7] whitespace-nowrap min-w-[180px] sm:min-w-[200px]">
                User
              </th>
              <th className="p-2 sm:p-3 md:p-4 text-left font-medium text-[#1b130d] dark:text-[#f3ece7] whitespace-nowrap min-w-[90px] sm:min-w-[100px]">
                Role
              </th>
              <th className="p-2 sm:p-3 md:p-4 text-left font-medium text-[#1b130d] dark:text-[#f3ece7] whitespace-nowrap min-w-[90px] sm:min-w-[100px]">
                Status
              </th>
              <th className="p-2 sm:p-3 md:p-4 text-left font-medium text-[#1b130d] dark:text-[#f3ece7] whitespace-nowrap min-w-[110px] sm:min-w-[120px]">
                Joined On
              </th>
              <th className="p-2 sm:p-3 md:p-4 text-right font-medium text-[#1b130d] dark:text-[#f3ece7] whitespace-nowrap min-w-[70px] sm:min-w-[80px]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e7d9cf] dark:divide-[#4a392b]">
            {users.length > 0 ? (
              users.map((user) => (
                <UserTableRow
                  key={user._id}
                  user={user}
                  isSelected={selectedUsers.includes(user._id)}
                  onSelect={() => onSelectUser(user._id)}
                  onAction={() => onUserAction(user)}
                />
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-8 text-center text-[#9a6c4c] dark:text-[#a88e79]">
                  No users found matching your criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {users.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 border-t border-[#e7d9cf] dark:border-[#4a392b]">
          <p className="text-xs sm:text-sm text-[#9a6c4c] dark:text-[#a88e79]">
            Showing {startIndex} to {endIndex} of {totalUsers} users
          </p>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center justify-center h-7 w-7 sm:h-8 sm:w-8 rounded-lg border border-[#e7d9cf] dark:border-[#4a392b] bg-transparent text-[#1b130d] dark:text-[#f3ece7] hover:bg-[#ec6d13]/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>
            {getPageNumbers().map((page, index) => (
              typeof page === 'number' ? (
                <button
                  key={index}
                  onClick={() => onPageChange(page)}
                  className={`flex items-center justify-center h-7 sm:h-8 min-w-[1.75rem] sm:min-w-[2rem] px-1.5 sm:px-2 text-xs sm:text-sm rounded-lg border border-[#e7d9cf] dark:border-[#4a392b] transition-colors ${
                    currentPage === page
                      ? 'bg-[#ec6d13]/20 text-[#ec6d13] font-medium'
                      : 'bg-transparent text-[#1b130d] dark:text-[#f3ece7] hover:bg-[#ec6d13]/10'
                  }`}
                >
                  {page}
                </button>
              ) : (
                <span key={index} className="text-[#9a6c4c] dark:text-[#a88e79] px-1">
                  {page}
                </span>
              )
            ))}
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center justify-center h-7 w-7 sm:h-8 sm:w-8 rounded-lg border border-[#e7d9cf] dark:border-[#4a392b] bg-transparent text-[#1b130d] dark:text-[#f3ece7] hover:bg-[#ec6d13]/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersTable;
