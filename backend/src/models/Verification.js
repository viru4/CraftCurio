import mongoose from 'mongoose';

const verificationSchema = new mongoose.Schema({
  artisanId: {
    type: String,
    required: true,
    ref: 'Artisan'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  idType: {
    type: String,
    enum: ['passport', 'drivers_license', 'national_id', 'aadhaar', 'other'],
    required: true
  },
  idNumber: {
    type: String,
    required: true,
    trim: true
  },
  idDocumentUrl: {
    type: String,
    required: true
  },
  craftProofUrl: {
    type: String,
    required: true
  },
  businessRegistrationUrl: {
    type: String,
    default: null
  },
  additionalInfo: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  adminComments: {
    type: String,
    default: ''
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  reviewedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Index for faster queries
verificationSchema.index({ userId: 1 });
verificationSchema.index({ artisanId: 1 });
verificationSchema.index({ status: 1 });

export default mongoose.model('Verification', verificationSchema);
