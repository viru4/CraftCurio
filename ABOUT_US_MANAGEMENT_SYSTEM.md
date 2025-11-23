# About Us Management System - Complete Documentation

## Overview
A comprehensive content management system for the About Us page with backend API, admin dashboard, and dynamic frontend rendering. Admins can manage all About Us content through an intuitive interface, and changes are immediately reflected on the public-facing page.

## System Architecture

### Backend (Node.js + MongoDB)
- **Model**: `AboutUs.js` - Mongoose schema with all sections
- **Controller**: `aboutUsController.js` - CRUD operations
- **Routes**: `aboutUsRoutes.js` - API endpoints with auth
- **Database**: Single document stores all About Us content

### Admin Dashboard (React)
- **Main Component**: `AboutUsManagement.jsx` - Dashboard container
- **Section Editors**: 10 specialized editor components
- **Features**: Expand/collapse, real-time save, publish toggle

### Public Frontend (React)
- **Main Page**: `AboutUs.jsx` - Fetches and displays data
- **Section Components**: 10 display components (updated to accept props)

---

## Backend API Documentation

### Base URL
```
http://localhost:8000/api/about-us
```

### Endpoints

#### 1. Get About Us Data
```http
GET /api/about-us
```
**Access**: Public  
**Response**: Complete About Us page data

```json
{
  "success": true,
  "data": {
    "hero": { "headline": "...", "tagline": "...", "image": "..." },
    "story": { "title": "...", "paragraphs": [...], "image": "..." },
    "mission": { "missionStatement": "...", "values": [...] },
    "team": { "members": [...] },
    "timeline": { "milestones": [...], "stats": {...} },
    "unique": { "features": [...] },
    "impact": { "statistics": [...], "initiatives": [...] },
    "testimonials": { "items": [...] },
    "gallery": { "images": [...] },
    "contact": { "email": "...", "socialLinks": {...} },
    "isPublished": true
  }
}
```

#### 2. Update Entire Page
```http
PUT /api/about-us
Authorization: Bearer <token>
```
**Access**: Admin only  
**Body**: Complete or partial About Us data  
**Response**: Updated data

#### 3. Update Specific Section
```http
PATCH /api/about-us/:section
Authorization: Bearer <token>
```
**Access**: Admin only  
**Sections**: `hero`, `story`, `mission`, `team`, `timeline`, `unique`, `impact`, `testimonials`, `gallery`, `contact`  
**Body**: Section-specific data  
**Response**: Updated section data

#### 4. Add Item to Array Field
```http
POST /api/about-us/:section/:field
Authorization: Bearer <token>
```
**Access**: Admin only  
**Example**: `POST /api/about-us/team/members`  
**Body**: New item data  
**Response**: Created item with ID

#### 5. Update Array Item
```http
PUT /api/about-us/:section/:field/:itemId
Authorization: Bearer <token>
```
**Access**: Admin only  
**Example**: `PUT /api/about-us/team/members/123abc`  
**Body**: Updated item data  
**Response**: Updated item

#### 6. Delete Array Item
```http
DELETE /api/about-us/:section/:field/:itemId
Authorization: Bearer <token>
```
**Access**: Admin only  
**Example**: `DELETE /api/about-us/testimonials/items/456def`  
**Response**: Success message

#### 7. Toggle Publish Status
```http
PATCH /api/about-us/publish
Authorization: Bearer <token>
```
**Access**: Admin only  
**Response**: New publish status

---

## Database Schema

