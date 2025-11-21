# Story & Content Management

## Overview
The Story & Content Management section allows artisans to craft and manage their brand narratives, showcasing their journey, process, and the passion behind their creations.

## Features

### ✅ Implemented
1. **Rich Text Editor**
   - Formatting toolbar with Bold, Italic, Underline
   - List support (Bullet and Numbered)
   - Link and Image insertion buttons
   - Responsive text area with auto-resize
   - Character counter (optional)

2. **Media Gallery**
   - Drag & drop file upload
   - Support for images (JPG, PNG, GIF) and videos (MP4, MOV)
   - File size validation (Max 10MB)
   - Upload progress indicator
   - Responsive grid layout (2-5 columns based on screen size)
   - Hover delete functionality
   - Video indicator badges

3. **Auto-Save**
   - Saves content automatically after 2 seconds of inactivity
   - Displays last saved timestamp
   - Visual saving indicator

4. **Tab Navigation**
   - My Artisan Story tab (active)
   - Product Stories tab (placeholder)
   - Active tab highlighting with orange border
   - Smooth transitions

5. **Responsive Design**
   - Mobile-first approach
   - Breakpoints: sm (640px), md (768px), lg (1024px)
   - Horizontal scrolling on mobile for tabs
   - Stacked layout on mobile, side-by-side on desktop
   - Mobile header with hamburger menu

6. **Preview & Publish**
   - Preview button with Eye icon
   - Publish button with Upload icon
   - Ready for backend integration

## Component Structure

```
ContentManagement/
├── Content.jsx                 # Main container with state management
└── Component/
    ├── ContentHeader.jsx       # Page header with actions
    ├── ContentTabs.jsx         # Tab navigation
    ├── StoryEditor.jsx         # Rich text editor
    └── MediaGallery.jsx        # Media upload & gallery
```

## Component Details

### Content.jsx (Main Container)
- **Purpose**: Main container managing state and layout
- **State Management**:
  - `storyContent`: Story text content
  - `mediaFiles`: Array of uploaded media
  - `activeTab`: Current active tab
  - `lastSaved`: Last save timestamp
  - `isSaving`: Saving state indicator
- **Features**:
  - Auth check (redirects if not artisan)
  - Auto-save with debouncing
  - Sidebar integration
  - Mobile responsive header

### ContentHeader.jsx
- **Purpose**: Page header with title and action buttons
- **Props**:
  - `onPreview`: Preview callback
  - `onPublish`: Publish callback
  - `lastSaved`: Last saved timestamp
- **Features**:
  - Responsive layout
  - Icon buttons with text
  - Hidden text on extra-small screens

### ContentTabs.jsx
- **Purpose**: Tab navigation between sections
- **Props**:
  - `activeTab`: Currently active tab ID
  - `onTabChange`: Tab change callback
- **Tabs**:
  - `story`: My Artisan Story
  - `products`: Product Stories (coming soon)
- **Features**:
  - Active state highlighting
  - Hover effects
  - Horizontal scroll on mobile

### StoryEditor.jsx
- **Purpose**: Rich text editor for story content
- **Props**:
  - `content`: Current content
  - `onChange`: Content change callback
  - `lastSaved`: Last saved timestamp
- **Toolbar Buttons**:
  - Bold, Italic, Underline
  - Bullet List, Numbered List
  - Insert Link, Insert Image
- **Features**:
  - Responsive toolbar
  - Auto-resize textarea
  - Placeholder text
  - Last saved indicator

### MediaGallery.jsx
- **Purpose**: Media upload and gallery management
- **Props**:
  - `images`: Array of media objects
  - `onUpload`: Upload callback
  - `onDelete`: Delete callback
- **Features**:
  - Drag & drop zone
  - File input fallback
  - Upload progress bar
  - Responsive grid (2-5 columns)
  - Hover delete buttons
  - Video indicators
  - File type validation

## Usage

### Basic Setup
```jsx
import Content from '@/pages/artisans/artisanDashboard/ContentManagement/Content';

// In route configuration
<Route path="/artisan/story" element={<Content />} />
```

