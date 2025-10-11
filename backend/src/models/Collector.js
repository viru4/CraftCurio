import mongoose from 'mongoose';

const collectorSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true }, // Custom ID like "collector1", "collector2"
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Link to User (optional for now)
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
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Collector', collectorSchema);