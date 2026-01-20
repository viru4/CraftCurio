# Quick Reference - Auction System

## 🎯 Core Concepts

### Sale Types
- **Direct Sale**: Fixed price, instant purchase
- **Auction**: Time-based bidding with live updates

### Auction Status Flow
```
Scheduled → Live → Ended/Sold/Cancelled
```

---

## 📁 File Structure

```
backend/
├── src/
│   ├── models/
│   │   ├── Collectible.js        ✅ Enhanced with auction fields
│   │   └── Collector.js          ✅ Added listing tracking
│   ├── api/
│   │   ├── controllers/
│   │   │   ├── collectibleController.js  ✅ Enhanced CRUD
│   │   │   ├── auctionController.js      ✅ Auction logic
│   │   │   ├── chatbotController.js      ✅ AI chatbot
│   │   │   └── contentGenerationController.js ✅ AI content
│   │   └── routes/
│   │       ├── collectibles.js   ✅ Enhanced routes
│   │       ├── auction.js        ✅ Auction endpoints
│   │       ├── chatbot.js        ✅ AI chat endpoints
│   │       └── contentGeneration.js ✅ AI content endpoints
│   ├── services/
│   │   ├── auctionService.js     ✅ Business logic
│   │   ├── huggingfaceService.js ✅ AI integration
│   │   ├── contentGenerationService.js ✅ AI content
│   │   └── chatbotService.js     ✅ AI chatbot
│   ├── middleware/
│   │   └── validation.js         ✅ Zod validation
│   ├── sockets/
│   │   └── auctionSocket.js      ✅ Real-time handler
│   └── app.js                    ✅ Routes + trust proxy
├── server.js                     ✅ Socket.io integration
└── package.json                  ✅ Added socket.io + AI packages
```

---

## 🔑 Key Endpoints

### Create Listing
```bash
POST /api/collectibles
Body: { saleType: "auction", auction: {...} }
Auth: Required
```

### Place Bid
```bash
POST /api/auction/:id/bid
Body: { bidAmount, bidderId, bidderName, bidderEmail }
Auth: Required
```

### Get Live Auctions
```bash
GET /api/auction/live?sortBy=endingSoon
Auth: Not required
```

### Buy Now
```bash
POST /api/auction/:id/buy-now
Body: { buyerId, buyerName, buyerEmail }
Auth: Required
```

### AI Chatbot
```bash
POST /api/chatbot/chat
Body: { message, conversationHistory }
Auth: Optional
```

### Generate Content
```bash
POST /api/content/generate-description
Body: { name, category, materials, images }
Auth: Required
```

---

## ⚡ Socket.io Events

### Client Emits
- `joinAuction` - Join auction room
- `leaveAuction` - Leave auction room
- `getAuctionStatus` - Request status
- `watchAuctions` - Monitor multiple

### Server Emits
- `newBid` - Bid placed
- `countdownUpdate` - Timer update (10s)
- `auctionEndingSoon` - <5 min warning
- `auctionEnded` - Auction finished
- `auctionCancelled` - Cancelled by owner

---

## 🔒 Validation Rules

### Bid Rules
✅ Must exceed currentBid + minimumBidIncrement
✅ Cannot bid on own auction
✅ Cannot bid twice consecutively
✅ Auction must be "live"
✅ Within time window

### Update Rules
✅ Owner or admin only
✅ Cannot modify active auction with bids
✅ Cannot delete auction with bids

---

## 📊 Data Flow

### Creating Auction
1. Client sends auction data
2. Validation middleware checks schema
3. Controller creates collectible
4. Status set to "scheduled"
5. Updates collector's listings
6. Returns created auction

### Placing Bid
1. Client sends bid
2. Validation checks amount
3. Business logic validates bid
4. Bid added to history
5. CurrentBid updated
6. Socket.io broadcasts to room
7. Collector's activeBids updated

### Auction End
1. Background task checks every 60s
2. Finds expired auctions
3. Calculates winner
4. Checks reserve price
5. Updates status (sold/ended)
6. Sends email notifications
7. Updates collector's wonAuctions
8. Socket.io broadcasts end event

---

## 🛠️ Common Tasks

