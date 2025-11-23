# Admin Login Guide - CraftCurio

## Overview

This guide explains how administrators can log in and access the admin panel in CraftCurio. The app uses role-based access control (RBAC) where users with the `admin` role have access to administrative features.

## Admin User Roles

CraftCurio has 4 user roles:
- `buyer` - Regular customers (default)
- `artisan` - Artisan sellers
- `collector` - Collector sellers
- `admin` - Administrators (full access)

## Creating an Admin User

### Method 1: Using the Script (Recommended)

Run the following command in the `backend` directory:

```bash
cd backend
npm run create-admin
```

This creates an admin user with:
- **Email**: `admin@craftcurio.com`
- **Password**: `admin123`
- **Role**: `admin`

⚠️ **Important**: Change the password after first login!

### Method 2: Manually via Database

If you want to create an admin with custom credentials, you can:

1. Create a regular user via sign-up
2. Update their role in MongoDB:

```javascript
db.users.updateOne(
  { email: "youremail@example.com" },
  { $set: { role: "admin" } }
)
```

### Method 3: Using the Admin Script with Custom Credentials

Edit `backend/scripts/createAdminUser.js` and change:

```javascript
const adminEmail = 'your-email@example.com';
const adminPassword = 'your-secure-password';
```

Then run: `npm run create-admin`

## Admin Login Process

### Using OTP Sign-In (Current Method)

1. **Navigate to Sign-In Page**
   - Go to: `http://localhost:5174/sign-in` (or your frontend URL)

2. **Enter Admin Email**
   - Enter the admin email: `admin@craftcurio.com`
   - Click **"Send OTP"**

3. **Get OTP Code**
   - Check the backend terminal console for the OTP
   - Or check the email inbox (if email service is configured)
   - The OTP is valid for 10 minutes

4. **Enter OTP**
   - Enter the 6-digit OTP code
   - Click **"Verify OTP"** or it will auto-submit

5. **Access Admin Panel**
   - After successful login, you'll be redirected to the home page
   - Navigate to: `/admin` to access the admin dashboard

### Alternative: Password-Based Login (If Implemented)

If you implement password-based login alongside OTP:

1. Go to sign-in page
2. Enter email: `admin@craftcurio.com`
3. Enter password: `admin123`
4. Click "Sign In"

## Admin Routes & Features

Once logged in as admin, you have access to:

### Protected Admin Routes

All these routes require `admin` role:

- `/admin` - Admin Dashboard
- `/admin/products` - Manage Products
- `/admin/products/edit/:id` - Edit Product
- `/admin/users` - User Management
- `/admin/orders` - Order Management
- `/admin/verifications` - Verification Requests
- `/admin/content` - Content & Stories Management

### Admin API Endpoints

Backend admin endpoints (all require admin authentication):

```javascript
GET    /api/admin/users          // Get all users
GET    /api/admin/users/:id      // Get user by ID
POST   /api/admin/users          // Create new user
PATCH  /api/admin/users/:id      // Update user
DELETE /api/admin/users/:id      // Delete user

GET    /api/verification/requests        // Get verification requests
PUT    /api/verification/requests/:id/approve
PUT    /api/verification/requests/:id/reject

GET    /api/orders/all                   // Get all orders
PATCH  /api/orders/:id/status            // Update order status
PATCH  /api/orders/:id/payment           // Update payment status
```

## Security Features

### Role-Based Access Control (RBAC)

**Frontend Protection**:
- Admin routes use `<ProtectedRoute allowedRoles={['admin']}>` wrapper
- Unauthorized users see "Access Denied" message
- Non-admin users are prevented from accessing admin pages

**Backend Protection**:
- All admin routes use `authenticate` + `requireAdmin` middleware
- API returns 403 Forbidden for non-admin users
- Token verification ensures valid authentication

### Authentication Flow

```
User Login → OTP Sent → OTP Verified → JWT Token Issued → Role Checked → Access Granted/Denied
```

### Role Checking

```javascript
// Backend middleware
export const requireAdmin = requireRole('admin');

// Frontend context
const { isAdmin, user } = useAuth();
// isAdmin returns true only if user.role === 'admin'
```

