import mongoose from 'mongoose';

const wishlistItemSchema = new mongoose.Schema({
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true 
  },
  productType: { 
    type: String, 
    enum: ['artisan-product', 'collectible'], 
    required: true 
  },
  addedAt: { 
    type: Date, 
    default: Date.now 
  }
}, { _id: false });

const wishlistSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    unique: true
  },
  items: [wishlistItemSchema]
}, { timestamps: true });

// Note: userId already has an index via unique: true constraint

export default mongoose.model('Wishlist', wishlistSchema);
