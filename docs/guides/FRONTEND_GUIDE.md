# Collector Dashboard Frontend - Complete Guide

## Overview

This is a modern, responsive React frontend for the CraftCurio collector dashboard. It enables collectors to manage their craft collectibles with both direct sale and auction listing capabilities, featuring real-time bidding updates via Socket.io.

## Features

### Core Functionality
- ✅ **Dual Sale Types**: Support for direct sale and auction listings
- ✅ **Real-Time Auctions**: Live bid updates, countdown timers, and status changes via Socket.io
- ✅ **Payment Gateway**: Razorpay integration for secure payments (Card/UPI/Wallet)
- ✅ **Auction Management**: Post-auction dashboard for tracking orders and payments
- ✅ **AI Content Generation**: Automated product descriptions, titles, and keywords using Llama-3.2 and BLIP-2
- ✅ **AI Chatbot**: Intelligent customer support with intent detection and context-aware responses
- ✅ **CRUD Operations**: Complete create, read, update, delete functionality for collectibles
- ✅ **Advanced Filtering**: Search, status filtering, and sorting (by date, price, views, title)
- ✅ **Responsive Design**: Mobile-first design with Tailwind CSS
- ✅ **State Management**: Global state with React Context API
- ✅ **Notifications**: Real-time in-app notifications for auction events

### Auction Features
- Live countdown timers with real-time updates
- Automatic minimum bid calculation (5% increment, min $1)
- Buy Now option for instant purchase
- Bid history with timestamps
- Reserve price status indicators
- Auction status badges (scheduled, live, ended, sold, cancelled)

## Tech Stack

- **React 18**: UI library
- **Vite**: Build tool and dev server
- **Axios**: HTTP client with interceptors
- **Socket.io-client**: Real-time WebSocket communication
- **Razorpay Checkout**: Payment gateway integration
- **Tailwind CSS**: Utility-first CSS framework
- **PropTypes**: Runtime type checking

## Project Structure

```
front-end/src/
├── components/
│   ├── CollectorDashboard/
│   │   ├── CollectibleCard.jsx      # Card component for displaying items
│   │   ├── ListForm.jsx             # Form for creating/editing listings
│   │   ├── Dashboard.jsx            # Main dashboard with tabs
│   │   ├── AuctionPage.jsx          # Live auction viewing/bidding
│   │   └── index.js                 # Component exports
│   └── common/
│       ├── ContentGenerator.jsx     # AI content generation (NEW)
│       └── Chatbot.jsx              # AI chatbot assistant (NEW)
├── pages/
│   ├── CollectorDashboardPage.jsx   # Main page integration
│   ├── collector/
│   │   └── components/
│   │       ├── AuctionManagement.jsx    # Post-auction management
│   │       ├── AuctionCard.jsx          # Auction status display
│   │       ├── OrderDetailsModal.jsx    # Order details & payment
│   │       └── NotificationPanel.jsx    # Notifications panel
│   └── Order/
│       ├── CheckOut.jsx             # Checkout with Razorpay
│       └── OrderConfirmation.jsx    # Order success page
├── contexts/
│   ├── CollectorContext.jsx         # Global state management
│   └── ChatbotContext.jsx           # Chatbot state (NEW)
├── hooks/
│   ├── useCollectibles.js           # Hooks for collectibles CRUD
│   ├── useAuction.js                # Hooks for auction operations
│   └── useRazorpay.js               # Payment processing hook
├── utils/
│   ├── api.js                       # Axios instance and API functions
│   └── socket.js                    # Socket.io client wrapper
└── App.jsx                          # Root component
```

## Installation & Setup

### 1. Install Dependencies

```bash
cd front-end
npm install
```

### 2. Environment Configuration

Create a `.env` file in the `front-end` directory:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_SOCKET_URL=http://localhost:8000
```

### 3. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Component Usage

### CollectorDashboardPage (Main Entry Point)

```jsx
import { CollectorDashboardPage } from './components/CollectorDashboard';

