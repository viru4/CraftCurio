# CraftCurio Architecture Visualization

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           CLIENT (Browser)                               │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                     React Application                             │  │
│  │                                                                   │  │
│  │  ┌─────────────────────────────────────────────────────────┐    │  │
│  │  │              CollectorDashboardPage                      │    │  │
│  │  │  ┌───────────┐  ┌───────────┐  ┌──────────────────┐   │    │  │
│  │  │  │ Dashboard │  │ ListForm  │  │  AuctionPage     │   │    │  │
│  │  │  │  (Tabs)   │  │ (Create/  │  │  (Live Bidding)  │   │    │  │
│  │  │  │           │  │  Edit)    │  │                  │   │    │  │
│  │  │  └────┬──────┘  └─────┬─────┘  └────────┬─────────┘   │    │  │
│  │  │       │                │                 │             │    │  │
│  │  │       └────────────────┴─────────────────┘             │    │  │
│  │  │                        │                                │    │  │
│  │  │                ┌───────▼──────────┐                    │    │  │
│  │  │                │ CollectibleCard  │                    │    │  │
│  │  │                │  (Reusable)      │                    │    │  │
│  │  │                └──────────────────┘                    │    │  │
│  │  └──────────────────────┬────────────────────────────────┘    │  │
│  │                         │                                      │  │
│  │        ┌────────────────┼────────────────┐                    │  │
│  │        ▼                ▼                ▼                    │  │
│  │  ┌──────────┐  ┌──────────────┐  ┌─────────────┐            │  │
│  │  │  Hooks   │  │   Context    │  │   Utils     │            │  │
│  │  │          │  │              │  │             │            │  │
│  │  │ • use    │  │ • Collector  │  │ • api.js    │            │  │
│  │  │   Collec │  │   Context    │  │   (Axios)   │            │  │
│  │  │   tibles │  │              │  │             │            │  │
│  │  │          │  │ • Global     │  │ • socket.js │            │  │
│  │  │ • use    │  │   State      │  │   (Socket.  │            │  │
│  │  │   Auction│  │              │  │    io)      │            │  │
│  │  │          │  │              │  │             │            │  │
│  │  └─────┬────┘  └──────────────┘  └──────┬──────┘            │  │
│  │        │                                 │                   │  │
│  └────────┼─────────────────────────────────┼───────────────────┘  │
│           │                                 │                      │
└───────────┼─────────────────────────────────┼──────────────────────┘
            │                                 │
            │ HTTP (REST)                     │ WebSocket
            │                                 │
            ▼                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        SERVER (Node.js)                                  │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                     Express Application                           │  │
