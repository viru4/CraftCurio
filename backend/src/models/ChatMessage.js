import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null // null for guest users
  },
  role: {
    type: String,
    enum: ['user', 'assistant', 'system'],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  metadata: {
    productIds: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ArtisanProduct'
    }],
    orderIds: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order'
    }],
    auctionIds: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Collectible'
    }],
    functionCalls: [String],
    suggestedActions: [String],
    userAgent: String,
    ipAddress: String
  },
  isResolved: {
    type: Boolean,
    default: false
  },
  feedbackRating: {
    type: Number,
    min: 1,
    max: 5
  }
}, { 
  timestamps: true 
});

// Index for efficient queries
chatMessageSchema.index({ sessionId: 1, createdAt: -1 });
chatMessageSchema.index({ userId: 1, createdAt: -1 });

// Auto-delete messages older than 30 days
chatMessageSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

export default mongoose.model('ChatMessage', chatMessageSchema);