function App() {
  return <CollectorDashboardPage />;
}
```

This is the main page that integrates all components and manages navigation between views.

### Dashboard Component

The main dashboard with three tabs:
- **Direct Listings**: View and manage direct sale items
- **My Auctions**: View and manage auction listings
- **Add Collectible**: Navigate to create new listing

Features:
- Search bar with debouncing (500ms)
- Status filtering (active, sold, inactive, scheduled, live, ended, cancelled)
- Sorting options (newest, price, views, title)
- Responsive grid layout (1-4 columns)
- Empty states, loading states, error handling

### CollectibleCard Component

Displays a collectible item in card format:

```jsx
<CollectibleCard
  collectible={collectibleObject}
  onEdit={(item) => console.log('Edit', item)}
  onDelete={(id) => console.log('Delete', id)}
  onPromote={(item) => console.log('Promote', item)}
  onView={(item) => console.log('View', item)}
  showActions={true}
/>
```

**Props:**
- `collectible`: Collectible object (required)
- `onEdit`: Callback for edit action
- `onDelete`: Callback for delete action
- `onPromote`: Callback for promote action
- `onView`: Callback for view action
- `showActions`: Boolean to show/hide action buttons (default: true)

**Card Features:**
- Product image with fallback
- Status badges (live, scheduled, sold, cancelled)
- Sale type indicator (auction/direct)
- Promoted badge
- Real-time countdown for live auctions
- Price/bid display
- Stats (views, likes)
- Action buttons (view, edit, promote, delete)

### ListForm Component

Form for creating or editing collectibles:

```jsx
<ListForm
  initialData={existingCollectible} // Optional, for edit mode
  onSubmit={(data) => console.log('Submit', data)}
  onCancel={() => console.log('Cancel')}
  isLoading={false}
/>
```

**Form Fields:**

**Basic Information:**
- Title (required, min 3 chars)
- Description (required, min 10 chars)
- Category (required, dropdown)
- Image URL (required, with preview)

**Sale Type Selection:**
- Direct Sale or Auction (radio buttons)
- Cannot change after creation (edit mode)

**Direct Sale Fields:**
- Price ($)

**Auction Fields:**
- Starting Bid ($)
- Reserve Price ($) - optional, not visible to bidders
- Buy Now Price ($) - optional, enables instant purchase
- Start Time (datetime picker)
- End Time (datetime picker, must be at least 1 hour after start)

**Validation:**
- All required fields checked
- Price/bid amounts must be > 0
- Reserve price must be >= starting bid
- Buy now price must be > starting bid
- Start time cannot be in past (create mode)
- End time must be after start time
- Minimum auction duration: 1 hour
- URL validation for image

### AuctionPage Component

Live auction viewing and bidding interface:

```jsx
<AuctionPage
  auctionId="auction123"
  onClose={() => console.log('Close')}
  onBuySuccess={(auction) => console.log('Purchased', auction)}
/>
```

**Features:**
- Full-screen modal overlay
- Real-time countdown timer (updates every second)
- Current bid display with total bids count
- Live bidding form with validation
- Buy Now option (if available)
- Expandable bid history
- Reserve price status indicator
- Item details (image, description, category)
- Auction status badges
- Real-time updates via Socket.io:
  - New bid notifications
  - Countdown updates
  - Auction ending soon alerts
  - Auction ended notifications

### ContentGenerator Component (AI)

AI-powered content generation for product listings:

```jsx
import { ContentGenerator } from '@/components/common/ContentGenerator';

<ContentGenerator
  productData={{
    name: "Handcrafted Vase",
    category: "Pottery",
    materials: "Ceramic",
    images: ["url1", "url2"]
  }}
  contentType="description"
  onContentGenerated={(content) => {
    console.log('Generated:', content);
  }}
/>
```

**Features:**
- 7 content generation types: description, titles, keywords, social-post, enhance, auction-announcement, category-description
- Vision-language analysis for product images
- Professional text formatting
- Loading states with generation messages
- Preview with character/word count
- "Use This" button to apply generated content
- Error handling with retry option

**Content Types:**
- `description` - Product description (50-100 words)
- `titles` - 5 SEO-optimized title variations
- `keywords` - 10 relevant search keywords
- `social-post` - Social media content with hashtags
- `enhance` - Improve existing description
- `auction-announcement` - Auction promotional text
- `category-description` - Category page content

**Usage in Forms:**
```jsx
<ContentGenerator
  productData={formData}
  contentType="description"
  onContentGenerated={(generated) => {
    setFormData(prev => ({ ...prev, description: generated }));
  }}