│  │                                                                   │  │
│  │  ┌───────────────────────────────────────────────────────────┐  │  │
│  │  │                    Middleware Layer                        │  │  │
│  │  │  ┌─────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │  │  │
│  │  │  │  CORS   │→ │   Auth   │→ │   Zod    │→ │  Error   │  │  │  │
│  │  │  │         │  │   JWT    │  │Validation│  │ Handler  │  │  │  │
│  │  │  └─────────┘  └──────────┘  └──────────┘  └──────────┘  │  │  │
│  │  └───────────────────────┬───────────────────────────────────┘  │  │
│  │                          │                                       │  │
│  │  ┌───────────────────────▼───────────────────────────────────┐  │  │
│  │  │                     Routes Layer                           │  │  │
│  │  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐ │  │  │
│  │  │  │ /collectibles│  │  /auctions   │  │ /collectors     │ │  │  │
│  │  │  │              │  │              │  │                 │ │  │  │
│  │  │  │ • GET all    │  │ • GET live   │  │ • GET profile   │ │  │  │
│  │  │  │ • GET :id    │  │ • GET :id    │  │ • GET listings  │ │  │  │
│  │  │  │ • POST       │  │ • POST bid   │  │ • PUT profile   │ │  │  │
│  │  │  │ • PUT :id    │  │ • POST buy   │  │                 │ │  │  │
│  │  │  │ • DELETE :id │  │ • DELETE     │  │                 │ │  │  │
│  │  │  └──────┬───────┘  └──────┬───────┘  └─────────────────┘ │  │  │
│  │  └─────────┼──────────────────┼────────────────────────────── │  │  │
│  │            │                  │                                │  │  │
│  │  ┌─────────▼──────────────────▼───────────────────────────────┐ │  │
│  │  │                  Controllers Layer                          │ │  │
│  │  │  ┌───────────────────┐  ┌─────────────────────────────┐   │ │  │
│  │  │  │ collectibleCtrl   │  │    auctionController        │   │ │  │
│  │  │  │                   │  │                             │   │ │  │
│  │  │  │ • getCollectibles │  │ • placeBid                  │   │ │  │
│  │  │  │ • getCollectible  │  │ • buyNow                    │   │ │  │
│  │  │  │ • createCollect.. │  │ • getLiveAuctions           │   │ │  │
│  │  │  │ • updateCollect.. │  │ • getAuctionDetails         │   │ │  │
│  │  │  │ • deleteCollect.. │  │ • cancelAuction             │   │ │  │
│  │  │  │ • getCollector... │  │ • manuallyFinalizeAuction   │   │ │  │
│  │  │  └────────┬──────────┘  └────────┬────────────────────┘   │ │  │
│  │  └───────────┼──────────────────────┼─────────────────────────┘ │  │
│  │              │                      │                           │  │
│  │  ┌───────────▼──────────────────────▼─────────────────────────┐ │  │
│  │  │                   Services Layer                            │ │  │
│  │  │  ┌──────────────────┐  ┌──────────────────────────────┐   │ │  │
│  │  │  │ auctionService   │  │    emailService              │   │ │  │
│  │  │  │                  │  │                              │   │ │  │
│  │  │  │ • validateBid    │  │ • sendBidNotification        │   │ │  │
│  │  │  │ • calculate      │  │ • sendAuctionEndNotification │   │ │  │
│  │  │  │   AuctionWinner  │  │ • sendWinnerNotification     │   │ │  │
│  │  │  │ • finalize       │  │ • sendEmail (fallback)       │   │ │  │
│  │  │  │   Auction        │  │                              │   │ │  │
│  │  │  │ • checkExpired   │  │                              │   │ │  │
│  │  │  └──────────────────┘  └──────────────────────────────┘   │ │  │
│  │  │                                                             │ │  │
│  │  │  ┌──────────────────┐  ┌──────────────────────────────┐   │ │  │
│  │  │  │ huggingfaceService│ │ contentGenerationService     │   │ │  │
│  │  │  │                  │  │                              │   │ │  │
│  │  │  │ • generateText   │  │ • generateProductDescription │   │ │  │
│  │  │  │ • analyzeImage   │  │ • generateTitles             │   │ │  │
│  │  │  │ • chatCompletion │  │ • generateKeywords           │   │ │  │
│  │  │  │                  │  │ • enhanceDescription         │   │ │  │
│  │  │  │ (Llama-3.2-3B)   │  │ • generateSocialPost         │   │ │  │
│  │  │  │ (BLIP-2 Vision)  │  │ • generateBatch              │   │ │  │
│  │  │  └──────────────────┘  └──────────────────────────────┘   │ │  │
│  │  │                                                             │ │  │
│  │  │  ┌────────────────────────────────────────────────────┐   │ │  │
│  │  │  │           chatbotService                           │   │ │  │
│  │  │  │                                                     │   │ │  │
│  │  │  │ • processUserMessage                               │   │ │  │
│  │  │  │ • detectIntent (search, auction, order, etc.)      │   │ │  │
│  │  │  │ • generateResponse (context-aware)                 │   │ │  │
│  │  │  │ • suggestQuickReplies (6 dynamic options)          │   │ │  │
│  │  │  └────────────────────────────────────────────────────┘   │ │  │
│  │  │  │   Auctions       │  │                              │   │ │  │
│  │  │  │ • update         │  │                              │   │ │  │
│  │  │  │   AuctionStatus  │  │                              │   │ │  │
│  │  │  └────────┬─────────┘  └──────────────────────────────┘   │ │  │
│  │  └───────────┼────────────────────────────────────────────────┘ │  │
│  │              │                                                   │  │
│  │  ┌───────────▼────────────────────────────────────────────────┐ │  │
│  │  │                    Models Layer (Mongoose)                 │ │  │
│  │  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐ │ │  │
│  │  │  │ Collectible  │  │  Collector   │  │     User        │ │ │  │
│  │  │  │              │  │              │  │                 │ │ │  │
│  │  │  │ • title      │  │ • name       │  │ • email         │ │ │  │
│  │  │  │ • description│  │ • email      │  │ • password      │ │ │  │
│  │  │  │ • price      │  │ • listed     │  │ • role          │ │ │  │
│  │  │  │ • category   │  │   Collecti.. │  │                 │ │ │  │
│  │  │  │ • image      │  │ • activeBids │  │                 │ │ │  │
│  │  │  │ • saleType   │  │ • wonAuctions│  │                 │ │ │  │
│  │  │  │ • auction    │  │              │  │                 │ │ │  │
│  │  │  │   - startBid │  │              │  │                 │ │ │  │
│  │  │  │   - reserve  │  │              │  │                 │ │ │  │
│  │  │  │   - buyNow   │  │              │  │                 │ │ │  │
│  │  │  │   - bidHist..│  │              │  │                 │ │ │  │
│  │  │  │   - current..│  │              │  │                 │ │ │  │
│  │  │  │   - winner   │  │              │  │                 │ │ │  │
│  │  │  │   - status   │  │              │  │                 │ │ │  │
│  │  │  └──────┬───────┘  └──────────────┘  └─────────────────┘ │ │  │
│  │  └─────────┼────────────────────────────────────────────────┘ │  │
│  └────────────┼──────────────────────────────────────────────────┘  │
│               │                                                      │
└───────────────┼──────────────────────────────────────────────────────┘
                ▼
    ┌──────────────────────────┐
    │      MongoDB Database     │
    │                          │
    │  Collections:            │
    │  • collectibles          │
    │  • collectors            │
    │  • users                 │
    │  • carts                 │
    │  • orders                │
    │  • reviews               │
    └──────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                    Socket.io Real-Time Layer                             │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                    auctionSocket.js                               │  │