### Main Structure
```javascript
AboutUs {
  hero: {
    headline: String,
    highlightText: String,
    tagline: String,
    image: String
  },
  
  story: {
    title: String,
    paragraphs: [String],
    image: String,
    highlights: [{
      icon: String,
      title: String,
      description: String
    }]
  },
  
  mission: {
    title: String,
    missionStatement: String,
    visionStatement: String,
    values: [ValueSchema]
  },
  
  team: {
    title: String,
    subtitle: String,
    members: [TeamMemberSchema]
  },
  
  timeline: {
    title: String,
    subtitle: String,
    milestones: [MilestoneSchema],
    stats: {
      artisans: String,
      collectors: String,
      countries: String,
      itemsSold: String
    }
  },
  
  unique: {
    title: String,
    subtitle: String,
    features: [USPSchema]
  },
  
  impact: {
    title: String,
    subtitle: String,
    statistics: [ImpactStatSchema],
    initiatives: [InitiativeSchema],
    stories: [{
      quote: String,
      author: String,
      location: String
    }]
  },
  
  testimonials: {
    title: String,
    subtitle: String,
    items: [TestimonialSchema]
  },
  
  gallery: {
    title: String,
    subtitle: String,
    images: [GalleryImageSchema]
  },
  
  contact: {
    title: String,
    subtitle: String,
    email: String,
    phone: String,
    address: String,
    socialLinks: {
      facebook: String,
      instagram: String,
      twitter: String,
      linkedin: String
    }
  },
  
  isPublished: Boolean,
  lastUpdatedBy: ObjectId (ref: User),
  timestamps: true
}
```

### Sub-Schemas

**TeamMemberSchema**
```javascript
{
  name: String (required),
  role: String (required),
  bio: String (required),
  image: String,
  linkedin: String,
  email: String (required),
  order: Number
}
```

**TestimonialSchema**
```javascript
{
  name: String (required),
  role: String (required),
  quote: String (required),
  image: String,
  type: String (enum: ['collector', 'artisan']),
  rating: Number (1-5),
  order: Number
}
```

**GalleryImageSchema**
```javascript
{
  src: String (required),
  alt: String (required),
  title: String (required),
  category: String (enum: ['Products', 'Workshop', 'Events', 'Team']),
  order: Number
}
```

---

## Admin Dashboard Usage

### Accessing the Dashboard
```
URL: /admin/about-us
Authentication: Required (Admin role)
```

### Features

#### 1. Section Management
- **Expand/Collapse**: Click section headers to show/hide editors
- **Independent Saving**: Each section can be saved separately
- **Real-time Updates**: Changes reflect immediately on save

#### 2. Hero Section Editor
- Edit headline and tagline
- Set highlight text for gradient effect
- Update hero image URL
- Live image preview

#### 3. Story Section Editor
- Add/remove story paragraphs
- Upload story image
- Manage highlight cards (icon, title, description)

#### 4. Mission Section Editor
- Edit mission and vision statements
- Add/remove core values
- Configure value icons and colors

#### 5. Team Section Editor
- Add/remove team members
- Upload member photos
- Set LinkedIn and email links
- Order team members

#### 6. Timeline Section Editor
- Add/remove milestones
- Set year, month, and icon
- Edit statistics summary
- Configure milestone order

#### 7. Unique Features Editor
- Add/remove USPs
- Set icons and gradient colors
- Order features

#### 8. Impact Section Editor
- Manage impact statistics
- Add/remove initiatives with images
- Include impact stories from artisans

#### 9. Testimonials Editor
- Add/remove testimonials
- Set type (collector/artisan)
- Configure star ratings
- Upload customer photos

#### 10. Gallery Editor
- Add/remove images
- Categorize images (Products, Workshop, Events, Team)
- Set image titles and alt text

#### 11. Contact Editor
- Update contact information (email, phone, address)
- Manage social media links
- Newsletter settings

### Global Actions

#### Save All Changes
- Saves all pending changes across sections
- Button: Top right corner
- Confirmation shown on success

#### Refresh Data
- Reloads latest data from database
- Discards unsaved changes

#### Publish/Unpublish
- Toggle page visibility
- Unpublished pages show error to public users

---

## Frontend Implementation

### Public Page Structure
```
/about-us
```

