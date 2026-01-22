import mongoose from 'mongoose';

const collectibleCategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  icon: { type: String },
  image: { type: String }, // Category image URL
  historicalEra: { type: String },
  provenanceRequired: { type: Boolean, default: false },
  validConditions: [{ type: String }],
  collectorType: [{ type: String }],
  tags: [{ type: String }],
  
  // Approval workflow fields
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'approved' // Default approved for seeded categories
  },
  submittedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    default: null // null for admin-created or seeded categories
  },
  reviewedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    default: null
  },
  reviewedAt: { type: Date, default: null },
  rejectionReason: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model('CollectibleCategory', collectibleCategorySchema);