│  │                                                                   │  │
│  │  Events Emitted (Server → Client):                               │  │
│  │  ┌─────────────────────────────────────────────────────────────┐ │  │
│  │  │ • newBid              - New bid placed                       │ │  │
│  │  │ • countdownUpdate     - Timer update (every 10s)             │ │  │
│  │  │ • auctionEndingSoon   - Alert when < 5 min remaining         │ │  │
│  │  │ • auctionEnded        - Auction finished                     │ │  │
│  │  │ • auctionCancelled    - Auction cancelled                    │ │  │
│  │  │ • auctionStatusChange - Status updated                       │ │  │
│  │  │ • bidError            - Bid placement error                  │ │  │
│  │  └─────────────────────────────────────────────────────────────┘ │  │
│  │                                                                   │  │
│  │  Events Received (Client → Server):                              │  │
│  │  ┌─────────────────────────────────────────────────────────────┐ │  │
│  │  │ • joinAuction         - Join auction room                    │ │  │
│  │  │ • leaveAuction        - Leave auction room                   │ │  │
│  │  └─────────────────────────────────────────────────────────────┘ │  │
│  │                                                                   │  │
│  │  Background Tasks:                                                │  │
│  │  ┌─────────────────────────────────────────────────────────────┐ │  │
│  │  │ • Countdown Timer     - Every 10 seconds                     │ │  │
│  │  │ • Expiry Check        - Every 60 seconds                     │ │  │
│  │  └─────────────────────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagrams

### 1. Creating a Direct Sale Listing

```
User → CollectorDashboardPage → Dashboard (click "Add New")
  ↓
ListForm (select "Direct Sale")
  ↓
Fill form (title, description, price, category, image)
  ↓
Click "Create Listing"
  ↓
useCreateCollectible hook
  ↓
api.createCollectible(data)
  ↓
POST /api/collectibles
  ↓
collectibleController.createCollectible
  ↓
Validate data (Zod)
  ↓
Create Collectible model instance
  ↓
Save to MongoDB
  ↓
Update Collector.listedCollectibles
  ↓
Return { success, collectible }
  ↓
Update UI (redirect to Dashboard)
```

### 2. Creating an Auction Listing