### Data Flow
1. Component mounts → Fetch from `/api/about-us`
2. Loading state displayed during fetch
3. Data passed to section components as props
4. Each section renders with dynamic data
5. Fallback to defaults if data missing

### Section Components
All section components updated to accept `data` prop:

```jsx
<HeroSection data={aboutUsData?.hero} />
<StorySection data={aboutUsData?.story} />
<MissionSection data={aboutUsData?.mission} />
// ... etc
```

### Error Handling
- **Loading**: Spinner with message
- **Error**: Alert with fallback to default content
- **Missing Data**: Each component has default values

---

## Setup Instructions

### Backend Setup

1. **Install Dependencies** (already done)
   ```bash
   cd backend
   npm install
   ```

2. **Environment Variables**
   Ensure `.env` has MongoDB connection string

3. **Start Server**
   ```bash
   npm start
   ```

4. **Initialize Database**
   - First GET request auto-creates About Us document with defaults
   - Or use MongoDB Compass to manually seed data

### Frontend Setup

1. **Install Dependencies** (already done)
   ```bash
   cd front-end
   npm install
   ```

2. **Configure API URL**
   Check `src/config/api.js` has correct backend URL

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Access**
   - Public page: `http://localhost:5173/about-us`
   - Admin dashboard: `http://localhost:5173/admin/about-us`

---

## Security Features

### Authentication
- All write operations require authentication
- Token-based auth with JWT
- Stored in localStorage

### Authorization
- Admin role required for all management operations
- Middleware: `protect` + `admin`
- Unauthorized requests rejected with 403

### Data Validation
- Mongoose schema validation
- Required fields enforced
- Type checking on all inputs

### Input Sanitization
- MongoDB injection prevented by Mongoose
- XSS protection via React escaping
- URL validation for links

---

## File Structure

```
backend/
├── src/
│   ├── models/
│   │   └── AboutUs.js                 # Schema definition
│   ├── api/
│   │   ├── controllers/
│   │   │   └── aboutUsController.js   # Business logic
│   │   └── routes/
│   │       └── aboutUsRoutes.js       # API endpoints
│   └── app.js                          # Route registration

front-end/
├── src/
│   ├── pages/
│   │   ├── AboutUs/
│   │   │   ├── AboutUs.jsx            # Public page (dynamic)
│   │   │   └── index.js
│   │   └── admin/
│   │       └── aboutusManagement/
│   │           ├── AboutUsManagement.jsx        # Main dashboard
│   │           └── components/
│   │               ├── HeroEditor.jsx           # Hero section editor
│   │               ├── StoryEditor.jsx          # Story section editor
│   │               ├── MissionEditor.jsx        # Mission section editor
│   │               ├── TeamEditor.jsx           # Team section editor
│   │               ├── TimelineEditor.jsx       # Timeline section editor
│   │               ├── UniqueEditor.jsx         # USP section editor
│   │               ├── ImpactEditor.jsx         # Impact section editor
│   │               ├── TestimonialsEditor.jsx   # Testimonials editor
│   │               ├── GalleryEditor.jsx        # Gallery editor
│   │               └── ContactEditor.jsx        # Contact editor
│   ├── components/
│   │   └── aboutUs/
│   │       ├── HeroSection.jsx        # Display components
│   │       ├── StorySection.jsx       # (Now accept data prop)
│   │       ├── MissionSection.jsx
│   │       ├── TeamSection.jsx
│   │       ├── TimelineSection.jsx
│   │       ├── UniqueSection.jsx
│   │       ├── ImpactSection.jsx
│   │       ├── TestimonialsSection.jsx
│   │       ├── GallerySection.jsx
│   │       ├── CTASection.jsx
│   │       └── index.js
│   └── routes/
│       └── AppRoutes.jsx              # Route configuration
```

---

## Testing the System

