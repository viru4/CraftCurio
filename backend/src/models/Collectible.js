import mongoose from 'mongoose';

const collectibleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  featured: { type: Boolean, default: false },
  popular: { type: Boolean, default: false },
  recent: { type: Boolean, default: false },
  targetSection: { type: String, default: 'filtered-items-section' },
  buttonText: { type: String, default: 'Explore Collection' },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  status: { type: String, enum: ['available', 'sold', 'pending'], default: 'available' }
}, { timestamps: true });

// Index for search functionality
collectibleSchema.index({ title: 'text', description: 'text', category: 'text' });

export default mongoose.model('Collectible', collectibleSchema);