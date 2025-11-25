# Craft Marketplace Collector Dashboard - Auction & Direct Sale Backend

## Overview

Complete Node.js/Express backend implementation for a craft marketplace supporting both **direct sale** and **auction** listings for collectibles. Built with MongoDB/Mongoose, Socket.io for real-time features, and comprehensive validation.

## 🚀 Features Implemented

### 1. **Enhanced Data Models**

#### Collectible Model (`src/models/Collectible.js`)
- ✅ `saleType`: 'direct' or 'auction'
- ✅ `owner`: Reference to Collector who listed the item
- ✅ `promoted`: Featured/sponsored listing flag
- ✅ Auction fields:
  - `startTime`, `endTime`: Auction timing
  - `reservePrice`: Minimum price to sell
  - `currentBid`: Current highest bid
  - `minimumBidIncrement`: Required bid increase
  - `buyNowPrice`: Optional instant purchase price
  - `bidHistory`: Array of all bids with bidder info
  - `winner`: Final auction winner
  - `auctionStatus`: scheduled|live|ended|cancelled|sold
  - `totalBids`, `uniqueBidders`: Statistics
- ✅ Virtual properties for auction status checking
- ✅ Comprehensive indexes for performance

#### Collector Model (`src/models/Collector.js`)
- ✅ `listedCollectibles`: Array of owned listings
- ✅ `activeBids`: Current active bids by collector
- ✅ `wonAuctions`: History of won auctions

### 2. **RESTful API Endpoints**

#### Collectible Endpoints (`/api/collectibles`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/` | Create new listing (direct/auction) | Private (Authenticated) |
| POST | `/bulk` | Bulk create (seeding/admin) | Private (Admin) |
| GET | `/` | Get all collectibles with filters | Public |
| GET | `/featured` | Get featured collectibles | Public |
| GET | `/popular` | Get popular items | Public |
| GET | `/recent` | Get recent listings | Public |
| GET | `/promoted` | Get promoted/sponsored items | Public |
| GET | `/:id` | Get single collectible details | Public |
| PUT | `/:id` | Update listing | Private (Owner/Admin) |
| PATCH | `/:id` | Partial update | Private (Owner/Admin) |
| DELETE | `/:id` | Delete listing | Private (Owner/Admin) |
| PUT | `/:id/like` | Like/favorite item | Public |