### 1. Test Backend API
```bash
# Get About Us data
curl http://localhost:8000/api/about-us

# Update hero section (requires token)
curl -X PATCH http://localhost:8000/api/about-us/hero \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"headline": "Welcome to CraftCurio", "tagline": "New tagline"}'
```

### 2. Test Admin Dashboard
1. Login as admin
2. Navigate to `/admin/about-us`
3. Expand Hero section
4. Edit headline
5. Click "Save Hero Section"
6. Verify success message

### 3. Test Public Page
1. Navigate to `/about-us`
2. Verify all sections load
3. Check that edited content appears
4. Test responsive design on mobile

### 4. Test Publish Toggle
1. In admin dashboard, click Unpublish
2. Visit public page - should show default content
3. Click Publish again
4. Verify content reappears

---

## Future Enhancements

### Phase 1 (Immediate)
- [ ] Image upload functionality (currently URL-based)
- [ ] Rich text editor for long descriptions
- [ ] Drag-and-drop reordering for array items
- [ ] Bulk operations (delete multiple items)

### Phase 2 (Short-term)
- [ ] Version history and rollback
- [ ] Preview mode before publishing
- [ ] Scheduled publishing
- [ ] Content drafts separate from published

### Phase 3 (Long-term)
- [ ] Multi-language support
- [ ] A/B testing for different versions
- [ ] Analytics integration
- [ ] SEO optimization fields
- [ ] Accessibility audit tools

---

## Troubleshooting

### Issue: Data not loading on public page
**Solution**:
- Check backend is running (`npm start` in backend folder)
- Verify API URL in `front-end/src/config/api.js`
- Check browser console for errors
- Ensure MongoDB is connected

### Issue: Cannot save changes in admin dashboard
**Solution**:
- Verify you're logged in as admin
- Check token is valid (not expired)
- Check network tab for API errors
- Ensure admin role is set correctly in database

### Issue: Images not displaying
**Solution**:
- Verify image URLs are absolute and accessible
- Check CORS settings if images from external source
- Use placeholder image as fallback
- Implement image upload for local hosting

### Issue: Changes not reflecting immediately
**Solution**:
- Clear browser cache
- Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
- Check if page is published
- Verify save operation completed successfully

---

## Best Practices

### Content Management
1. **Regular Backups**: Export About Us data regularly
2. **Test Changes**: Use preview mode before publishing
3. **Image Optimization**: Compress images before upload
4. **Content Review**: Have someone review before publishing
5. **Mobile Testing**: Always test on mobile devices

### Development
1. **Version Control**: Commit changes with clear messages
2. **Code Comments**: Document complex logic
3. **Error Handling**: Add try-catch blocks
4. **Validation**: Validate all inputs on frontend and backend
5. **Security**: Never expose admin credentials

### Performance
1. **Lazy Loading**: Implement for images
2. **Caching**: Cache API responses where appropriate
3. **Optimization**: Minimize bundle size
4. **CDN**: Use CDN for static assets
5. **Monitoring**: Track page load times

---

## Support & Maintenance

### Regular Maintenance
- **Weekly**: Review content for accuracy
- **Monthly**: Check for broken links and images
- **Quarterly**: Update testimonials and statistics
- **Annually**: Review and update team information

### Monitoring
- Track API response times
- Monitor error rates
- Check user engagement metrics
- Review admin activity logs

---

## API Response Examples

### Success Response
```json
{
  "success": true,
  "message": "About Us page updated successfully",
  "data": { /* updated data */ }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Failed to update About Us page",
  "error": "Validation error message"
}
```

---

## Conclusion

The About Us Management System provides a complete solution for managing dynamic content with:
- ✅ Secure backend API with authentication
- ✅ Intuitive admin dashboard
- ✅ Dynamic frontend rendering
- ✅ Responsive design throughout
- ✅ Real-time updates
- ✅ Comprehensive error handling
- ✅ Well-documented codebase

The system is production-ready and can be extended with additional features as needed.
