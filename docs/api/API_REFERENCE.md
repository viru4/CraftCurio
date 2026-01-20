# API Reference - Auction & Marketplace System

## Base URL
```
http://localhost:8000/api
```

## Authentication

Most protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Collectibles API

### Create Collectible
**POST** `/collectibles`

Create a new collectible listing (direct sale or auction).

**Authentication:** Required

**Request Body (Direct Sale):**
```json
{
  "title": "Vintage Pottery Vase",
  "description": "Beautiful handcrafted vase from 1950s",
  "price": 150,
  "category": "Pottery",
  "image": "https://example.com/vase.jpg",
  "images": ["https://example.com/vase2.jpg"],
  "saleType": "direct",
  "tags": ["vintage", "pottery"],
  "specifications": {
    "material": "Ceramic",
    "condition": "Excellent",
    "yearMade": "1950",
    "origin": "Italy"
  },
  "promoted": false,
  "status": "active"
}
```

**Request Body (Auction):**
```json
{
  "title": "Rare Collectible Coin",
  "description": "1890 silver dollar in mint condition",
  "price": 100,
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
  "tags": ["coin", "rare"]
}
```

**Response (201 Created):**
```json
{
  "message": "Collectible created successfully",
  "data": {
    "_id": "6747a1b2c3d4e5f6g7h8i9j0",
    "title": "Rare Collectible Coin",
    "saleType": "auction",
    "owner": "collector_id",
    "auction": {
      "currentBid": 100,
      "bidHistory": [],
      "totalBids": 0,
      "auctionStatus": "scheduled"
    },
    "createdAt": "2025-11-24T...",
    "updatedAt": "2025-11-24T..."
  }
}
```

---

### Get All Collectibles
**GET** `/collectibles`

Retrieve collectibles with filtering, pagination, and search.

**Authentication:** Not required

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20, max: 100)
- `category` (string): Filter by category
- `saleType` (string): 'direct' or 'auction'
- `status` (string): 'active', 'inactive', 'sold', etc.
- `promoted` (boolean): true/false
- `featured` (boolean): true/false
- `popular` (boolean): true/false
- `recent` (boolean): true/false
- `minPrice` (number): Minimum price
- `maxPrice` (number): Maximum price
- `search` (string): Text search in title, description, tags

**Example:**
```
GET /collectibles?saleType=auction&status=active&page=1&limit=20
```

**Response (200 OK):**
```json
{
  "message": "Collectibles retrieved successfully",
  "count": 20,
  "total": 45,
  "page": 1,
  "totalPages": 3,
  "hasNextPage": true,
  "hasPrevPage": false,
  "data": [
    {
      "_id": "...",
      "title": "Collectible Item",
      "saleType": "auction",
      "price": 100,
      "owner": {
        "_id": "...",
        "name": "John Doe",
        "profilePhotoUrl": "..."
      },
      "auction": {
        "currentBid": 150,
        "totalBids": 5,
        "auctionStatus": "live"
      }
    }
  ]
}
```

---

### Get Single Collectible
**GET** `/collectibles/:id`

Get detailed information about a specific collectible.

**Authentication:** Not required

**Response (200 OK):**
```json
{
  "message": "Collectible retrieved successfully",
  "data": {
    "_id": "...",
    "title": "Rare Coin",
    "description": "...",
    "price": 100,
    "saleType": "auction",
    "owner": {
      "_id": "...",
      "name": "Jane Smith",
      "email": "jane@example.com"
    },
    "auction": {
      "startTime": "...",
      "endTime": "...",
      "currentBid": 150,
      "totalBids": 5,
      "bidHistory": [...],
      "auctionStatus": "live"
    },
    "stats": {
      "totalBids": 5,
      "uniqueBidders": 3,
      "timeRemaining": 3600000,
      "isActive": true
    },
    "views": 45,
    "likes": 12
  }
}
```

---

### Update Collectible
**PUT** `/collectibles/:id`

Update a collectible listing.

**Authentication:** Required (Owner or Admin)

