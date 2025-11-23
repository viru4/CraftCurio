# About Us Page Documentation

## Overview
A comprehensive, fully responsive About Us page for the CraftCurio marketplace platform. The page showcases the company's story, mission, team, achievements, and community impact through 10 distinct sections.

## File Structure

```
front-end/
├── src/
│   ├── pages/
│   │   └── AboutUs/
│   │       ├── AboutUs.jsx       # Main page component
│   │       └── index.js          # Export file
│   └── components/
│       └── aboutUs/
│           ├── HeroSection.jsx           # Welcome & introduction
│           ├── StorySection.jsx          # Company origin story
│           ├── MissionSection.jsx        # Mission, values & vision
│           ├── TeamSection.jsx           # Team member profiles
│           ├── TimelineSection.jsx       # Milestones & achievements
│           ├── UniqueSection.jsx         # Unique selling points
│           ├── ImpactSection.jsx         # Community impact
│           ├── TestimonialsSection.jsx   # Customer reviews
│           ├── GallerySection.jsx        # Visual showcase
│           ├── CTASection.jsx            # Call-to-action
│           └── index.js                  # Export file
```

## Page Sections

### 1. Hero Section
- **Purpose**: First impression with headline and tagline
- **Features**: 
  - Gradient background design
  - Hero image with hover effects
  - CTA buttons for story and contact
  - Decorative elements
- **Responsive**: Mobile-first, stacks vertically on mobile

### 2. Story Section
- **Purpose**: Company origin and inspiration
- **Features**:
  - Narrative text about founding
  - Supporting image
  - Icon highlights (Inspiration, Purpose, Community)
  - Card-based layout
- **Responsive**: 2-column grid on desktop, single column on mobile

### 3. Mission Section
- **Purpose**: Goals, values, and vision
- **Features**:
  - Mission statement card
  - 4 core values with icons
  - Vision statement banner
  - Color-coded value cards
- **Responsive**: 4-column grid on desktop, responsive down to single column

### 4. Team Section
- **Purpose**: Team member introductions
- **Features**:
  - Photo grid with hover effects
  - Social media links (LinkedIn, Email)
  - Bio and role information
  - 6 team members showcased
- **Responsive**: 3-column grid on desktop, 2 on tablet, 1 on mobile

### 5. Timeline Section
- **Purpose**: Company milestones and growth
- **Features**:
  - Vertical timeline with alternating layout
  - 6 major milestones from 2020-2024
  - Icon-based milestone cards
  - Stats summary grid
- **Responsive**: Vertical on mobile, alternating on desktop

### 6. Unique Section
- **Purpose**: Competitive differentiators
- **Features**:
  - 6 unique selling points
  - Icon-based cards with gradients
  - Bottom CTA banner
  - Hover animations
- **Responsive**: 3-column grid on desktop, stacks on mobile

### 7. Impact Section
- **Purpose**: Community and social impact
- **Features**:
  - 4 impact statistics
  - Initiative cards with images
  - Real artisan testimonials
  - Environmental sustainability info
- **Responsive**: 4-column stats grid, 2-column initiatives

### 8. Testimonials Section
- **Purpose**: Customer and artisan reviews
- **Features**:
  - Carousel with 6 testimonials
  - Manual navigation (arrows & dots)
  - 5-star ratings
  - Collector/Artisan badges
  - Thumbnail grid on desktop
- **Responsive**: Full-width carousel, thumbnails hidden on mobile

### 9. Gallery Section
- **Purpose**: Visual showcase of products and events
- **Features**:
  - Masonry grid layout
  - Category filtering (All, Products, Workshop, Events, Team)
  - Lightbox modal for full-size viewing
  - Hover overlays with titles
- **Responsive**: 3-column on desktop, 2 on tablet, 1 on mobile

### 10. CTA Section
- **Purpose**: Encourage user action
- **Features**:
  - 3 primary action cards (Shop, Sell, Contact)
  - Newsletter subscription form
  - Contact information
  - Social media links (Facebook, Instagram, Twitter, LinkedIn)
- **Responsive**: 3-column cards on desktop, stacks on mobile

## Features & Functionality

### Responsive Design
- **Mobile-first approach**: All components optimized for mobile
- **Breakpoints**: 
  - Mobile: < 640px
  - Tablet: 640px - 1024px
  - Desktop: > 1024px
- **Touch-friendly**: Large tap targets on mobile

### Animations & Interactions
- Smooth scroll for anchor links
- Hover effects on cards and images
- Scale transforms on buttons
- Carousel transitions
- Lightbox modal for gallery

### Accessibility
- Semantic HTML structure
- ARIA labels for buttons
- Alt text for all images
- Keyboard navigation support
- Focus states for interactive elements

### Performance
- Lazy loading ready (add loading="lazy" to images)
- Optimized component structure
- Minimal re-renders
- Clean code with comments

## Customization

### Images
Replace placeholder images with actual photos:
- Hero: `/api/placeholder/600/400` → Hero banner image
- Team: `/api/placeholder/300/300` → Team member photos
- Gallery: `/api/placeholder/*` → Product/event photos
- Story/Impact: Add actual workshop/artisan photos

### Content
Update content in each component file:
1. **HeroSection.jsx**: Headline, tagline
2. **StorySection.jsx**: Company story text
3. **MissionSection.jsx**: Mission statement, values
4. **TeamSection.jsx**: Team member details
5. **TimelineSection.jsx**: Milestones and dates
6. **UniqueSection.jsx**: Unique features
7. **ImpactSection.jsx**: Statistics, initiatives
8. **TestimonialsSection.jsx**: Customer quotes
9. **GallerySection.jsx**: Gallery images
10. **CTASection.jsx**: Contact info, social links

### Styling
All components use Tailwind CSS classes. Key color scheme:
- Primary: `amber-600` / `orange-600`
- Secondary: `stone-800` / `stone-600`
- Background: `stone-50` / `white`

To change colors, find and replace:
- `amber-600` → Your primary color
- `stone-800` → Your text color

## Route Configuration

The About Us page is accessible at `/about-us` and is integrated into:
- **AppRoutes.jsx**: Route definition
- **Navbar.jsx**: Desktop and mobile navigation links

## Dependencies

Required packages (already in project):
- React
- React Router DOM (Link, useNavigate)
- Lucide React (Icons)
- Tailwind CSS (Styling)

## Usage

### Accessing the Page
```
http://localhost:5173/about-us
```

### Navigation
- Click "About Us" in the main navigation
- Smooth scroll to sections using anchor links
- Mobile menu includes About Us link

## Best Practices

1. **Images**: Use high-quality images (min 1200px wide for hero)
2. **Content**: Keep text concise and engaging
3. **Updates**: Regularly update testimonials and statistics
4. **Testing**: Test on multiple devices and screen sizes
5. **Performance**: Compress images before deployment

## Future Enhancements

Potential improvements:
- [ ] Add video testimonials
- [ ] Integrate with backend for dynamic team data
- [ ] Add animation on scroll (AOS library)
- [ ] Implement sharing functionality
- [ ] Add multilingual support
- [ ] Include live chat widget
- [ ] Add team member detail pages
- [ ] Implement blog integration

## Browser Support

Tested and working on:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Notes

- All sections are independently reusable
- Easy to add/remove sections by editing AboutUs.jsx
- Smooth scroll implemented for anchor navigation
- Page auto-scrolls to top on mount
- All components fully documented with JSDoc comments