**Query Parameters for GET /**:
- `page`, `limit`: Pagination
- `category`: Filter by category
- `saleType`: Filter by 'direct' or 'auction'
- `status`: Filter by status
- `promoted`, `featured`, `popular`, `recent`: Boolean filters
- `minPrice`, `maxPrice`: Price range
- `search`: Text search

#### Auction Endpoints (`/api/auction`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/live` | Get all live auctions | Public |
| GET | `/:id` | Get auction details with stats | Public |
| POST | `/:id/bid` | Place a bid | Private (Authenticated) |
| POST | `/:id/buy-now` | Instant purchase | Private (Authenticated) |
| POST | `/:id/cancel` | Cancel auction (no bids) | Private (Owner/Admin) |
| POST | `/:id/finalize` | Manually finalize auction | Private (Admin) |

**Query Parameters for GET /live**:
- `page`, `limit`: Pagination
- `category`: Filter by category
- `sortBy`: endingSoon|mostBids|highestBid|newest

#### Collector Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/collector/:id/listings` | Get collector's listings | Public |

### 3. **Auction Business Logic** (`src/services/auctionService.js`)

#### Bid Validation
- ✅ Prevents owner from bidding on own auction
- ✅ Validates auction is live and active
- ✅ Enforces minimum bid increment
- ✅ Prevents duplicate bids from same user
- ✅ Checks auction timing (not started/ended)

#### Winner Calculation
- ✅ Determines highest bidder at auction end
- ✅ Checks reserve price met
- ✅ Updates collector records with won auctions
- ✅ Handles auctions with no bids

#### Auction Finalization
- ✅ Automatically finalizes expired auctions
- ✅ Updates auction status (sold/ended)
- ✅ Sends email notifications to:
  - Winner (congratulations)
  - Seller (sale confirmation)
  - Losing bidders (outbid notification)
- ✅ Handles reserve not met scenarios

#### Periodic Tasks
- ✅ `checkExpiredAuctions()`: Runs every minute via cron
- ✅ `updateAuctionStatus()`: Updates scheduled → live → ended

### 4. **Real-Time Features** (Socket.io)

#### Socket Events (`src/sockets/auctionSocket.js`)

**Client → Server Events:**
- `joinAuction`: Join an auction room for updates
- `leaveAuction`: Leave an auction room
- `getAuctionStatus`: Request current status
- `watchAuctions`: Monitor multiple auctions

**Server → Client Events:**
- `auctionData`: Initial auction data on join
- `newBid`: Real-time bid placed notification
- `countdownUpdate`: Countdown timer updates (every 10s)
- `auctionEndingSoon`: Alert when <5 minutes remain
- `auctionEnded`: Auction completed notification
- `auctionCancelled`: Auction cancelled by owner
- `auctionStatusChanged`: Status change notification
- `error`: Error messages

#### Background Processes
- ✅ Countdown broadcast every 10 seconds
- ✅ Expired auction check every 60 seconds
- ✅ Room-based broadcasting for efficiency

### 5. **Security & Validation**

#### Authentication Middleware (`src/middleware/authMiddleware.js`)
- ✅ JWT token verification
- ✅ User attachment to requests
- ✅ Optional authentication for public endpoints

#### Validation Middleware (`src/middleware/validation.js`)
- ✅ Zod schema validation for all inputs
- ✅ Separate schemas for direct sale vs auction
- ✅ ObjectId format validation
- ✅ Ownership verification
- ✅ Request body/query parameter validation

#### Protected Operations
- ✅ Creating listings requires authentication
- ✅ Updating/deleting requires ownership or admin role
- ✅ Placing bids requires authentication
- ✅ Active auctions with bids cannot be deleted
- ✅ Key auction parameters locked after bids placed

### 6. **Code Organization**

```
backend/
├── src/
│   ├── models/
│   │   ├── Collectible.js         # Enhanced with auction fields
│   │   └── Collector.js           # Enhanced with listings tracking
│   ├── api/
│   │   ├── controllers/
│   │   │   ├── collectibleController.js  # CRUD for all listings
│   │   │   └── auctionController.js      # Auction-specific logic
│   │   └── routes/
│   │       ├── collectibles.js    # Collectible endpoints
│   │       └── auction.js         # Auction endpoints
│   ├── services/
│   │   ├── auctionService.js      # Auction business logic
│   │   └── emailService.js        # Email notifications
│   ├── middleware/
│   │   ├── authMiddleware.js      # JWT authentication
│   │   ├── validation.js          # Request validation
│   │   ├── errorHandler.js        # Error handling
│   │   └── roleMiddleware.js      # Role-based access
│   ├── sockets/
│   │   └── auctionSocket.js       # Socket.io handlers
│   ├── app.js                     # Express app configuration
│   └── config/
│       └── dbConfig.js            # MongoDB connection
├── server.js                      # Server entry with Socket.io
└── package.json                   # Dependencies (socket.io added)
```

## 📦 Installation

### 1. Install Dependencies

```bash
cd backend
npm install
```

This will install the newly added `socket.io` package along with existing dependencies.

### 2. Environment Variables

Ensure your `.env` file includes:

```env
PORT=8000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development

# Email configuration (for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

### 3. Start Server

```bash
npm start
```

The server will start with:
- ✅ MongoDB connection
- ✅ Express REST API
- ✅ Socket.io real-time features
- ✅ Auction background tasks

## 🎯 Usage Examples

### Creating a Direct Sale Listing

```javascript
POST /api/collectibles
Authorization: Bearer <token>

{
  "title": "Vintage Pottery Vase",
  "description": "Beautiful handcrafted vase from 1950s",
  "price": 150,
  "category": "Pottery",
  "image": "https://example.com/vase.jpg",
  "saleType": "direct",
  "tags": ["vintage", "pottery", "1950s"]
}
```

### Creating an Auction Listing

```javascript
POST /api/collectibles
Authorization: Bearer <token>

{
  "title": "Rare Collectible Coin",
  "description": "1890 silver dollar in mint condition",
  "price": 100,  // Starting bid
  "category": "Coins",
  "image": "https://example.com/coin.jpg",
  "saleType": "auction",
  "auction": {
    "startTime": "2025-11-25T10:00:00Z",
    "endTime": "2025-11-30T10:00:00Z",
    "reservePrice": 500,
    "minimumBidIncrement": 25,
    "buyNowPrice": 1000,
    "auctionStatus": "scheduled"
  },
  "tags": ["coin", "rare", "1890"]
}
```

### Placing a Bid

```javascript
POST /api/auction/:id/bid
Authorization: Bearer <token>

{
  "bidAmount": 150,
  "bidderId": "collector_id",
  "bidderName": "John Doe",
  "bidderEmail": "john@example.com"
}
```

### Buy Now

```javascript
POST /api/auction/:id/buy-now
Authorization: Bearer <token>

{
  "buyerId": "collector_id",
  "buyerName": "Jane Smith",
  "buyerEmail": "jane@example.com"
}
```

### Get Live Auctions

```javascript
GET /api/auction/live?sortBy=endingSoon&page=1&limit=20
```

### Socket.io Client Connection

```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:8000');

// Join an auction room
socket.emit('joinAuction', { collectibleId: 'auction_id' });

// Listen for new bids
socket.on('newBid', (data) => {
  console.log('New bid:', data);
  // Update UI with new bid amount
});

// Listen for countdown updates
socket.on('countdownUpdate', (data) => {
  console.log('Time remaining:', data.timeRemaining);
  // Update countdown timer
});

// Listen for auction ending soon
socket.on('auctionEndingSoon', (data) => {
  console.log('Auction ending soon!', data);
  // Show alert to user
});

// Listen for auction ended
socket.on('auctionEnded', (data) => {
  console.log('Auction ended:', data);
  // Show results
});
```

## 🔧 Key Features Detail

### Auction Lifecycle Management

1. **Scheduled** → Auction created, waiting for start time
2. **Live** → Auction active, accepting bids
3. **Ended** → Time expired, reserve not met or no bids
4. **Sold** → Auction completed with winner
5. **Cancelled** → Cancelled by owner (only if no bids)

### Bid Protection

- Sellers cannot bid on their own auctions
- Minimum bid increments enforced
- No duplicate consecutive bids from same user
- Bids only accepted during live period
- Time validation (not started/expired)

### Email Notifications

- Winner notification with purchase details
- Seller notification of successful sale
- Losing bidder notifications
- Reserve not met notifications
- Auction cancellation alerts

### Real-Time Updates

- Live bid updates to all watchers
- Countdown timer broadcasts
- Ending soon alerts (<5 minutes)
- Status change notifications
- Multi-auction monitoring support

## 🧪 Testing

You can test the endpoints using:

1. **Postman/Thunder Client**: Import the API endpoints
2. **Frontend**: Connect Socket.io client
3. **Manual Testing**: Use provided curl commands

### Example Test Flow

1. Create collector account
2. Create auction listing
3. Connect Socket.io client
4. Place bids from different accounts
5. Watch real-time updates
6. Wait for auction to end (or set short duration for testing)
7. Verify winner calculation and notifications

## 📚 Additional Notes

### Database Indexes

Optimized indexes added for:
- `saleType`: Fast filtering by sale type
- `owner`: Quick lookup of collector's listings
- `auction.auctionStatus`: Fast live auction queries
- `auction.endTime`: Efficient expired auction checks
- `promoted`: Featured listing queries

### Error Handling

- Comprehensive validation errors
- Ownership verification
- Auction state validation
- Graceful failure for notifications
- Detailed error messages

### Scalability Considerations

- Room-based Socket.io broadcasting
- Efficient database queries with indexes
- Pagination on all list endpoints
- Background task optimization
- Connection pooling for MongoDB

## 🎉 Summary

This implementation provides a **complete, production-ready** auction and marketplace backend with:

✅ Dual sale types (direct & auction)  
✅ Real-time bidding with Socket.io  
✅ Comprehensive validation & security  
✅ Automated auction lifecycle management  
✅ Email notifications  
✅ Ownership protection  
✅ Admin controls  
✅ Extensive documentation  
✅ Well-organized, commented code  

The system is ready for frontend integration and can scale to handle multiple simultaneous auctions with hundreds of concurrent users.