```
User → CollectorDashboardPage → Dashboard (click "Add New")
  ↓
ListForm (select "Auction")
  ↓
Fill form (title, description, category, image, 
          startingBid, reservePrice, buyNowPrice,
          startTime, endTime)
  ↓
Click "Create Listing"
  ↓
useCreateCollectible hook
  ↓
api.createCollectible(data)
  ↓
POST /api/collectibles
  ↓
collectibleController.createCollectible
  ↓
Validate auction data
  - startingBid > 0
  - reservePrice >= startingBid (if set)
  - buyNowPrice > startingBid (if set)
  - endTime > startTime
  - minimum duration: 1 hour
  ↓
Create Collectible with auction fields
  ↓
Save to MongoDB
  ↓
Update Collector.listedCollectibles
  ↓
Return { success, collectible }
  ↓
Update UI (redirect to Dashboard)
```

### 3. Placing a Bid (Real-Time Flow)

```
User → CollectorDashboardPage → AuctionPage
  ↓
useAuction hook initializes
  ↓
socket.joinAuction(auctionId)  ← Socket connects
  ↓
Server: Add user to auction room
  ↓
User enters bid amount
  ↓
Click "Place Bid"
  ↓
usePlaceBid hook
  ↓
Validate bid amount (client-side)
  - Must be >= minimum bid
  - Minimum = current bid + 5% (min $1)
  ↓
api.placeBid(auctionId, amount)
  ↓
POST /api/auctions/:id/bid
  ↓
auctionController.placeBid
  ↓
auctionService.validateBid
  - Check auction is live
  - Check user is not owner
  - Check bid > currentBid
  - Check bid meets increment
  ↓
Update Collectible.auction.bidHistory
  ↓
Update Collectible.auction.currentBid
  ↓
Update Collector.activeBids
  ↓
Save to MongoDB
  ↓
Emit Socket.io event: newBid
  ↓
All users in auction room receive update
  ↓
Client updates UI:
  - New current bid
  - Updated bid history
  - New minimum bid
  ↓
emailService.sendBidNotification
  - Email to previous bidder
  - Email to auction owner
```

### 4. Auction Countdown & Ending

```
Server: Socket.io Background Task (every 10 seconds)
  ↓
Fetch all live auctions
  ↓
For each auction:
  ↓
  Calculate time remaining
    ↓
    Emit: countdownUpdate
    - Send to all users in auction room
    ↓
    If < 5 minutes remaining:
      ↓
      Emit: auctionEndingSoon
      ↓
    If time expired (endTime < now):
      ↓
      auctionService.finalizeAuction
        ↓
        Calculate winner (highest bid)
        ↓
        Check reserve price met
          ↓
          If reserve met:
            - Set status = 'sold'
            - Set winner
            - Update Collector.wonAuctions
            - emailService.sendWinnerNotification
          ↓
          If reserve not met:
            - Set status = 'ended'
            - No winner
            - Email owner about reserve not met
        ↓
        Save to MongoDB
        ↓
        Emit: auctionEnded
          - Send to all users in room
        ↓
        Client updates UI:
          - Show "Auction Ended"
          - Display winner (if any)
          - Disable bidding
```

### 5. Buy Now Purchase

```
User → AuctionPage → Click "Buy Now"
  ↓
Confirm purchase (window.confirm)
  ↓
useBuyNow hook
  ↓
api.buyNow(auctionId)
  ↓
POST /api/auctions/:id/buy-now
  ↓
auctionController.buyNow
  ↓
Validate:
  - Auction is live
  - Buy now price is set
  - User is not owner
  ↓
auctionService.finalizeAuction (immediate)
  ↓
Set status = 'sold'
  ↓
Set winner = current user
  ↓
Set finalBid = buyNowPrice
  ↓
Update Collector.wonAuctions
  ↓
Save to MongoDB
  ↓
Emit: auctionEnded (with winner)
  ↓
emailService.sendWinnerNotification
  ↓
Email owner about sale
  ↓
Return success
  ↓
Client:
  - Show success message
  - Update UI to "Sold"
  - Redirect to Dashboard
```

## Component Hierarchy

