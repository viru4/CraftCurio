import { MoreHorizontal } from 'lucide-react';
import { formatDate } from '../../../../lib/date';

const UserTableRow = ({ user, isSelected, onSelect, onAction }) => {
  const getRoleBadge = (role) => {
    const badges = {
      artisan: 'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200',
      collector: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200',
      admin: 'bg-[#ec6d13]/20 text-[#ec6d13] dark:bg-[#ec6d13]/30 dark:text-orange-300'
    };
    return badges[role] || 'bg-gray-100 text-gray-800';
  };

  const getStatusBadge = () => {
    if (user.isSuspended) {
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
    }
    if (!user.isVerified) {
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    }
    if (user.isActive) {
      return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200';
    }
    return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  };

  const getStatusText = () => {
    if (user.isSuspended) return 'Suspended';
    if (!user.isVerified) return 'Pending Approval';
    if (user.isActive) return 'Active';
    return 'Inactive';
  };

  return (
    <tr className="hover:bg-[#f8f7f6] dark:hover:bg-[#221810] transition-colors">
      <td className="p-2 sm:p-3 md:p-4 text-center">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          className="h-4 w-4 sm:h-5 sm:w-5 rounded border-[#e7d9cf] dark:border-[#4a392b] bg-transparent text-[#ec6d13] focus:ring-[#ec6d13] focus:ring-offset-0"
        />
      </td>
      <td className="p-2 sm:p-3 md:p-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-cover bg-center bg-no-repeat flex-shrink-0"
            style={{
              backgroundImage: user.avatar
                ? `url(${user.avatar})`
                : 'url(https://i.pravatar.cc/150?img=placeholder)'
            }}
          />
          <div className="min-w-0">
            <p className="font-medium text-[#1b130d] dark:text-[#f3ece7] truncate">
              {user.name}
            </p>
            <p className="text-[#9a6c4c] dark:text-[#a88e79] text-xs sm:text-sm truncate">
              {user.email}
            </p>
          </div>
        </div>
      </td>
      <td className="p-2 sm:p-3 md:p-4">
        <span className={`inline-flex items-center px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg text-xs font-medium ${getRoleBadge(user.role)}`}>
          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
        </span>
      </td>
      <td className="p-2 sm:p-3 md:p-4">
        <span className={`inline-flex items-center px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg text-xs font-medium ${getStatusBadge()}`}>
          {getStatusText()}
        </span>
      </td>
      <td className="p-2 sm:p-3 md:p-4 text-[#9a6c4c] dark:text-[#a88e79] text-xs sm:text-sm whitespace-nowrap">
        {formatDate(user.createdAt)}
      </td>
      <td className="p-2 sm:p-3 md:p-4 text-right">
        <button
          onClick={onAction}
          className="inline-flex items-center justify-center h-7 w-7 sm:h-8 sm:w-8 rounded-lg hover:bg-[#f8f7f6] dark:hover:bg-[#221810] text-[#9a6c4c] dark:text-[#a88e79] hover:text-[#1b130d] dark:hover:text-[#f3ece7] transition-colors"
        >
          <MoreHorizontal className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
      </td>
    </tr>
  );
};

export default UserTableRow;
