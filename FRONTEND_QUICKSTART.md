# Collector Dashboard Frontend - Quick Start

## 🚀 Get Started in 5 Minutes

### 1. Install & Run

```bash
cd front-end
npm install
npm run dev
```

Visit: `http://localhost:5173`

### 2. Environment Setup

Create `front-end/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## 📦 What's Included

### ✅ Complete Frontend Components
- **CollectibleCard**: Display collectibles with image, price, status
- **ListForm**: Create/edit direct sales & auctions
- **Dashboard**: Tabs, search, filtering, sorting
- **AuctionPage**: Live bidding with real-time updates
- **CollectorDashboardPage**: Main integration page

### ✅ Custom React Hooks
- **useCollectibles**: 6 hooks for collectibles CRUD
- **useAuction**: 5 hooks for auction operations with real-time updates

### ✅ Utilities
- **api.js**: Axios instance with 19+ API functions
- **socket.js**: Socket.io client with event management

### ✅ State Management
- **CollectorContext**: Global state for dashboard

## 🎯 Usage Examples

### Basic Integration

```jsx
// In your App.jsx
import { CollectorDashboardPage } from './pages/CollectorDashboardPage';

function App() {
  return <CollectorDashboardPage />;
}
```

### Using Hooks

```jsx
// Fetch collectibles
const { collectibles, isLoading } = useCollectibles({ 
  page: 1, 
  limit: 20 
});

// Create new collectible
const { createCollectible, isCreating } = useCreateCollectible();
await createCollectible({
  title: 'Ceramic Vase',
  saleType: 'direct',
  price: 100
});

// Place bid on auction
const { placeBid, isPlacingBid } = usePlaceBid();
await placeBid('auctionId', 150.00);
```

### API Calls

```jsx
import { getCollectibles, placeBid } from './utils/api';

// Get all collectibles
const data = await getCollectibles({ page: 1, limit: 20 });

// Place bid
const result = await placeBid('auctionId', 150.00);
```

## 🔥 Key Features

### Direct Sales
- Create listings with fixed price
- Edit/delete listings
- View statistics (views, likes)
- Promote listings

### Auctions
- Set starting bid, reserve price, buy now price
- Schedule start/end times
- Real-time countdown timers
- Live bidding with automatic minimum bid calculation
- Bid history
- Buy now option
- Reserve price status

### Real-Time Updates (Socket.io)
- New bid notifications
- Countdown updates (every 10 seconds)
- Auction ending soon alerts
- Auction ended notifications
- Automatic reconnection

### Dashboard
- Three tabs: Direct Listings, Auctions, Add New
- Search with debouncing
- Filter by status
- Sort by date, price, views, title
- Responsive grid (1-4 columns)

## 📱 Responsive Design

Mobile-first design with Tailwind CSS:
- **Mobile**: 1 column grid
- **Tablet (640px+)**: 2 columns
- **Desktop (1024px+)**: 3 columns
- **Large (1280px+)**: 4 columns

## 🎨 UI Components

### Status Badges
- **Live**: Green with pulse animation
- **Scheduled**: Blue
- **Ended**: Gray
- **Sold**: Purple
- **Cancelled**: Red

### Action Buttons
- **View**: View details (orange)
- **Edit**: Edit listing (blue)
- **Promote**: Promote listing (yellow)
- **Delete**: Delete listing (red, disabled if auction has bids)

## 🔧 Configuration

### Tailwind Colors
- Primary: `orange-600`
- Success: `green-600`
- Warning: `yellow-500`
- Danger: `red-600`

### API Endpoints

All endpoints are prefixed with `VITE_API_BASE_URL`:

**Collectibles:**
- GET `/collectibles` - List all
- GET `/collectibles/:id` - Get one
- POST `/collectibles` - Create
- PUT `/collectibles/:id` - Update
- DELETE `/collectibles/:id` - Delete
- GET `/collectors/:id/listings` - Collector's listings

**Auctions:**
- GET `/auctions/live` - Live auctions
- GET `/auctions/:id` - Auction details
- POST `/auctions/:id/bid` - Place bid
- POST `/auctions/:id/buy-now` - Buy now
- DELETE `/auctions/:id/cancel` - Cancel auction

**Auth:**
- POST `/auth/login` - Login
- POST `/auth/register` - Register

### Socket.io Events

**Emit (Client → Server):**
- `joinAuction` - Join auction room
- `leaveAuction` - Leave auction room

**Listen (Server → Client):**
- `newBid` - New bid placed
- `countdownUpdate` - Timer update
- `auctionEndingSoon` - < 5 min remaining
- `auctionEnded` - Auction ended
- `auctionCancelled` - Auction cancelled

## 🐛 Common Issues

### Socket not connecting
```bash
# Check environment variable
echo $VITE_SOCKET_URL

# Should be: http://localhost:5000
```

### API calls failing
```bash
# Check environment variable
echo $VITE_API_BASE_URL

# Should be: http://localhost:5000/api

# Check JWT token
# Open browser console → Application → Local Storage → token
```

### Images not showing
- Verify image URLs are valid and accessible
- Check for CORS issues
- Component has fallback icon if image fails

## 📚 Documentation

Full documentation: `FRONTEND_GUIDE.md`

## 🚀 Production Build

```bash
npm run build
```

Output: `dist/` directory

Deploy to:
- **Vercel**: `vercel`
- **Netlify**: Connect repo, build: `npm run build`, dir: `dist`
- **AWS S3**: Upload `dist` folder

## ✨ Next Steps

1. ✅ Components are ready to use
2. ✅ Hooks are implemented
3. ✅ API integration is complete
4. ✅ Socket.io is configured
5. ⏭️ Update `App.jsx` to import `CollectorDashboardPage`
6. ⏭️ Test with backend server running
7. ⏭️ Customize styling as needed

## 📞 Support

- Review `FRONTEND_GUIDE.md` for detailed documentation
- Check component comments for inline documentation
- Review backend `API_REFERENCE.md` for endpoint details