/>
```

### Chatbot Component (AI)

Intelligent AI chatbot for customer support:

```jsx
import { Chatbot } from '@/components/common/Chatbot';
import { ChatbotProvider } from '@/contexts/ChatbotContext';

<ChatbotProvider>
  <Chatbot />
</ChatbotProvider>
```

**Features:**
- Context-aware responses using Llama-3.2-3B
- Intent detection (search, auction, order, payment, account, help)
- Conversation history with localStorage persistence
- 6 dynamic quick reply buttons
- Typing indicators
- Message timestamps
- Clear history option
- Expandable/collapsible interface
- Mobile-responsive design

**Supported Intents:**
- 🔍 Search - Product discovery
- 🏛️ Auction - Bidding and auction help
- 📦 Order - Order tracking and status
- 💳 Payment - Payment methods and issues
- 👤 Account - Account management
- ❓ Help - General platform assistance

**Quick Replies:**
- 📦 Browse Categories
- 🔍 Track Order
- 🏛️ Auction Help
- 💳 Payment Info
- ❓ How to Bid
- 👤 Account Help

## Hooks Documentation

### useCollectibles Hooks

**useCollectibles(options)**
```javascript
const { collectibles, isLoading, error, pagination } = useCollectibles({
  page: 1,
  limit: 20,
  saleType: 'direct', // or 'auction'
  status: 'active',
  sortBy: 'createdAt:desc'
});
```

**useCollectible(id)**
```javascript
const { collectible, isLoading, error } = useCollectible('collectibleId');
```

**useCollectorListings(options)**
```javascript
const { collectibles, isLoading, error, pagination, refetch } = useCollectorListings({
  page: 1,
  limit: 20,
  saleType: 'auction',
  status: 'live'
});
```

**useCreateCollectible()**
```javascript
const { createCollectible, isCreating, createError } = useCreateCollectible();

await createCollectible({
  title: 'Handcrafted Vase',
  description: 'Beautiful ceramic vase',
  category: 'Pottery',
  image: 'https://example.com/image.jpg',
  saleType: 'auction',
  auction: {
    startingBid: 50,
    reservePrice: 100,
    buyNowPrice: 200,
    startTime: '2024-01-01T10:00:00Z',
    endTime: '2024-01-02T10:00:00Z'
  }
});
```

**useUpdateCollectible()**
```javascript
const { updateCollectible, isUpdating, updateError } = useUpdateCollectible();

await updateCollectible('collectibleId', {
  title: 'Updated Title',
  price: 75
});
```

**useDeleteCollectible()**
```javascript
const { deleteCollectible, isDeleting, deleteError } = useDeleteCollectible();

await deleteCollectible('collectibleId');
```

### useAuction Hooks

**useLiveAuctions(options)**
```javascript
const { auctions, isLoading, error, pagination } = useLiveAuctions({
  page: 1,
  limit: 20
});
```

**useAuction(auctionId)** - With Real-Time Updates
```javascript
const { auction, isLoading, error, timeRemaining } = useAuction('auctionId');
// timeRemaining updates every second
// auction updates on new bids, status changes
```

**usePlaceBid()**
```javascript
const { placeBid, isPlacingBid, bidError } = usePlaceBid();

await placeBid('auctionId', 150.00);
```

**useBuyNow()**
```javascript
const { buyNow, isBuying, buyError } = useBuyNow();

await buyNow('auctionId');
```

**useCancelAuction()**
```javascript
const { cancelAuction, isCancelling, cancelError } = useCancelAuction();

await cancelAuction('auctionId');
```

## Context API

### CollectorContext

Provides global state for the dashboard:

```javascript
import { useCollectorContext } from './contexts/CollectorContext';