```
App.jsx
 └── CollectorDashboardPage
      ├── CollectorProvider (Context)
      │
      ├── Dashboard
      │    ├── Search Bar (debounced)
      │    ├── Filters (status, sort)
      │    ├── Tab Navigation
      │    │    ├── Direct Listings Tab
      │    │    ├── Auctions Tab
      │    │    └── Add New Tab
      │    │
      │    └── Grid Layout
      │         ├── CollectibleCard (item 1)
      │         ├── CollectibleCard (item 2)
      │         ├── CollectibleCard (item 3)
      │         └── ...
      │
      ├── ListForm (conditional)
      │    ├── Basic Info Section
      │    │    ├── Title input
      │    │    ├── Description textarea
      │    │    ├── Category select
      │    │    └── Image URL input + preview
      │    │
      │    ├── Sale Type Radio
      │    │    ├── Direct Sale
      │    │    └── Auction
      │    │
      │    ├── Direct Sale Fields (conditional)
      │    │    └── Price input
      │    │
      │    ├── Auction Fields (conditional)
      │    │    ├── Starting Bid input
      │    │    ├── Reserve Price input
      │    │    ├── Buy Now Price input
      │    │    ├── Start Time picker
      │    │    └── End Time picker
      │    │
      │    └── Action Buttons
      │         ├── Cancel
      │         └── Submit
      │
      └── AuctionPage (modal, conditional)
           ├── Header (title, status badge, close button)
           │
           ├── Left Column
           │    ├── Image
           │    └── Item Details
           │         ├── Category
           │         ├── Description
           │         └── Reserve Status
           │
           └── Right Column
                ├── Countdown Timer (real-time)
                ├── Current Bid Display
                ├── Buy Now Option (if available)
                ├── Bidding Form
                │    ├── Bid Amount input
                │    ├── Minimum Bid hint
                │    └── Place Bid button
                └── Bid History (expandable)
                     ├── Bid 1 (latest)
                     ├── Bid 2
                     └── ...
```

## State Management Flow

```
CollectorContext (Global State)
 ↓
 ├── collector (object)
 │    ├── _id
 │    ├── name
 │    ├── email
 │    └── listedCollectibles
 │
 ├── activeTab (string)
 │    ├── 'direct'
 │    ├── 'auction'
 │    └── 'add'
 │
 ├── searchQuery (string)
 │
 ├── filterStatus (string)
 │    ├── '' (all)
 │    ├── 'active'
 │    ├── 'sold'
 │    ├── 'live'
 │    ├── 'ended'
 │    └── ...
 │
 ├── sortBy (string)
 │    ├── 'createdAt:desc'
 │    ├── 'price:asc'
 │    └── ...
 │
 └── refreshTrigger (number)

Used by:
 ├── Dashboard component
 ├── useCollectorListings hook
 └── CollectorDashboardPage
```

## Hook Dependencies

```
useCollectibles
 ↓
 Uses: api.getCollectibles()
 Returns: { collectibles, loading, error, pagination }

useCollectorListings
 ↓
 Uses: api.getCollectorListings()
 Depends on: CollectorContext (for filters)
 Returns: { collectibles, loading, error, pagination, refetch }

useCreateCollectible
 ↓
 Uses: api.createCollectible()
 Returns: { createCollectible, isCreating, createError }

useAuction (with real-time)
 ↓
 Uses: 
  - api.getAuction()
  - socket.joinAuction()
  - socket.onNewBid()
  - socket.onCountdownUpdate()
  - socket.onAuctionEnded()
 Returns: { auction, loading, error, timeRemaining }
 Cleanup: socket.leaveAuction()

usePlaceBid
 ↓
 Uses: api.placeBid()
 Returns: { placeBid, isPlacingBid, bidError }
```

## API Layer

```
api.js (Axios Instance)
 ↓
 Request Interceptor:
  - Add Authorization header (JWT token from localStorage)
  - Add Content-Type: application/json
 ↓
 API Functions:
  ├── getCollectibles(params)
  ├── getCollectible(id)
  ├── createCollectible(data)
  ├── updateCollectible(id, data)
  ├── deleteCollectible(id)
  ├── getCollectorListings(params)
  ├── getLiveAuctions(params)
  ├── getAuction(id)
  ├── placeBid(id, amount)
  ├── buyNow(id)
  ├── cancelAuction(id)
  ├── login(email, password)
  ├── register(userData)
  └── logout()
 ↓
 Response Interceptor:
  - Handle errors (401, 403, 404, 500)
  - Transform data
  - Log errors
```

