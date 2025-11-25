import { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import MobileSidebar from '../components/MobileSidebar';
import AdminHeader from '../components/AdminHeader';
import UsersPageHeader from './components/UsersPageHeader';
import UsersToolbar from './components/UsersToolbar';
import UsersTable from './components/UsersTable';
import AddUserModal from './components/AddUserModal';
import UserActionsModal from './components/UserActionsModal';
import { API_ENDPOINTS } from '../../../utils/api';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isActionsModalOpen, setIsActionsModalOpen] = useState(false);

  const usersPerPage = 10;

  // Fetch users data
  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchQuery, roleFilter, statusFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Build query parameters
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: usersPerPage.toString()
      });

      if (searchQuery) params.append('search', searchQuery);
      if (roleFilter && roleFilter !== 'all') params.append('role', roleFilter);
      if (statusFilter && statusFilter !== 'all') params.append('status', statusFilter);

      // Fetch from admin API
      const response = await fetch(`${API_ENDPOINTS.admin}/users?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();

      setUsers(data.users || []);
      setTotalUsers(data.totalUsers || 0);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
      setTotalUsers(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleRoleFilter = (role) => {
    setRoleFilter(role);
    setCurrentPage(1);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = (checked) => {
    setSelectedUsers(checked ? users.map(u => u._id) : []);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleUserAction = (user) => {
    setSelectedUser(user);
    setIsActionsModalOpen(true);
  };

  const handleUpdateUser = async (userId, updates) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.admin}/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updates)
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      await fetchUsers();
      setIsActionsModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const response = await fetch(`${API_ENDPOINTS.admin}/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      await fetchUsers();
      setIsActionsModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    }
  };

  const handleAddUser = async (userData) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.admin}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        throw new Error('Failed to create user');
      }

      await fetchUsers();
      setIsAddUserModalOpen(false);
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Failed to create user');
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden">
      <div className="flex flex-row min-h-screen w-full">
        {/* Desktop Sidebar */}
        <AdminSidebar />
        
        {/* Mobile Sidebar */}
        <MobileSidebar />

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-h-0 min-w-0 overflow-hidden">
          {/* Header */}
          <AdminHeader />

          {/* Users Content - Scrollable Container */}
          <div className="flex-1 overflow-x-auto overflow-y-auto">
            <div className="min-w-[800px] p-4 md:p-6 lg:p-8 space-y-4 md:space-y-6">
              {/* Page Header */}
              <UsersPageHeader onAddUser={() => setIsAddUserModalOpen(true)} />

              {/* Toolbar */}
              <UsersToolbar
                searchQuery={searchQuery}
                onSearch={handleSearch}
                roleFilter={roleFilter}
                onRoleFilter={handleRoleFilter}
                statusFilter={statusFilter}
                onStatusFilter={handleStatusFilter}
              />

              {/* Users Table */}
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ec6d13]"></div>
                </div>
              ) : (
                <UsersTable
                  users={users}
                  selectedUsers={selectedUsers}
                  onSelectUser={handleSelectUser}
                  onSelectAll={handleSelectAll}
                  onUserAction={handleUserAction}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalUsers={totalUsers}
                  usersPerPage={usersPerPage}
                  onPageChange={handlePageChange}
                />
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      {isAddUserModalOpen && (
        <AddUserModal
          onClose={() => setIsAddUserModalOpen(false)}
          onSubmit={handleAddUser}
        />
      )}

      {isActionsModalOpen && selectedUser && (
        <UserActionsModal
          user={selectedUser}
          onClose={() => {
            setIsActionsModalOpen(false);
            setSelectedUser(null);
          }}
          onUpdate={handleUpdateUser}
          onDelete={handleDeleteUser}
        />
      )}
    </div>
  );
};

export default Users;