### State Management
The main `Content.jsx` component manages all state:
```jsx
const [storyContent, setStoryContent] = useState('');
const [mediaFiles, setMediaFiles] = useState([]);
const [lastSaved, setLastSaved] = useState(null);
```

### Auto-Save Logic
```jsx
useEffect(() => {
  if (storyContent || mediaFiles.length > 0) {
    const timer = setTimeout(() => {
      handleAutoSave();
    }, 2000);
    return () => clearTimeout(timer);
  }
}, [storyContent, mediaFiles]);
```

## API Integration (TODO)

### Save Story
```javascript
POST /api/artisan/story
Headers: { Authorization: Bearer <token> }
Body: {
  content: string,
  media: Array<File>
}
```

### Publish Story
```javascript
POST /api/artisan/story/publish
Headers: { Authorization: Bearer <token> }
Body: {
  content: string,
  media: Array<File>
}
```

### Get Story
```javascript
GET /api/artisan/story
Headers: { Authorization: Bearer <token> }
Response: {
  content: string,
  media: Array<MediaObject>,
  publishedAt: Date,
  updatedAt: Date
}
```

## Styling

### Color Scheme
- Primary: `#ec6d13` (CraftCurio orange)
- Background: `#f3ece7` (light), `#1b130d` (dark)
- Text: `#3a3028` (dark), `#f3ece7` (light)
- Secondary: `#9a6c4c` (muted text)
- Borders: `#e7d9cf` (light), `#4a392b` (dark)

### Responsive Breakpoints
```css
sm: 640px   /* Small devices */
md: 768px   /* Medium devices */
lg: 1024px  /* Large devices */
```

## File Upload Validation

### Accepted Types
- Images: `image/*` (JPG, PNG, GIF, etc.)
- Videos: `video/*` (MP4, MOV, etc.)

### Size Limits
- Maximum file size: 10MB per file
- Validation happens on frontend before upload

### Upload Flow
1. User drops file or clicks upload area
2. Validate file type and size
3. Show progress bar (0-100%)
4. Convert to object URL for preview
5. Add to gallery grid
6. Call API to save (TODO)

## Future Enhancements

### Product Stories Tab
- List of artisan's products
- Link stories to specific products
- Individual product story editor
- Product-specific media galleries

### Preview Modal
- Full-screen preview of story
- Show exactly how it will appear to buyers
- Edit directly from preview

### Rich Text Features
- Actual text formatting (not just buttons)
- Integration with rich text library (Draft.js, Slate, etc.)
- Inline image embedding
- Link management modal

### Media Management
- Image cropping/editing
- Video thumbnail generation
- Reorder media with drag & drop
- Bulk delete
- Media library with categories

### Analytics
- Story views count
- Engagement metrics
- Click-through rates

## Accessibility

- Keyboard navigation support
- ARIA labels on buttons
- Focus states on interactive elements
- Screen reader friendly
- High contrast mode support

## Performance

- Lazy loading for images
- Virtual scrolling for large galleries
- Debounced auto-save
- Optimized re-renders with React.memo (future)
- Image compression before upload (future)

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Testing Checklist

- [ ] Upload single image
- [ ] Upload multiple images
- [ ] Upload video
- [ ] Delete media item
- [ ] Type in editor and verify auto-save
- [ ] Switch between tabs
- [ ] Preview functionality
- [ ] Publish functionality
- [ ] Mobile responsive layout
- [ ] Drag & drop upload
- [ ] File type validation
- [ ] File size validation
- [ ] Last saved timestamp updates

## Known Issues

1. Rich text toolbar buttons are placeholders (no actual formatting)
2. Preview modal not implemented
3. API endpoints not created
4. No backend story storage
5. Media files stored as object URLs (need cloud storage integration)

## Dependencies

- React 18+
- React Router DOM 6+
- Lucide React (icons)
- Tailwind CSS 3+

## Contributing

When adding new features to this section:
1. Follow the existing component structure
2. Maintain consistent styling with CraftCurio theme
3. Ensure mobile responsiveness
4. Add proper prop validation
5. Document new components in this README
6. Update the testing checklist
