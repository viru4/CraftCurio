# Users Management Page - Documentation

## Overview
The Users Management page provides a comprehensive interface for admin users to manage all platform users, roles, and permissions in the CraftCurio admin dashboard.

## Components Structure

```
Users/
├── Users.jsx                    # Main container component
└── components/
    ├── UsersPageHeader.jsx      # Page title and "Add User" button
    ├── UsersToolbar.jsx         # Search bar and filter dropdowns
    ├── UsersTable.jsx           # Table container with pagination
    ├── UserTableRow.jsx         # Individual user row
    ├── AddUserModal.jsx         # Modal for creating new users
    └── UserActionsModal.jsx     # Modal for user actions (edit, delete, suspend)
```

## Features

### 1. **User Listing**
- Displays all platform users in a paginated table
- Shows user avatar, name, email, role, status, and join date
- Supports bulk selection with checkboxes
- Hover effects for better UX

### 2. **Search & Filters**
- **Search**: Real-time search by name or email
- **Role Filter**: Filter by role (All, Admin, Artisan, Collector)
- **Status Filter**: Filter by status (All, Active, Suspended, Pending Approval)

### 3. **User Management Actions**
- **Add User**: Create new users with name, email, password, role
- **Edit User**: Update user details, role, and status flags
- **Suspend/Unsuspend**: Temporarily disable user access
- **Verify/Revoke**: Manage user verification status
- **Delete User**: Permanently remove users (with confirmation)

### 4. **Pagination**
- Shows 10 users per page
- Previous/Next navigation
- Direct page number selection
- Shows total users count

### 5. **Responsive Design**
- Mobile-first approach
- Stacked layouts on small screens
- Horizontal scrolling for tables on mobile
- Touch-friendly buttons and interactions

## User Roles

- **Admin**: Full platform access
- **Artisan**: Product sellers/creators
- **Collector**: Buyers/collectors

## User Status

- **Active**: User can access the platform
- **Suspended**: User temporarily blocked
- **Pending Approval**: New user awaiting verification

## API Integration

The page integrates with the following endpoints:

```javascript
// Fetch users
GET /api/auth/users

// Create user
POST /api/auth/register

// Update user
PATCH /api/auth/users/:id

// Delete user
DELETE /api/auth/users/:id
```

## Usage

### Navigation
Access the page via the admin sidebar:
- Navigate to `/admin/users`
- Click "Users" in the admin sidebar

### Adding a User
1. Click "Add New User" button
2. Fill in required fields (name, email, password, role)
3. Optionally set "active" status
4. Click "Create User"

### Managing Users
1. Click the "⋯" (three dots) button on any user row
2. Select an action:
   - **Edit User Details**: Modify user information
   - **Verify/Revoke**: Change verification status
   - **Suspend/Unsuspend**: Toggle suspension
   - **Delete**: Remove user permanently

### Searching Users
- Type in the search box to filter by name or email
- Results update in real-time

### Filtering Users
- Click "Role: All" dropdown to filter by role
- Click "Status: All" dropdown to filter by status
- Combine filters for refined results

## Styling

The page uses CraftCurio's design system:
- **Primary Color**: `#ec6d13` (orange)
- **Background Light**: `#f8f7f6`
- **Background Dark**: `#221810`
- **Card Light**: `#fcfaf8`
- **Card Dark**: `#2a1e14`
- **Border Light**: `#e7d9cf`
- **Border Dark**: `#4a392b`

## State Management

The main Users component manages:
- `users`: Array of user objects
- `loading`: Loading state for API calls
- `searchQuery`: Current search term
- `roleFilter`: Selected role filter
- `statusFilter`: Selected status filter
- `selectedUsers`: Array of selected user IDs (for bulk actions)
- `currentPage`: Current pagination page
- `totalPages`: Total number of pages
- `totalUsers`: Total user count
- `isAddUserModalOpen`: Add user modal visibility
- `selectedUser`: Currently selected user for actions
- `isActionsModalOpen`: Actions modal visibility

## Error Handling

- Displays fallback mock data if API fails
- Shows user-friendly error messages
- Validates form inputs before submission
- Confirms destructive actions (delete)

## Accessibility

- Semantic HTML structure
- Keyboard navigation support
- ARIA labels where needed
- Focus management in modals
- Color contrast compliance

## Future Enhancements

- Bulk actions (delete multiple users)
- Export users to CSV
- Advanced filters (date range, last login)
- User activity logs
- Role permissions management
- Email verification system
- Password reset functionality

## Troubleshooting

### Users not loading
- Check network tab for API errors
- Verify authentication token is valid
- Ensure backend is running on port 8000

### Filters not working
- Clear browser cache
- Check console for JavaScript errors
- Verify filter state is updating

### Modal not closing
- Click outside modal or press ESC
- Check for JavaScript errors
- Ensure event handlers are attached

## Dependencies

- React (hooks: useState, useEffect, useRef)
- React Router (Link, useNavigate)
- Lucide React (icons)
- API configuration from `@/config/api`

