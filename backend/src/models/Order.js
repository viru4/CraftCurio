import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  productId: { type: String, required: true }, // Store as string to handle both custom IDs and ObjectIds
  productType: { type: String, enum: ['artisan', 'artisan-product', 'collectible'], required: true },
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
    enum: ['card', 'paypal', 'cod', 'razorpay', 'pending'],
    default: 'pending'
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
  // Razorpay payment fields
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  paidAt: { type: Date },
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

// Indexes for better query performance
// Note: orderNumber already has unique: true which creates an index, so we don't need to index it again
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ createdAt: -1 });

export default mongoose.model('Order', orderSchema);