## Socket.io Connection Flow

```
Client Side (socket.js):
 ↓
 initializeSocket()
  ↓
  Create singleton instance
  ↓
  Connect to VITE_SOCKET_URL
  ↓
  Setup event listeners:
   ├── connect
   ├── disconnect
   ├── newBid
   ├── countdownUpdate
   ├── auctionEndingSoon
   ├── auctionEnded
   └── auctionCancelled
  ↓
  Return socket instance

Server Side (auctionSocket.js):
 ↓
 initializeAuctionSockets(io)
  ↓
  io.on('connection', (socket) => {
   ↓
   socket.on('joinAuction', (auctionId))
    - socket.join(`auction_${auctionId}`)
   ↓
   socket.on('leaveAuction', (auctionId))
    - socket.leave(`auction_${auctionId}`)
   ↓
   socket.on('disconnect')
    - Clean up rooms
  })
  ↓
  Start background tasks:
   ├── Countdown (10s interval)
   └── Expiry check (60s interval)
```

---

## Technology Stack Summary

### Backend Stack
```
Node.js v18+
 └── Express v5.1.0
      ├── Middleware
      │    ├── cors (CORS handling)
      │    ├── express.json (body parsing)
      │    ├── authMiddleware (JWT validation)
      │    ├── roleMiddleware (permission checks)
      │    └── errorHandler (centralized errors)
      │
      ├── Database
      │    └── MongoDB (via Mongoose v8.18.2)
      │         ├── Schemas with validation
      │         ├── Indexes for performance
      │         └── Middleware hooks
      │
      ├── Validation
      │    └── Zod v4.1.12
      │         ├── directSaleSchema
      │         ├── auctionSchema
      │         ├── bidSchema
      │         ├── buyNowSchema
      │         └── updateCollectibleSchema
      │
      ├── Authentication
      │    └── jsonwebtoken v9.0.2
      │         ├── JWT generation
      │         ├── Token verification
      │         └── Expiry handling
      │
      ├── Real-Time
      │    └── Socket.io v4.8.1
      │         ├── Room-based messaging
      │         ├── Event emitters
      │         └── Background tasks
      │
      ├── Email
      │    └── Nodemailer v6.10.1
      │         ├── SMTP configuration
      │         ├── HTML templates
      │         └── Fallback logging
      │
      ├── AI Integration
      │    └── Hugging Face Inference API v4.13.9
      │         ├── Text Generation (Llama-3.2-3B-Instruct)
      │         │    ├── Chatbot responses
      │         │    ├── Product descriptions
      │         │    └── Content enhancement
      │         │
      │         └── Vision Analysis (BLIP-2)
      │              ├── Image captioning
      │              ├── Visual feature extraction
      │              └── Vision-language pipeline
      │
      └── Security & Configuration
           ├── Helmet v7.2.0 (Security headers)
           ├── express-rate-limit v7.5.0 (Rate limiting)
           ├── bcryptjs v2.4.3 (Password hashing)
           └── app.set('trust proxy', 1) (Render deployment)
```

### Frontend Stack
```
React 18.2
 └── Vite v5.0
      ├── Build Tool
      │    ├── Fast HMR
      │    ├── ES modules
      │    └── Code splitting
      │
      ├── HTTP Client
      │    └── Axios v1.6
      │         ├── Interceptors
      │         ├── Request/response transforms
      │         └── Error handling
      │
      ├── Real-Time
      │    └── Socket.io-client v4.8.1
      │         ├── Event listeners
      │         ├── Auto-reconnection
      │         └── Singleton pattern
      │
      ├── Styling
      │    └── Tailwind CSS v3.3
      │         ├── Utility classes
      │         ├── Responsive design
      │         └── Custom colors
      │
      ├── State Management
      │    ├── React Context API
      │    ├── Custom Hooks (11 total)
      │    └── Local state (useState)
      │
      └── Type Checking
           └── PropTypes v15.8
                ├── Component props
                ├── Runtime validation
                └── Development warnings
```

---

This architecture provides a complete, scalable foundation for the CraftCurio collector dashboard with real-time auction capabilities.
