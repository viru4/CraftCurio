import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, required: true },
  productType: { type: String, enum: ['artisan', 'collectible'], required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
  image: { type: String },
  artisan: { type: String },
  category: { type: String }
});

const addressSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true }
});

const orderSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  orderNumber: { 
    type: String, 
    required: true, 
    unique: true 
  },
  items: [orderItemSchema],
  shippingAddress: { 
    type: addressSchema, 
    required: true 
  },
  billingAddress: { 
    type: addressSchema 
  },
  subtotal: { 
    type: Number, 
    required: true 
  },
  shipping: { 
    type: Number, 
    required: true, 
    default: 5.00 
  },
  tax: { 
    type: Number, 
    required: true 
  },
  total: { 
    type: Number, 
    required: true 
  },
  paymentMethod: { 
    type: String,
    enum: ['card', 'paypal', 'cod'],
    default: 'card'
  },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'paid', 'failed', 'refunded'], 
    default: 'pending' 
  },
  orderStatus: { 
    type: String, 
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'], 
    default: 'pending' 
  },
  notes: { type: String },
  trackingNumber: { type: String },
  estimatedDelivery: { type: Date },
  deliveredAt: { type: Date }
}, { 
  timestamps: true 
});

// Generate unique order number
orderSchema.pre('save', async function(next) {
  if (this.isNew && !this.orderNumber) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.orderNumber = `CC${year}${month}${day}${random}`;
  }
  next();
});

export default mongoose.model('Order', orderSchema);
