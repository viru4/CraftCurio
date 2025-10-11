import mongoose from 'mongoose';

const artisanSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true }, // Custom ID like "artisan1", "artisan2"
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Link to User (optional for now)
  name: { type: String, required: true },
  profilePhotoUrl: { type: String },
  briefBio: { type: String },
  fullBio: { type: String },
  craftSpecialization: { type: String, required: true },
  experienceYears: { type: Number },
  location: { type: String },
  socialLinks: {
    website: String,
    facebook: String,
    instagram: String,
    twitter: String
  },
  awards: [{ type: String }],
  certifications: [{ type: String }],
  verified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Artisan', artisanSchema);