### Environment Variables Required
```env
# Database
MONGODB_URI=mongodb://...

# Authentication
JWT_SECRET=your-secret-key

# Payment Gateway
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...

# AI Services
HUGGINGFACE_API_KEY=hf_...

# Email Service
EMAIL_USER=...
EMAIL_PASS=...

# Deployment (Render)
NODE_ENV=production
```

### Start Server
```bash
cd backend
npm start
```

### Test Auction Creation
```javascript
const auction = {
  title: "Test Item",
  price: 100,
  saleType: "auction",
  auction: {
    startTime: "2025-11-25T10:00:00Z",
    endTime: "2025-11-30T10:00:00Z",
    reservePrice: 500,
    minimumBidIncrement: 25
  }
};
```

### Connect Socket.io
```javascript
const socket = io('http://localhost:8000');
socket.emit('joinAuction', { collectibleId: 'id' });
socket.on('newBid', console.log);
```

---

## 🐛 Debugging

### Check Server Status
```bash
GET http://localhost:8000/api/health
```

### View Active Auctions
```bash
GET http://localhost:8000/api/auction/live
```

### Check Logs
- Server console shows Socket.io connections
- Auction checks run every 60s
- Countdown broadcasts every 10s

---

## 📈 Performance

### Indexes Added
- `saleType` - Sale type filtering
- `auction.auctionStatus` - Status queries
- `auction.endTime` - Expiry checks
- `owner` - Collector lookups
- `promoted` - Featured queries

### Background Tasks
- Countdown: Every 10 seconds
- Expiry Check: Every 60 seconds
- Efficient room-based broadcasting

---

## 🎨 Frontend Integration

### Required Libraries
```bash
npm install socket.io-client axios
```

### Basic Setup
```javascript
// API calls
import axios from 'axios';
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: { Authorization: `Bearer ${token}` }
});

// Socket.io
import io from 'socket.io-client';
const socket = io('http://localhost:8000');
```

### Example Component (React)
```javascript
useEffect(() => {
  socket.emit('joinAuction', { collectibleId });
  
  socket.on('newBid', (data) => {
    setCurrentBid(data.bidAmount);
  });
  
  socket.on('countdownUpdate', (data) => {
    setTimeRemaining(data.timeRemaining);
  });
  
  return () => socket.emit('leaveAuction', { collectibleId });
}, [collectibleId]);
```

---

## 📋 Checklist

### Setup
- [x] Socket.io installed
- [x] Models enhanced
- [x] Controllers created
- [x] Routes configured
- [x] Middleware added
- [x] Server integrated
- [x] Documentation written- [x] AI services integrated (Hugging Face)
- [x] Trust proxy configured (Render deployment)
- [x] Content generation implemented
- [x] Chatbot implemented
### Testing
- [ ] Create auction listing
- [ ] Place bids
- [ ] Test Socket.io updates
- [ ] Verify countdown timers
- [ ] Check email notifications
- [ ] Test buy-now
- [ ] Verify winner calculation

### Production
- [ ] Configure email service
- [ ] Set up CORS origins
- [ ] Enable rate limiting
- [ ] Add logging
- [ ] Set up monitoring
- [ ] Configure cron jobs
- [ ] Load testing

---

## 💡 Tips

1. **Testing Auctions**: Set short durations (5-10 minutes) for testing
2. **Socket Rooms**: Each auction has its own room for efficiency
3. **Background Tasks**: Run separately in production (PM2/cron)
4. **Email**: Use real SMTP for production notifications
5. **Database**: Add indexes before scaling to production
6. **Security**: Validate all inputs, check ownership
7. **Monitoring**: Log all bid placements and auction ends

---

## 🔗 Resources

- Full Documentation: `AUCTION_SYSTEM_DOCUMENTATION.md`
- API Reference: `API_REFERENCE.md`
- Implementation Summary: `IMPLEMENTATION_SUMMARY.md`
- Socket.io Docs: https://socket.io/docs/
- Mongoose Docs: https://mongoosejs.com/

---

## 🆘 Common Issues

### Socket not connecting?
- Check CORS settings in server.js
- Verify port 8000 is accessible
- Check browser console for errors

### Bids not updating?
- Ensure client joined auction room
- Check Socket.io connection status
- Verify auction is "live" status

### Auction not finalizing?
- Check server logs for errors
- Verify background task is running
- Ensure auction endTime has passed

---

**Quick Start:** `npm start` → Open API docs → Test endpoints → Integrate frontend

✨ **Everything is ready to go!**
