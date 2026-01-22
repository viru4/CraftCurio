# Category Management System - Admin Dashboard

## Overview

The Category Management System allows administrators to review, approve, reject, and manage all categories submitted by sellers (artisans and collectors) on the CraftCurio platform. This ensures category quality and prevents duplicate or inappropriate categories.

---

## Features

### ✅ For Administrators

- **View All Categories**: Browse all artisan and collectible categories in one place
- **Filter & Search**: Filter by type (artisan/collectible), status (pending/approved/rejected), and search by name
- **Review Submissions**: See pending categories submitted by sellers
- **Approve/Reject**: Quick actions to approve or reject categories with optional rejection reasons
- **Add Images**: Upload category images to enhance visual appeal
- **Edit Categories**: Modify category details including name, description, tags, and images
- **Delete Categories**: Remove unwanted or duplicate categories
- **Track Submissions**: See who submitted each category and when
- **Statistics**: View category counts by type and status

### ✅ For Sellers (Artisans/Collectors)

- **Custom Categories**: Add custom categories when creating products
- **Automatic Submission**: Custom categories are automatically submitted for admin review
- **Pending Status**: Products with custom categories can still be created while pending approval
- **No Blocking**: Sellers aren't blocked from listing products with pending categories

---

## File Structure

```
backend/
├── src/
│   ├── models/
│   │   ├── ArtisanProductCategory.js       # Updated with approval fields
│   │   └── collectiblecategory.js          # Updated with approval fields
│   ├── api/
│   │   ├── controllers/
│   │   │   ├── categoryController.js       # Category management logic
│   │   │   ├── artisanProductController.js # Auto-create pending categories
│   │   │   └── collectibleController.js    # Auto-create pending categories
│   │   └── routes/
│   │       └── categories.js               # Admin category routes

front-end/
├── src/
│   └── pages/
│       └── admin/
│           ├── Categories/
│           │   ├── Categories.jsx          # Main category management page
│           │   └── components/
│           │       ├── StatsCards.jsx      # Statistics display
│           │       ├── CategoryTable.jsx   # Category listing table
│           │       └── CategoryModal.jsx   # Create/Edit/View modal
│           └── components/
│               ├── AdminSidebar.jsx        # Updated with Categories link
│               └── MobileSidebar.jsx       # Updated with Categories link
```

---

## Database Schema Updates

### Category Models (Both Artisan & Collectible)

```javascript
{
  // Existing fields
  name: String,
  description: String,
  icon: String,
  tags: [String],
  
  // NEW: Image field
  image: String,  // Category image URL
  
  // NEW: Approval workflow fields
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'approved'  // Seeded categories are auto-approved
  },
  submittedBy: {
    type: ObjectId,
    ref: 'User',
    default: null  // null for admin-created/seeded categories
  },
  reviewedBy: {
    type: ObjectId,
    ref: 'User',
    default: null
  },
  reviewedAt: Date,
  rejectionReason: String
}
```

---

## API Endpoints

### Admin Endpoints

#### Get All Categories
```
GET /api/categories/admin/all
Headers: Authorization: Bearer <token>
Query: ?type=all&status=all&search=&page=1&limit=20
```

#### Get Category Statistics
```
GET /api/categories/admin/stats
Headers: Authorization: Bearer <token>
```

#### Submit Category (Sellers can use this)
```
POST /api/categories/admin/submit
Headers: Authorization: Bearer <token>
Body: {
  "name": "Traditional Pottery",
  "description": "Handmade traditional pottery items",
  "type": "artisan",
  "icon": "🏺"
}
```

#### Update Category
```
PUT /api/categories/admin/:id
Headers: Authorization: Bearer <token>
Body: {
  "type": "artisan",
  "name": "Updated Name",
  "description": "Updated description",
  "image": "https://...",
  "tags": ["tag1", "tag2"]
}
```

#### Approve Category
```
POST /api/categories/admin/:id/approve
Headers: Authorization: Bearer <token>
Body: {
  "type": "artisan"
}
```

#### Reject Category
```
POST /api/categories/admin/:id/reject
Headers: Authorization: Bearer <token>
Body: {
  "type": "artisan",
  "reason": "Does not meet category guidelines"
}
```

#### Delete Category
```
DELETE /api/categories/admin/:id?type=artisan
Headers: Authorization: Bearer <token>
```

---

## Workflow

### 1. Seller Creates Product with Custom Category

1. Seller creates a new product and enters a custom category name
2. Backend checks if category exists as approved:
   - If exists: Product is created normally
   - If not exists: 
     - Creates category with `status: 'pending'`
     - Links category to seller via `submittedBy`
     - Product is still created successfully

### 2. Admin Reviews Category

1. Admin navigates to `/admin/categories`
2. Filters by `status: pending`
3. Reviews category details:
   - Category name
   - Description (auto-generated or custom)
   - Submitted by (seller info)
   - Date submitted
