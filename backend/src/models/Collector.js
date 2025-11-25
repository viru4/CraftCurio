import mongoose from 'mongoose';

const collectorSchema = new mongoose.Schema({
  // Custom collector id used across the app (e.g. "collector-001")
  id: { type: String, unique: true, sparse: true, trim: true, lowercase: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true }, // One-to-one with User
  name: { type: String, required: true },
  profilePhotoUrl: { type: String },
  location: { type: String },
  interests: [{ type: String }],  // e.g., textiles, pottery, coins
  wishlist: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'ArtisanProduct' },
    addedAt: { type: Date, default: Date.now }
  }],
  purchaseHistory: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'ArtisanProduct' },
    purchaseDate: { type: Date },
    pricePaid: { type: Number }
  }],

  // Collectibles listed by this collector for sale/auction
  listedCollectibles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Collectible'
  }],

  // Bidding and auction activity
  activeBids: [{
    collectibleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Collectible' },
    currentBid: { type: Number },
    lastBidTime: { type: Date, default: Date.now }
  }],

  wonAuctions: [{
    collectibleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Collectible' },
    winningBid: { type: Number },
    wonAt: { type: Date, default: Date.now }
  }],

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Collector', collectorSchema);