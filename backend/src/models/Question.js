import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ArtisanProduct',
    required: true,
    index: true
  },
  productType: {
    type: String,
    enum: ['artisan', 'collectible'],
    default: 'artisan'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  question: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  answer: {
    comment: {
      type: String,
      trim: true,
      maxlength: 1000
    },
    answeredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    answeredAt: {
      type: Date
    }
  },
  helpful: {
    type: Number,
    default: 0,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'answered', 'archived'],
    default: 'pending'
  },
  isPublic: {
    type: Boolean,
    default: true
  }
}, { 
  timestamps: true 
});

// Compound indexes for efficient queries
questionSchema.index({ product: 1, createdAt: -1 });
questionSchema.index({ product: 1, status: 1 });

export default mongoose.model('Question', questionSchema);