4. Admin can:
   - **Edit**: Update name, description, add image, add tags
   - **Approve**: Category becomes available for all sellers
   - **Reject**: Category is marked rejected with reason
   - **Delete**: Permanently remove category

### 3. Category Lifecycle

```
[Seller Submits] → [Pending] → [Admin Reviews] → [Approved/Rejected]
                                      ↓
                                  [Delete]
```

---

## Usage Guide

### Accessing Category Management

1. Login as admin at `/admin/login`
2. Navigate to **Categories** from the sidebar
3. You'll see the category management dashboard

### Filtering Categories

- **Type Filter**: Show all, only artisan, or only collectible categories
- **Status Filter**: Show all, pending, approved, or rejected categories
- **Search**: Search by category name or description

### Managing Categories

#### Approve a Category
1. Find the pending category in the list
2. Click the **checkmark icon** (✓)
3. Confirm approval
4. Category is now available for all sellers

#### Reject a Category
1. Find the pending category
2. Click the **X icon**
3. Enter rejection reason (optional)
4. Confirm rejection

#### Edit a Category
1. Click the **edit icon** (pencil)
2. Update fields as needed:
   - Name
   - Description
   - Icon
   - Image (upload new)
   - Tags
   - Status
3. Click **Save Changes**

#### Add Image to Category
1. Edit the category
2. Use the image upload component
3. Upload an image (supports Cloudinary)
4. Save changes

#### Delete a Category
1. Click the **trash icon**
2. Confirm deletion
3. Category is permanently removed

---

## Statistics Dashboard

The stats cards show:

- **Total Categories**: Combined count of all categories
- **Pending Approval**: Categories awaiting review
- **Approved**: Live categories available to sellers
- **Rejected**: Categories that didn't meet guidelines

Each stat shows breakdown by type (Artisan/Collectible).

---

## Responsive Design

- **Desktop**: Full table view with all columns
- **Tablet**: Adjusted spacing and responsive columns
- **Mobile**: Card-based layout with action buttons

---

## Security & Permissions

- All admin category routes require authentication
- Only users with `role: 'admin'` can access management features
- Sellers can only submit categories (via product creation)
- Category creation during product submission is non-blocking

---

## Best Practices

### For Admins

1. **Review regularly**: Check pending categories daily
2. **Add images**: Enhance approved categories with relevant images
3. **Standardize names**: Edit categories to maintain consistent naming
4. **Provide feedback**: Include rejection reasons to guide sellers
5. **Merge duplicates**: Delete duplicate categories, keep best version

### For Developers

1. **Seeded categories**: Always set `status: 'approved'`
2. **Custom categories**: Set `status: 'pending'` with `submittedBy`
3. **Error handling**: Category creation failures shouldn't block product creation
4. **Case-insensitive**: Category name checks are case-insensitive

---

## Troubleshooting

### Category not appearing in dropdown

**Solution**: The category is likely pending approval. Check admin dashboard and approve it.

### Duplicate categories showing

**Solution**: Admin should review and delete duplicates, keeping the most descriptive version.

### Can't create product with custom category

**Solution**: This should never happen. Check backend logs. Category creation is non-blocking.

### Images not uploading

**Solution**: Ensure Cloudinary credentials are configured correctly in environment variables.

---

## Future Enhancements

- [ ] Bulk approve/reject multiple categories
- [ ] Category hierarchy (parent/child categories)
- [ ] Category analytics (usage count per category)
- [ ] Auto-suggest similar categories when creating custom ones
- [ ] Email notifications to sellers when categories are approved/rejected
- [ ] Category templates for quick creation
- [ ] Import/export categories

---

## Testing

### Manual Testing Steps

1. **As Seller**:
   - Create product with existing category → Should work
   - Create product with new custom category → Should work, category pending
   
2. **As Admin**:
   - View all categories → Should see all types and statuses
   - Filter by pending → Should see submitted categories
   - Approve category → Should move to approved
   - Reject category → Should move to rejected with reason
   - Edit category → Should update successfully
   - Add image → Should upload and display
   - Delete category → Should remove from database

3. **Edge Cases**:
   - Duplicate category names (case-insensitive) → Should prevent creation
   - Special characters in names → Should handle gracefully
   - Empty fields → Should show validation errors

---

## Migration Notes

Existing categories in the database will work without migration because:
- `status` defaults to `'approved'`
- `submittedBy` defaults to `null` (system/admin created)
- All new fields are optional

However, you may want to run a script to:
1. Set `status: 'approved'` on all existing categories
2. Add descriptions to categories missing them
3. Add images to enhance visual appeal

---

## Support

For issues or questions:
- Check admin logs at `/admin/logs`
- Review backend logs for category creation errors
- Contact development team for database migrations

---

## Changelog

### Version 1.0.0 (Current)
- Initial category management system
- Admin approval workflow
- Image upload support
- Filter and search capabilities
- Statistics dashboard
- Auto-submission from product creation
