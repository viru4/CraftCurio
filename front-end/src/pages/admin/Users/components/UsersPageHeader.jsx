import { Plus } from 'lucide-react';

const UsersPageHeader = ({ onAddUser }) => {
  return (
    <div className="mb-4 md:mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 md:gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#1b130d] dark:text-[#f3ece7] truncate">
            User & Role Management
          </h1>
          <p className="text-sm md:text-base text-[#9a6c4c] dark:text-[#a88e79] mt-1">
            Manage all platform users, roles, and permissions.
          </p>
        </div>
        <button
          onClick={onAddUser}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg bg-[#ec6d13] text-white text-sm font-medium hover:bg-[#d55a0a] transition-colors whitespace-nowrap flex-shrink-0"
        >
          <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="hidden xs:inline">Add New User</span>
          <span className="xs:hidden">Add User</span>
        </button>
      </div>
    </div>
  );
};

export default UsersPageHeader;