## Testing Admin Access

### 1. Create Admin User
```bash
cd backend
npm run create-admin
```

### 2. Start Servers
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend  
cd front-end
npm run dev
```

### 3. Login as Admin
- Go to: `http://localhost:5174/sign-in`
- Email: `admin@craftcurio.com`
- Get OTP from backend console
- Enter OTP and verify

### 4. Access Admin Panel
- Navigate to: `http://localhost:5174/admin`
- You should see the admin dashboard

### 5. Test Non-Admin Access
- Create a regular buyer account
- Try accessing `/admin`
- You should see "Access Denied"

## Troubleshooting

### Issue: "Access Denied" when logged in as admin

**Check:**
1. User role is correctly set to 'admin' in database
2. Token includes correct user data
3. Check browser console for errors
4. Verify localStorage has correct user data:
   ```javascript
   JSON.parse(localStorage.getItem('user'))
   ```

### Issue: Admin routes return 403 Forbidden

**Check:**
1. Backend middleware is properly configured
2. JWT token is being sent with requests
3. Token is valid and not expired
4. User role in token payload is 'admin'

### Issue: Can't create admin user

**Check:**
1. MongoDB connection is working
2. `.env` file has correct `MONGODB_URI`
3. Script has proper permissions
4. User doesn't already exist with that email

## Changing Admin Password

### Via Sign-Up Flow with New Email
1. Create a new admin user with a different email
2. Use that for secure access

### Via Database (Manual)
```javascript
// In MongoDB shell or Compass
const bcrypt = require('bcryptjs');
const newPassword = 'YourSecurePassword123!';
const hashedPassword = bcrypt.hashSync(newPassword, 10);

db.users.updateOne(
  { email: "admin@craftcurio.com" },
  { $set: { password: hashedPassword } }
)
```

### Via Script (Update createAdminUser.js)
1. Edit `backend/scripts/createAdminUser.js`
2. Change `adminPassword` variable
3. Run: `npm run create-admin`

## Best Practices

### Production Deployment

1. **Change Default Credentials**
   - Never use `admin123` in production
   - Use strong passwords (16+ characters)

2. **Environment Variables**
   - Store admin credentials in `.env`
   - Never commit credentials to git

3. **Multi-Factor Authentication**
   - OTP-based login adds security
   - Consider adding 2FA for admin accounts

4. **Audit Logging**
   - Log all admin actions
   - Monitor for suspicious activity

5. **Rate Limiting**
   - Implement rate limiting on admin routes
   - Prevent brute force attacks

6. **HTTPS Only**
   - Always use HTTPS in production
   - Secure cookie transmission

## Admin Permissions Matrix

| Feature | Admin | Artisan | Collector | Buyer |
|---------|-------|---------|-----------|-------|
| User Management | ✅ | ❌ | ❌ | ❌ |
| Order Management | ✅ | Own Only | Own Only | Own Only |
| Product Management | ✅ | Own Only | Own Only | ❌ |
| Verification Approval | ✅ | ❌ | ❌ | ❌ |
| Content Management | ✅ | ❌ | ❌ | ❌ |
| View All Orders | ✅ | ❌ | ❌ | ❌ |
| Delete Users | ✅ | ❌ | ❌ | ❌ |

## Quick Reference

### Admin Credentials (Default)
```
Email: admin@craftcurio.com
Password: admin123
```

### Create Admin Command
```bash
npm run create-admin
```

### Admin Dashboard URL
```
http://localhost:5174/admin
```

### Check User Role in Console
```javascript
// Frontend console
console.log(JSON.parse(localStorage.getItem('user')).role);
```

### Verify Admin in Backend
```javascript
// In MongoDB shell
db.users.findOne({ email: "admin@craftcurio.com" })
```

---

## Need Help?

If you encounter issues:
1. Check backend console for errors
2. Verify database connection
3. Ensure servers are running
4. Check browser console for frontend errors
5. Verify user role in database

Your admin panel is now fully configured and secured! 🎉