**Request Body:**
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "price": 200,
  "status": "active",
  "promoted": true
}
```

**Note:** Cannot modify key auction parameters (price, times, reserve) after bids are placed.

**Response (200 OK):**
```json
{
  "message": "Collectible updated successfully",
  "data": { /* updated collectible */ }
}
```

---

### Delete Collectible
**DELETE** `/collectibles/:id`

Delete a collectible listing.

**Authentication:** Required (Owner or Admin)

**Note:** Cannot delete active auctions with existing bids.

**Response (200 OK):**
```json
{
  "message": "Collectible deleted successfully",
  "data": { /* deleted collectible */ }
}
```

---

### Like Collectible
**PUT** `/collectibles/:id/like`

Like/favorite a collectible.

**Authentication:** Not required

**Response (200 OK):**
```json
{
  "message": "Collectible liked successfully",
  "data": {
    "likes": 13
  }
}
```

---

### Get Featured Collectibles
**GET** `/collectibles/featured`

**Response (200 OK):**
```json
{
  "message": "Featured collectibles retrieved successfully",
  "count": 10,
  "data": [...]
}
```

---

### Get Popular Collectibles
**GET** `/collectibles/popular`

**Response (200 OK):**
```json
{
  "message": "Popular collectibles retrieved successfully",
  "count": 10,
  "data": [...]
}
```

---

### Get Recent Collectibles
**GET** `/collectibles/recent`

**Response (200 OK):**
```json
{
  "message": "Recent collectibles retrieved successfully",
  "count": 10,
  "data": [...]
}
```

---

### Get Promoted Collectibles
**GET** `/collectibles/promoted`

**Response (200 OK):**
```json
{
  "message": "Promoted collectibles retrieved successfully",
  "count": 10,
  "data": [...]
}
```

---

## Auction API

### Get Live Auctions
**GET** `/auction/live`

Get all currently active auctions.

**Authentication:** Not required

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `category` (string): Filter by category
- `sortBy` (string): Sort order
  - `endingSoon`: Ending soonest first (default)
  - `mostBids`: Most bids first
  - `highestBid`: Highest current bid first
  - `newest`: Newest listings first

**Example:**
```
GET /auction/live?sortBy=endingSoon&page=1&limit=20
```

**Response (200 OK):**
```json
{
  "message": "Live auctions retrieved successfully",
  "data": [
    {
      "_id": "...",
      "title": "Auction Item",
      "auction": {
        "currentBid": 150,
        "endTime": "...",
        "totalBids": 5
      },
      "stats": {
        "timeRemaining": 3600000,
        "isActive": true,
        "reserveMet": true
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

### Get Auction Details
**GET** `/auction/:id`

Get detailed auction information including bid history.

**Authentication:** Not required

**Response (200 OK):**
```json
{
  "message": "Auction details retrieved successfully",
  "data": {
    "_id": "...",
    "title": "Auction Item",
    "auction": {
      "startTime": "...",
      "endTime": "...",
      "currentBid": 150,
      "reservePrice": 200,
      "minimumBidIncrement": 10,
      "buyNowPrice": 500,
      "totalBids": 5,
      "bidHistory": [
        {
          "bidder": {...},
          "amount": 150,
          "timestamp": "...",
          "bidderName": "John Doe"
        }
      ],
      "auctionStatus": "live"
    },
    "stats": {
      "totalBids": 5,
      "uniqueBidders": 3,
      "timeRemaining": 3600000,
      "reserveMet": false,
      "isActive": true
    }
  }
}
```

---

### Place Bid
**POST** `/auction/:id/bid`

Place a bid on an auction.

**Authentication:** Required

**Request Body:**
```json
{
  "bidAmount": 160,
  "bidderId": "collector_id",
  "bidderName": "John Doe",
  "bidderEmail": "john@example.com"
}
```

**Validation Rules:**
- Bid must be at least currentBid + minimumBidIncrement
- Cannot bid on your own auction
- Cannot bid if you're already the highest bidder
- Auction must be in 'live' status

**Response (200 OK):**
```json
{
  "message": "Bid placed successfully",
  "data": {
    "collectibleId": "...",
    "currentBid": 160,
    "totalBids": 6,
    "bidHistory": [...]
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Bid must be at least $160.00"
}
```

---

### Buy Now
**POST** `/auction/:id/buy-now`

Purchase item instantly using buy-now price.

**Authentication:** Required

**Request Body:**
```json
{
  "buyerId": "collector_id",
  "buyerName": "Jane Smith",
  "buyerEmail": "jane@example.com"
}
```

**Response (200 OK):**
```json
{
  "message": "Purchase completed successfully",
  "data": {
    "collectibleId": "...",
    "purchasePrice": 500,
    "saleType": "auction",
    "status": "sold"
  }
}
```

---

### Cancel Auction
**POST** `/auction/:id/cancel`

Cancel an auction (only if no bids placed).

**Authentication:** Required (Owner or Admin)

**Response (200 OK):**
```json
{
  "message": "Auction cancelled successfully",
  "data": { /* cancelled auction */ }
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Cannot cancel auction with existing bids. Contact support for assistance."
}
```

---

### Finalize Auction (Admin)
**POST** `/auction/:id/finalize`

Manually finalize an expired auction.

**Authentication:** Required (Admin only)

**Response (200 OK):**
```json
{
  "message": "Auction finalized successfully",
  "data": {
    "auction": {
      "winner": "collector_id",
      "winningBid": 200,
      "auctionStatus": "sold"
    }
  }
}
```

---

## Collector API

### Get Collector Listings
**GET** `/collector/:id/listings`

Get all collectibles listed by a specific collector.

**Authentication:** Not required

**Query Parameters:**
- `status` (string): Filter by status
- `saleType` (string): Filter by sale type
- `page` (number): Page number
- `limit` (number): Items per page

**Example:**
```
GET /collector/123/listings?saleType=auction&status=active
```

**Response (200 OK):**
```json
{
  "message": "Collector listings retrieved successfully",
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 15,
    "totalPages": 1
  }
}
```

---

## Socket.io Events

### Connection
```javascript
const socket = io('http://localhost:8000');
```

### Client → Server Events

#### Join Auction
```javascript
socket.emit('joinAuction', {
  collectibleId: 'auction_id'
});
```

#### Leave Auction
```javascript
socket.emit('leaveAuction', {
  collectibleId: 'auction_id'
});
```

#### Get Auction Status
```javascript
socket.emit('getAuctionStatus', {
  collectibleId: 'auction_id'
});
```

#### Watch Multiple Auctions
```javascript
socket.emit('watchAuctions', {
  collectibleIds: ['id1', 'id2', 'id3']
});
```

---

### Server → Client Events

#### Auction Data (on join)
```javascript
socket.on('auctionData', (data) => {
  console.log(data);
  /*
  {
    collectibleId: '...',
    title: '...',
    currentBid: 150,
    totalBids: 5,
    endTime: '...',
    auctionStatus: 'live',
    bidHistory: [...],
    timeRemaining: 3600000
  }
  */
});
```

#### New Bid
```javascript
socket.on('newBid', (data) => {
  console.log(data);
  /*
  {
    collectibleId: '...',
    bidAmount: 160,
    bidderName: 'John Doe',
    timestamp: '...',
    totalBids: 6,
    currentBid: 160
  }
  */
});
```

#### Countdown Update
```javascript
socket.on('countdownUpdate', (data) => {
  console.log(data);
  /*
  {
    collectibleId: '...',
    timeRemaining: 3500000,
    currentBid: 160
  }
  */
});
```

#### Auction Ending Soon
```javascript
socket.on('auctionEndingSoon', (data) => {
  console.log(data);
  /*
  {
    collectibleId: '...',
    timeRemaining: 280000,
    message: 'Auction ending in less than 5 minutes!'
  }
  */
});
```

#### Auction Ended
```javascript
socket.on('auctionEnded', (data) => {
  console.log(data);
  /*
  {
    collectibleId: '...',
    status: 'sold',
    winner: 'John Doe',
    finalPrice: 200,
    endReason: 'time-expired' or 'buy-now'
  }
  */
});
```

#### Auction Cancelled
```javascript
socket.on('auctionCancelled', (data) => {
  console.log(data);
  /*
  {
    collectibleId: '...',
    message: 'This auction has been cancelled by the seller'
  }
  */
});
```

#### Error
```javascript
socket.on('error', (data) => {
  console.error(data.message);
});
```

---

## Payment API

### Create Payment Order
**POST** `/payments/create-order`

Create a Razorpay order for payment processing.

**Authentication:** Required

**Request Body:**
```json
{
  "orderId": "507f1f77bcf86cd799439011",
  "amount": 1500.00
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "razorpayOrderId": "order_KZ2XqZqZqZqZqZ",
    "amount": 150000,
    "currency": "INR",
    "keyId": "rzp_test_XXXXXXXXXXXXXX"
  }
}
```

---

### Verify Payment
**POST** `/payments/verify`

Verify payment signature after successful transaction.

**Authentication:** Required

**Request Body:**
```json
{
  "orderId": "507f1f77bcf86cd799439011",
  "razorpay_order_id": "order_KZ2XqZqZqZqZqZ",
  "razorpay_payment_id": "pay_KZ2XqZqZqZqZqZ",
  "razorpay_signature": "signature_string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "data": {
    "order": {
      "_id": "507f1f77bcf86cd799439011",
      "paymentStatus": "paid",
      "orderStatus": "processing",
      "paidAt": "2025-12-07T10:30:00.000Z"
    }
  }
}
```

---

### Record Payment Failure
**POST** `/payments/failure`

Record a failed payment attempt.

**Authentication:** Required

**Request Body:**
```json
{
  "orderId": "507f1f77bcf86cd799439011",
  "error": {
    "code": "BAD_REQUEST_ERROR",
    "description": "Payment failed",
    "source": "customer",
    "step": "payment_authentication",
    "reason": "payment_failed"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment failure recorded",
  "data": {
    "order": {
      "_id": "507f1f77bcf86cd799439011",
      "paymentStatus": "failed"
    }
  }
}
```

---

### Get Payment Details
**GET** `/payments/:paymentId`

Fetch details of a specific payment.

**Authentication:** Required

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "pay_KZ2XqZqZqZqZqZ",
    "amount": 150000,
    "currency": "INR",
    "status": "captured",
    "method": "card",
    "captured": true,
    "created_at": 1638864000
  }
}
```

---

### Process Refund (Admin Only)
**POST** `/payments/refund`

Process a refund for a payment.

**Authentication:** Required (Admin role)

**Request Body:**
```json
{
  "paymentId": "pay_KZ2XqZqZqZqZqZ",
  "amount": 1500.00
}
```

**Response:**
```json
{
  "success": true,
  "message": "Refund processed successfully",
  "data": {
    "id": "rfnd_KZ2XqZqZqZqZqZ",
    "amount": 150000,
    "currency": "INR",
    "payment_id": "pay_KZ2XqZqZqZqZqZ",
    "status": "processed"
  }
}
```

---

### Payment Webhook
**POST** `/payments/webhook`

Webhook endpoint for Razorpay events (public endpoint, verified by signature).

**Request Body:**
```json
{
  "event": "payment.captured",
  "payload": {
    "payment": {
      "entity": {
        "id": "pay_KZ2XqZqZqZqZqZ",
        "amount": 150000,
        "status": "captured"
      }
    }
  }
}
```

---

## AI & Intelligence API

### Chatbot API

#### Send Chat Message
**POST** `/chatbot/chat`

Send a message to the AI chatbot and receive a contextual response.

**Authentication:** Optional (enhanced context if authenticated)

**Request Body:**
```json
{
  "message": "How do I track my order?",
  "conversationHistory": [
    {
      "role": "user",
      "content": "Previous message"
    },
    {
      "role": "assistant",
      "content": "Previous response"
    }
  ]
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "response": "You can track your order by visiting the Orders section in your dashboard...",
    "quickReplies": [
      "📦 Browse Categories",
      "🔍 Track Order",
      "🏛️ Auction Help",
      "💳 Payment Info",
      "❓ How to Bid",
      "👤 Account Help"
    ],
    "intent": ["order"],
    "conversationId": "conv_abc123"
  }
}
```

**Supported Intents:**
- `search` - Product discovery and browsing
- `auction` - Auction bidding and rules
- `order` - Order tracking and status
- `payment` - Payment methods and issues
- `account` - Account management
- `help` - General platform assistance

---

#### Get Chat History
**GET** `/chatbot/history/:userId`

Retrieve conversation history for a specific user.

**Authentication:** Required (user can only access own history)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "conversations": [
      {
        "role": "user",
        "content": "How do I place a bid?",
        "timestamp": "2026-01-20T10:30:00.000Z"
      },
      {
        "role": "assistant",
        "content": "To place a bid, navigate to the auction...",
        "timestamp": "2026-01-20T10:30:02.000Z"
      }
    ],
    "totalMessages": 24
  }
}
```

---

#### Clear Chat History
**DELETE** `/chatbot/history/:userId`

Delete all chat history for a user.

**Authentication:** Required

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Chat history cleared successfully"
}
```

---

#### Chatbot Health Check
**GET** `/chatbot/health`

Check if the AI service is available.

**Authentication:** Not required

**Response (200 OK):**
```json
{
  "success": true,
  "status": "operational",
  "model": "meta-llama/Llama-3.2-3B-Instruct",
  "apiAvailable": true
}
```

---

### Content Generation API

#### Generate Product Description
**POST** `/content/generate-description`

Generate AI-powered product description from text and images.

**Authentication:** Required

**Request Body:**
```json
{
  "name": "Handcrafted Ceramic Vase",
  "category": "Pottery",
  "materials": "Ceramic, Hand-glazed",
  "isAuction": false,
  "images": [
    "https://cloudinary.com/image1.jpg",
    "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
  ]
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "description": "This exquisite handcrafted ceramic vase showcases traditional pottery techniques with a modern aesthetic. Each piece is meticulously hand-glazed, creating unique color variations and textures. The smooth ceramic finish and elegant form make it a stunning decorative accent for any space.",
    "wordCount": 45
  }
}
```

**Features:**
- Analyzes product images using BLIP-2 vision model
- Generates 50-100 word descriptions
- SEO-optimized with natural keywords
- Professional tone with sensory language
- Incorporates visual details from image analysis

---

#### Generate Product Titles
**POST** `/content/generate-titles`

Generate 5 SEO-optimized product title variations.

**Authentication:** Required

**Request Body:**
```json
{
  "category": "Jewelry",
  "materials": "Silver, Turquoise",
  "style": "Southwestern",
  "keywords": "handmade, artisan"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "titles": [
      "Handcrafted Southwestern Silver Turquoise Jewelry",
      "Artisan Silver & Turquoise Statement Piece",
      "Traditional Southwestern Turquoise Silver Jewelry",
      "Hand-Forged Silver Jewelry with Turquoise Accents",
      "Authentic Southwestern Artisan Turquoise Necklace"
    ]
  }
}
```

---

#### Generate Keywords & Tags
**POST** `/content/generate-keywords`

Generate relevant SEO keywords and product tags.

**Authentication:** Required

**Request Body:**
```json
{
  "name": "Vintage Leather Journal",
  "category": "Stationery",
  "description": "Hand-bound journal with vintage leather cover...",
  "materials": "Leather, Handmade Paper"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "keywords": [
      "vintage leather journal",
      "handbound notebook",
      "artisan stationery",
      "leather diary",
      "handmade paper",
      "vintage gifts",
      "bookbinding",
      "leather crafts",
      "journaling",
      "artisan notebook"
    ]
  }
}
```

---

#### Generate Social Media Post
**POST** `/content/generate-social-post`

Create engaging social media content for product promotion.

**Authentication:** Required

**Request Body:**
```json
{
  "name": "Handwoven Wool Blanket",
  "category": "Textiles",
  "platform": "instagram"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "text": "Wrap yourself in tradition with our handwoven wool blanket! Each thread tells a story of craftsmanship passed down through generations. Perfect for cozy evenings and adding warmth to your home decor. ✨",
    "hashtags": "#HandwovenBlanket #ArtisanCrafts #WoolBlanket #HandmadeTextiles #TraditionalCrafts #CozyHome #SustainableLiving #CraftCurio"
  }
}
```

---

#### Enhance Description
**POST** `/content/enhance-description`

Improve an existing product description with AI refinement.

**Authentication:** Required

**Request Body:**
```json
{
  "description": "This is a nice vase made of ceramic.",
  "improvementType": "general"
}
```

**Improvement Types:**
- `general` - Overall improvement
- `seo` - Add SEO keywords
- `emotional` - Add emotional appeal
- `concise` - Make more concise
- `detailed` - Add more details

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "enhanced": "This elegant ceramic vase combines timeless design with superior craftsmanship. Its smooth finish and graceful form make it a versatile decorative piece that enhances any interior space."
  }
}
```

