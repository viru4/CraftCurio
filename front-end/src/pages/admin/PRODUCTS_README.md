# Admin Product Management

A fully responsive product management interface for managing both Artisan Products and Collectibles.

## Features

### Core Functionality

- **Dual Product Types**: Toggle between Artisan Products and Collectibles
- **Real-time Data**: Fetches products from backend API endpoints
- **Search**: Search by product name or artisan name
- **Filters**: Filter by category and status
- **Pagination**: Navigate through product listings
- **Bulk Actions**: Select multiple products for batch operations
- **Status Management**: Approve, reject, or change product status
- **CRUD Operations**: View, edit, and delete products

### Product Table

- **Product Details Display**:
  - Product image thumbnail
  - Product name
  - Artisan name
  - Category
  - Status badge (Approved/Pending/Rejected)
  - Price formatted with currency
  - Date added

- **Action Menu** for each product:
  - View Details
  - Edit Product
  - Approve (if not already approved)
  - Remove/Delete

### Responsive Design

- **Desktop**: Full table view with all columns
- **Tablet**: Optimized layout with adjusted spacing
- **Mobile**: Mobile-friendly with hamburger menu

## API Integration

### Endpoints Used

**Artisan Products:**
```
GET /api/artisan-products
  Query params: page, limit, search, category, status
DELETE /api/artisan-products/:id
PATCH /api/artisan-products/:id
  Body: { status: 'approved'|'pending'|'rejected' }
```

**Collectibles:**
```
GET /api/collectibles
  Query params: page, limit, search, category, status
DELETE /api/collectibles/:id
PATCH /api/collectibles/:id
  Body: { status: 'approved'|'pending'|'rejected' }
```

### Expected Response Format

```javascript
// Option 1: Simple array
[
  {
    _id: "product_id",
    name: "Product Name",
    artisan: "Artisan Name" | { name: "Artisan Name" },
    category: "Category Name" | { name: "Category Name" },
    price: 45.00,
    status: "approved",
    images: ["image_url"],
    createdAt: "2023-10-26T00:00:00.000Z"
  }
]

// Option 2: Paginated response
{
  data: [...products],
  total: 100,
  page: 1,
  pages: 10
}
```

## Usage

### Accessing the Page
Navigate to `/admin/products` to view the product management interface.

### Switching Between Product Types
Click the tabs at the top:
- **Artisan Products** - Handcrafted items from artisans
- **Collectibles** - Collectible items

### Searching Products
Use the search bar to find products by name or artisan.

### Filtering
- **Category**: Filter by product category
- **Status**: Filter by approval status
- **Reset**: Clear all filters and search

### Managing Products
1. **View**: Click the menu (⋮) and select "View Details"
2. **Edit**: Select "Edit" from the menu
3. **Approve**: Click "Approve" to change status to approved
4. **Delete**: Select "Remove" to delete the product

### Bulk Operations
- Select multiple products using checkboxes
- Select all products using the header checkbox
- Perform batch operations (coming soon)

## Components

### Products.jsx
Main page component that handles:
- State management for products, filters, and pagination
- API calls to fetch products
- Tab switching between product types
- Search and filter logic
- Product deletion and status updates

### ProductsTable.jsx
Reusable table component featuring:
- Product list display with all details
- Checkbox selection for bulk actions
- Action menu with dropdown
- Pagination controls
- Loading and empty states
- Responsive table design

## Styling

Uses Tailwind CSS with custom color scheme:
- Primary: `#ec6d13` (brand orange)
- Background Light: `#f8f7f6`
- Background Dark: `#221810`
- Surface Light: `#f3ece7`
- Surface Dark: `#3a2a1d`
- Muted Light: `#9a6c4c`
- Muted Dark: `#a18a7a`

## Status Badges

- **Approved**: Green badge
- **Pending**: Yellow badge
- **Rejected**: Red badge
- **Active**: Green badge
- **Inactive**: Gray badge

## Navigation

From the admin sidebar:
- Dashboard → Overview
- **Products** → Product Management (current page)
- Orders → Order management
- Users → User management
- Content → Content management
- Analytics → Analytics dashboard

## Future Enhancements

- [ ] Add New Product form
- [ ] Edit Product form
- [ ] Bulk approve/reject
- [ ] Export products to CSV
- [ ] Advanced filtering (price range, date range)
- [ ] Product analytics
- [ ] Image gallery view
- [ ] Drag and drop image upload
- [ ] Stock/inventory management
- [ ] Product variants support
