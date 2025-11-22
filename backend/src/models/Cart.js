import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  productId: { 
    type: mongoose.Schema.Types.Mixed, // Allow both ObjectId and String
    required: true 
  },
  productType: { 
    type: String, 
    enum: ['artisan-product', 'collectible'], 
    required: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true 
  },
  image: { 
    type: String 
  },
  artisan: { 
    type: String 
  },
  category: { 
    type: String 
  },
  quantity: { 
    type: Number, 
    required: true, 
    min: 1,
    default: 1 
  }
}, { _id: false });

const cartSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    unique: true
  },
  items: [cartItemSchema]
}, { timestamps: true });

// Note: userId already has an index via unique: true constraint

export default mongoose.model('Cart', cartSchema);