---

#### Generate Auction Announcement
**POST** `/content/generate-auction-announcement`

Create compelling auction promotional content.

**Authentication:** Required

**Request Body:**
```json
{
  "title": "Rare Vintage Watch",
  "description": "1950s Swiss chronograph in mint condition",
  "startingBid": 500,
  "endTime": "2026-01-25T20:00:00Z"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "announcement": "🔥 AUCTION ALERT 🔥 Don't miss this rare opportunity to own a stunning 1950s Swiss chronograph in pristine condition! Bidding starts at just $500. This vintage masterpiece combines classic elegance with historical significance. Auction closes Jan 25 at 8:00 PM. Bid now to make this timeless treasure yours!"
  }
}
```

---

#### Generate Category Description
**POST** `/content/generate-category-description`

Create SEO-optimized category page descriptions.

**Authentication:** Required (Admin only)

**Request Body:**
```json
{
  "name": "Woodwork",
  "itemCount": 127,
  "topArtisans": "Master craftsmen specializing in traditional and modern woodworking"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "description": "Discover exceptional woodwork from master craftsmen who blend traditional techniques with contemporary design. Our curated collection of 127 handcrafted wooden pieces showcases the finest artisan woodworking, from furniture to decorative art. Each item reflects years of expertise and dedication to the craft, ensuring superior quality and timeless appeal."
  }
}
```