function MyComponent() {
  const {
    collector,
    setCollector,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    sortBy,
    setSortBy,
    refreshTrigger,
    triggerRefresh
  } = useCollectorContext();
  
  // Use state...
}
```

**State Properties:**
- `collector`: Current collector profile object
- `activeTab`: Current tab ('direct' | 'auction' | 'add')
- `searchQuery`: Search input value
- `filterStatus`: Selected status filter
- `sortBy`: Selected sort option
- `refreshTrigger`: Counter for triggering refetch

## API Functions

All API functions are in `src/utils/api.js`:

### Collectibles
```javascript
import { 
  getCollectibles, 
  getCollectible, 
  createCollectible, 
  updateCollectible, 
  deleteCollectible,
  getCollectorListings 
} from './utils/api';

// Fetch all collectibles
const data = await getCollectibles({ page: 1, limit: 20, saleType: 'auction' });

// Fetch single collectible
const collectible = await getCollectible('collectibleId');

// Create collectible
const newCollectible = await createCollectible({ title, description, ... });

// Update collectible
const updated = await updateCollectible('id', { price: 100 });

// Delete collectible
await deleteCollectible('id');

// Get collector's listings
const listings = await getCollectorListings({ page: 1, limit: 20 });
```

### Auctions
```javascript
import { 
  getLiveAuctions, 
  getAuction, 
  placeBid, 
  buyNow, 
  cancelAuction 
} from './utils/api';

// Get live auctions
const auctions = await getLiveAuctions({ page: 1, limit: 20 });

// Get auction details
const auction = await getAuction('auctionId');

// Place bid
const result = await placeBid('auctionId', 150.00);

// Buy now
const purchase = await buyNow('auctionId');

// Cancel auction
await cancelAuction('auctionId');
```

### Authentication
```javascript
import { login, register, logout } from './utils/api';

// Login
const { token, user } = await login('email@example.com', 'password');

// Register
const { token, user } = await register({ name, email, password });

// Logout
logout();
```

## Socket.io Integration

### Initialization

Socket.io is automatically initialized when using the `useAuction` hook with an auction ID:

```javascript
const { auction, timeRemaining } = useAuction('auctionId');
// Socket connection established automatically
// Cleanup on component unmount
```

### Manual Socket Usage

```javascript
import { 
  initializeSocket, 
  joinAuction, 
  leaveAuction,
  onNewBid,
  onCountdownUpdate,
  onAuctionEndingSoon,
  onAuctionEnded,
  onAuctionCancelled 
} from './utils/socket';

// Initialize socket
const socket = initializeSocket();

// Join auction room
joinAuction('auctionId');

// Listen for events
onNewBid((data) => {
  console.log('New bid:', data);
});

onCountdownUpdate((data) => {
  console.log('Time remaining:', data.timeRemaining);
});

