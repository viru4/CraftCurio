# Admin Artisan Stories Management

## Overview
The Admin Content Management page allows administrators to review, edit, and manage all artisan stories in the platform. This provides centralized control over artisan story content while maintaining the ability for artisans to self-manage their stories.

## Features Implemented

### 1. **Stories List View**
- ✅ Table view (desktop) with sortable columns
- ✅ Card view (mobile) for better touch experience
- ✅ Display artisan information: name, specialization, location, experience
- ✅ Story status indicator (Published/No Story)
- ✅ Profile photo display
- ✅ Responsive design for all screen sizes

### 2. **Search Functionality**
- ✅ Real-time search with debounce (300ms)
- ✅ Search by: artisan name, ID, specialization, location
- ✅ Result count display
- ✅ Reset button to clear filters
- ✅ Maintains pagination with filtered results

### 3. **View Story Modal**
- ✅ Full-screen modal with scroll
- ✅ Preview all story sections:
  - Full biography
  - Gallery photos
  - Design sketches & handwritten notes
  - Inspiring quotes
  - Cultural context
  - Challenges overcome
  - Triumphs & achievements
  - Video links
- ✅ "View Live Story Page" button to open public page
- ✅ Click outside to close
- ✅ Responsive layout

### 4. **Edit Story Modal**
- ✅ Inline editing of all text-based story fields
- ✅ Dynamic list management (add/remove items):
  - Quotes
  - Challenges
  - Triumphs
  - Videos (with title and URL)
- ✅ Cultural context textarea
- ✅ Auto-save functionality
- ✅ Loading states
- ✅ Validation
- ✅ Note about image management (handled by artisan dashboard)
- ✅ Fully responsive

### 5. **Delete Functionality**
- ✅ Confirmation dialog before deletion
- ✅ Removes entire artisan record
- ✅ Loading state during deletion
- ✅ Auto-refresh list after deletion

### 6. **Pagination**
- ✅ 10 items per page
- ✅ Previous/Next navigation
- ✅ Page number display
- ✅ Result count display
- ✅ Disabled state for first/last pages

### 7. **Design & Responsiveness**
- ✅ Follows existing admin theme
- ✅ Uses CraftCurio color palette:
  - Primary: #ec6d13 (orange)
  - Text: #1b130d / #fcfaf8 (dark/light)
  - Secondary: #9a6c4c (muted brown)
  - Background: #f3ece7 / #2a1e14 (light/dark)
- ✅ Dark mode support
- ✅ Mobile-first approach
- ✅ Touch-friendly buttons and interactions
- ✅ Accessible navigation

## File Structure

```
front-end/src/pages/admin/content&stories/
├── AdminContent.jsx                 # Main page component
└── components/
    ├── index.js                     # Component exports
    ├── StoriesTable.jsx             # Table/list component
    ├── StoryViewModal.jsx           # View story modal
    └── StoryEditModal.jsx           # Edit story modal
```

## API Endpoints Used

### GET `/api/artisans`
Fetches all artisans with their stories
- **Response**: Array of artisan objects with full story data

### GET `/api/artisans/:id`
Fetch single artisan by ID
- **Parameters**: artisan ID
- **Response**: Single artisan object

### PUT `/api/artisans/:id`
Update artisan story
- **Parameters**: artisan ID
- **Body**: 
  ```json
  {
    "fullBio": "string",
    "story": {
      "photos": ["url1", "url2"],
      "handwrittenNotes": ["url1"],
      "quotes": ["quote1"],
      "culturalContext": "string",
      "challenges": ["challenge1"],
      "triumphs": ["triumph1"],
      "videos": [{"url": "...", "title": "..."}]
    }
  }
  ```
- **Response**: Updated artisan object

### DELETE `/api/artisans/:id`
Delete artisan and their story
- **Parameters**: artisan ID
- **Response**: Success message

## Data Model

### Current Implementation
Stories are stored as part of the `Artisan` model in the `story` object:

```javascript
{
  id: "artisan-001",
  name: "John Doe",
  craftSpecialization: "Pottery",
  fullBio: "Full story text...",
  story: {
    photos: ["url1", "url2"],
    videos: [{url: "...", title: "..."}],
    handwrittenNotes: ["url1"],
    quotes: ["quote1", "quote2"],
    culturalContext: "Cultural background...",
    challenges: ["challenge1"],
    triumphs: ["triumph1"],
    locationCoordinates: {
      latitude: 0,
      longitude: 0
    }
  }
}
```

