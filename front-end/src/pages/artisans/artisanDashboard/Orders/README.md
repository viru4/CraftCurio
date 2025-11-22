# Artisan Orders Management

## Overview
Complete orders management system for artisans to view, track, and manage orders containing their products.

## Features

### ✅ Implemented Features

1. **Orders Dashboard**
   - Real-time statistics (total, pending, processing, shipped, delivered, cancelled orders)
   - Total revenue calculation (from paid orders only)
   - Responsive stats cards with icons and color coding

2. **Filtering & Search**
   - Search by order number or customer name
   - Filter by order status (all/pending/confirmed/processing/shipped/delivered/cancelled)
   - Date range filtering (from/to dates)
   - Clear all filters button

3. **Orders Table**
   - Desktop: Full table view with sortable columns
   - Mobile: Responsive card view
   - Displays: order number, customer, items count, total amount, payment status, order status, date
   - Tracking number display (when available)
   - "View Details" button for each order

4. **Order Details Modal**
   - Full order information display
   - Order and payment status badges
   - List of ordered items with images, quantities, prices
   - Order summary (subtotal, shipping, tax, total)
   - Shipping address details
   - Order timeline (created, delivered, estimated delivery dates)
   - Update order status form
   - Tracking number input (for shipped orders)

5. **Status Management**
   - Update order status: pending → confirmed → processing → shipped → delivered
   - Cancel orders (before shipped/delivered)
   - Add tracking numbers for shipped orders
   - Automatic delivery date recording

6. **Pagination**
   - 10 orders per page (configurable)
   - Previous/Next navigation
   - Results count display

7. **Responsive Design**
   - Mobile-first approach
   - Tablet and desktop optimized layouts
   - Touch-friendly buttons and interactions

## File Structure

```
front-end/src/pages/artisans/artisanDashboard/Orders/
├── Orders.jsx                           # Main orders page
└── components/
    ├── OrdersHeader.jsx                 # Page header with title
    ├── OrdersStats.jsx                  # Statistics cards
    ├── OrdersFilters.jsx                # Search and filter controls
    ├── OrdersTable.jsx                  # Orders list (table/cards)
    └── OrderDetailsModal.jsx            # Order details and status update
```

## Backend Integration

### New Endpoint: Get Artisan Orders
**Route**: `GET /api/orders/artisan/my-orders`

**Middleware**: 
- `authenticate` - Verify JWT token
- `requireRole('artisan')` - Ensure user is an artisan

**Query Parameters**:
- `status` - Filter by order status (optional)
- `search` - Search by order number or customer name (optional)
- `dateFrom` - Start date for date range filter (optional)
- `dateTo` - End date for date range filter (optional)
- `page` - Page number for pagination (default: 1)
- `limit` - Items per page (default: 10)

**Response**:
```json
{
  "success": true,
  "orders": [...],
  "total": 150,
  "page": 1,
  "limit": 10,
  "totalPages": 15
}
```

**Implementation**:
- Finds all products belonging to the artisan
- Queries orders containing those products (matches productId and productType='artisan')
- Supports filtering, search, and pagination
- Populates user details (customer name, email, phone)

### Modified Files:
1. `backend/src/api/controllers/orderController.js`
   - Added `getArtisanOrders` function
   - Imports `ArtisanProduct` model

2. `backend/src/api/routes/orders.js`
   - Added route: `/artisan/my-orders`
   - Imported `requireRole` middleware

## Usage

### For Artisans:
1. Navigate to `/artisan/orders` or click "Orders" in the dashboard sidebar
2. View order statistics at the top
3. Use filters to find specific orders
4. Click "View" on any order to see details
5. Update order status and add tracking numbers in the modal
6. Monitor order progress through status changes

### Status Workflow:
```
pending → confirmed → processing → shipped → delivered
                        ↓
                    cancelled (before shipped)
```

### Color Coding:
- **Pending**: Yellow - New order awaiting confirmation
- **Confirmed**: Blue - Order confirmed, ready to process
- **Processing**: Purple - Order being prepared
- **Shipped**: Indigo - Order shipped, tracking available
- **Delivered**: Green - Order successfully delivered
- **Cancelled**: Red - Order cancelled

## Technical Details

### State Management:
- Orders list with loading states
- Filters (status, search, date range, pagination)
- Statistics (counts by status, total revenue)
- Selected order for detail view
- Modal visibility

### API Integration:
- Fetches orders on component mount and filter changes
- Real-time statistics calculation
- Pagination with server-side filtering
- Order status updates with tracking number support

### Component Architecture:
- Modular component structure for easy maintenance
- Shared styling with existing dashboard theme
- Consistent color scheme ([#ec6d13] primary, stone colors)
- Icon usage from lucide-react

### Permissions:
- Only authenticated artisans can access
- Can only view orders containing their products
- Cannot modify orders from other artisans

## Future Enhancements (Potential)

- [ ] Export orders to CSV/PDF
- [ ] Bulk status updates
- [ ] Email notifications to customers on status changes
- [ ] Order notes/comments system
- [ ] Advanced analytics (sales trends, popular products)
- [ ] Print packing slips
- [ ] Shipping label integration
- [ ] Return/refund management

## Testing Checklist

- [x] Orders page loads without errors
- [x] All components render properly
- [x] Backend endpoint created and integrated
- [x] Route added to AppRoutes
- [x] Sidebar navigation includes Orders link
- [ ] Orders filtering works correctly
- [ ] Search functionality works
- [ ] Date range filtering works
- [ ] Pagination works
- [ ] Order details modal opens/closes
- [ ] Status updates work and persist
- [ ] Tracking numbers save correctly
- [ ] Responsive design on mobile/tablet
- [ ] Loading and empty states display properly
- [ ] Error handling for failed API calls

## Dependencies

### Frontend:
- React (hooks: useState, useEffect)
- React Router (navigation)
- lucide-react (icons)
- Tailwind CSS (styling)

### Backend:
- Express.js (routing)
- Mongoose (MongoDB ODM)
- JWT authentication
- Role-based authorization

## Notes

- Orders containing multiple artisans' products will appear for each respective artisan
- Revenue calculation excludes cancelled orders and unpaid orders
- Statistics are calculated client-side from fetched orders
- Backend filtering reduces data transfer and improves performance
- Tracking numbers are optional but recommended for shipped orders