---

#### Batch Content Generation
**POST** `/content/generate-batch`

Generate multiple content types for a product in one request.

**Authentication:** Required

**Request Body:**
```json
{
  "product": {
    "name": "Ceramic Bowl",
    "category": "Pottery",
    "materials": "Stoneware",
    "images": ["https://example.com/bowl.jpg"]
  },
  "contentTypes": ["description", "titles", "keywords"]
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "description": "This artisan stoneware bowl combines functionality...",
    "titles": ["Handcrafted Stoneware Pottery Bowl", ...],
    "keywords": ["ceramic bowl", "pottery", "stoneware", ...]
  }
}
```

---

**AI Features:**
- **Vision Model:** Salesforce BLIP-2 for image analysis
- **Language Model:** Meta Llama-3.2-3B-Instruct for text generation
- **Response Time:** 2-5 seconds average
- **Rate Limit:** Included in general API rate limits
- **Free Tier:** 1,000 requests/day (Hugging Face)

---

## Error Responses

All error responses follow this format:

```json
{
  "error": "Error message",
  "details": [
    {
      "field": "fieldName",
      "message": "Specific validation error"
    }
  ]
}
```

### Common HTTP Status Codes

- **200 OK**: Request successful
- **201 Created**: Resource created successfully
- **400 Bad Request**: Validation error or invalid request
- **401 Unauthorized**: Authentication required or token invalid
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server error

---

## Rate Limiting

Authentication endpoints are rate-limited to 100 requests per 15 minutes per IP address.

---

## CORS

The API allows requests from:
- `http://localhost:5173`
- `http://localhost:5174`

Configure additional origins in `src/app.js`.

---

## Notes

- All timestamps are in ISO 8601 format (UTC)
- MongoDB ObjectIds are 24-character hexadecimal strings
- Pagination defaults: page=1, limit=20
- Maximum limit per request: 100 items
- Socket.io uses WebSocket protocol with fallback to long-polling