### Should We Create a Separate Stories Model?

**Current Approach (Stories embedded in Artisan):**
- ✅ Pros:
  - One-to-one relationship (one story per artisan)
  - Single query to fetch artisan with story
  - Simpler data structure
  - Easier to maintain data consistency
  - Less database overhead
  
- ❌ Cons:
  - Large document size if many photos/videos
  - All story data loaded even if only artisan info needed
  - Harder to version stories

**Separate Stories Model:**
- ✅ Pros:
  - Can enable versioning/drafts
  - Smaller artisan documents
  - Can have multiple stories per artisan (if future requirement)
  - More granular access control
  - Better for analytics/reporting
  
- ❌ Cons:
  - Requires joins/population
  - More complex queries
  - Two collections to maintain
  - Potential orphaned records

**Recommendation:**
Keep the **current embedded approach** because:
1. One-to-one relationship matches business logic
2. Better performance (single query)
3. Atomic updates (story and artisan updated together)
4. Simpler code maintenance
5. Current document size is manageable

Only consider a separate model if:
- Need story versioning/history
- Want draft/published workflow
- Multiple stories per artisan
- Document size becomes problematic (>16MB MongoDB limit)

## Usage

### For Admins:
1. Navigate to `/admin/content` or click "Content" in admin sidebar
2. Browse all artisan stories in the table
3. Use search to find specific artisans
4. Click **View** to preview a story
5. Click **Edit** to modify story content
6. Click **Delete** to remove an artisan (with confirmation)

### For Artisans:
- Artisans continue to manage their stories via `/artisan/story`
- Admin changes are immediately reflected in artisan dashboard
- Image uploads still handled by artisan (cloud storage needed)

## Responsive Breakpoints

- **Mobile**: < 640px (sm)
  - Card-based layout
  - Stacked buttons
  - Full-width modals
  
- **Tablet**: 640px - 1024px (sm-lg)
  - Adjusted spacing
  - Two-column grids where appropriate
  
- **Desktop**: > 1024px (lg+)
  - Table layout
  - Sidebar visible
  - Multi-column layouts

## Future Enhancements

1. **Story Approval Workflow**
   - Add "pending", "approved", "rejected" status
   - Email notifications to artisans
   
2. **Bulk Operations**
   - Select multiple artisans
   - Bulk approve/reject stories
   
3. **Analytics Dashboard**
   - Most viewed stories
   - Completion rates
   - Story engagement metrics
   
4. **Version History**
   - Track story changes over time
   - Ability to revert to previous versions
   
5. **Advanced Filters**
   - Filter by story status
   - Filter by craft specialization
   - Filter by location
   - Sort by views, likes, date
   
6. **Export Functionality**
   - Export stories to PDF
   - CSV export for analytics
   
7. **Cloud Image Management**
   - Direct image upload in admin edit
   - Image optimization
   - CDN integration

## Testing Checklist

- [ ] Search functionality works across all fields
- [ ] Pagination updates correctly
- [ ] View modal displays all story sections
- [ ] Edit modal saves changes successfully
- [ ] Delete confirmation works
- [ ] Responsive on mobile (320px+)
- [ ] Responsive on tablet (768px)
- [ ] Works on desktop (1920px+)
- [ ] Dark mode renders correctly
- [ ] Modals close on backdrop click
- [ ] Forms validate inputs
- [ ] Loading states display properly
- [ ] Error messages show appropriately
- [ ] Navigation works with browser back button

## Known Issues / Notes

1. **Image Upload**: Currently, artisans use blob URLs for images in their dashboard. These are filtered out when saving. Implement cloud storage (AWS S3, Cloudinary) for permanent URLs.

2. **Authorization**: Currently using basic token auth. Consider adding role-based access control (RBAC) to ensure only admins can access this page.

3. **Real-time Updates**: Changes made by admins are not immediately reflected for online artisans. Consider implementing WebSocket notifications.

4. **Image Gallery in Edit**: Admin edit modal doesn't include image upload. Direct artisans to use their dashboard for image management, or implement admin image upload with cloud storage.

## Related Files

- **Artisan Dashboard**: `/artisan/story` - Where artisans manage their own stories
- **Public Story Page**: `/artisan-stories/:id` - Public-facing story display
- **Backend Model**: `backend/src/models/Artisan.js`
- **Backend Routes**: `backend/src/api/routes/artisans.js`
- **Admin Sidebar**: Updated with "Content" link to `/admin/content`