// Leave auction room
leaveAuction('auctionId');
```

### Socket Events

**Client → Server:**
- `joinAuction`: Join auction room
- `leaveAuction`: Leave auction room

**Server → Client:**
- `newBid`: New bid placed (includes bidder, amount, timestamp)
- `countdownUpdate`: Countdown timer update (every 10 seconds)
- `auctionEndingSoon`: Warning when < 5 minutes remain
- `auctionEnded`: Auction has ended (includes winner)
- `auctionCancelled`: Auction was cancelled
- `bidError`: Bid placement error

## Styling with Tailwind CSS

The project uses Tailwind CSS for styling. Key classes used:

### Colors
- Primary: `orange-600`, `orange-700` (buttons, accents)
- Success: `green-600`, `green-700` (buy now, active)
- Warning: `yellow-500`, `yellow-600` (promoted, pending)
- Danger: `red-600`, `red-700` (delete, cancelled)
- Neutral: `gray-50` to `gray-900` (backgrounds, text)

### Responsive Breakpoints
- `sm:`: 640px
- `md:`: 768px
- `lg:`: 1024px
- `xl:`: 1280px

### Grid Layouts
```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {/* 1 column on mobile, 2 on tablet, 3 on desktop, 4 on large screens */}
</div>
```

## Error Handling

All API calls include error handling:

```javascript
try {
  await createCollectible(data);
} catch (error) {
  // Error is automatically handled by hooks
  // Display error to user
  console.error('Error:', error.message);
}
```

**Common Errors:**
- 400: Validation error (invalid data)
- 401: Unauthorized (no token or expired)
- 403: Forbidden (insufficient permissions)
- 404: Not found (resource doesn't exist)
- 500: Server error

## Performance Optimizations

### 1. Search Debouncing
Search queries are debounced by 500ms to reduce API calls:
```javascript
useEffect(() => {
  const timer = setTimeout(() => {
    setSearchQuery(localSearchQuery);
  }, 500);
  return () => clearTimeout(timer);
}, [localSearchQuery]);
```

### 2. Socket.io Connection Management
- Singleton socket instance (one connection per app)
- Automatic reconnection on disconnect
- Cleanup on component unmount

### 3. Lazy Loading
Consider implementing lazy loading for routes:
```javascript
const CollectorDashboardPage = lazy(() => import('./pages/CollectorDashboardPage'));
```

## Testing

### Manual Testing Checklist

**Direct Sale Listing:**
- [ ] Create new direct sale listing
- [ ] Edit existing direct sale
- [ ] Delete direct sale
- [ ] View direct sale details
- [ ] Search for direct sale
- [ ] Filter by status
- [ ] Sort listings

**Auction Listing:**
- [ ] Create new auction
- [ ] Edit auction (before bids)
- [ ] Cannot delete auction with bids
- [ ] View auction details
- [ ] Real-time countdown updates
- [ ] Place bid (minimum bid validation)
- [ ] Bid history updates in real-time
- [ ] Buy now functionality
- [ ] Reserve price indicator
- [ ] Auction ending soon notification
- [ ] Auction ended notification

**UI/UX:**
- [ ] Mobile responsive (320px - 1920px)
- [ ] Loading states display correctly
- [ ] Error messages are clear
- [ ] Empty states with helpful text
- [ ] Form validation works
- [ ] Image preview works
- [ ] Tabs navigation works
- [ ] Search debouncing works

## Deployment

### Production Build

```bash
npm run build
```

This creates an optimized build in the `dist` directory.

### Environment Variables for Production

```env
VITE_API_BASE_URL=https://api.craftcurio.com/api
VITE_SOCKET_URL=https://api.craftcurio.com
```

### Deployment Options

1. **Vercel** (Recommended)
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Netlify**
   - Connect GitHub repo
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **AWS S3 + CloudFront**
   - Upload `dist` folder to S3
   - Configure CloudFront distribution
   - Set up custom domain

## Troubleshooting

### Socket.io Not Connecting
- Check `VITE_SOCKET_URL` environment variable
- Ensure backend Socket.io server is running
- Check browser console for CORS errors
- Verify network connectivity

### API Calls Failing
- Check `VITE_API_BASE_URL` environment variable
- Verify JWT token in localStorage
- Check backend server is running
- Inspect network tab for error responses

### Images Not Displaying
- Verify image URLs are valid
- Check CORS settings on image server
- Ensure image URLs are HTTPS in production
- Use image fallback (already implemented)

### Real-Time Updates Not Working
- Check Socket.io connection status
- Verify user is in correct auction room
- Check browser console for Socket.io errors
- Ensure backend is emitting events correctly

## Future Enhancements

### Recently Added ✅
- [x] Razorpay payment gateway integration
- [x] Auction management dashboard
- [x] Post-auction order tracking
- [x] Payment processing with multiple methods
- [x] Real-time notification system
- [x] Order details modal with payment
- [x] Currency localization (INR)

### Planned Features
- [ ] Payment timeout automation
- [ ] Shipping status tracking
- [ ] Review and rating system
- [ ] Image upload (instead of URL)
- [ ] Multiple images per collectible
- [ ] Toast notification system
- [ ] User profile management
- [ ] Bid history page
- [ ] Wishlist functionality
- [ ] Share collectibles (social media)
- [ ] Advanced search filters
- [ ] Export data (CSV/PDF)
- [ ] Dark mode

### Performance Improvements
- [ ] Implement virtual scrolling for large lists
- [ ] Add pagination for bid history
- [ ] Optimize image loading (lazy load, WebP format)
- [ ] Add service worker for offline support
- [ ] Implement React.memo for expensive components

## Support

For issues or questions:
- Check documentation above
- Review code comments in components
- Check backend API documentation
- Review Socket.io event documentation

## License

Copyright © 2024 CraftCurio. All rights reserved.
