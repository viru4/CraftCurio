import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: true
  },
  otp: {
    type: String,
    required: true
  },
  purpose: {
    type: String,
    enum: ['signin', 'signup'],
    required: true
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 } // Auto-delete expired OTPs
  },
  verified: {
    type: Boolean,
    default: false
  },
  attempts: {
    type: Number,
    default: 0,
    max: 5 // Maximum 5 verification attempts
  },
  signupData: {
    type: String // Store signup data as JSON string temporarily
  }
}, { timestamps: true });

// Index for efficient queries
otpSchema.index({ email: 1, purpose: 1, expiresAt: 1 });

export default mongoose.model('OTP', otpSchema);

