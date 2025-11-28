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
  awards: [{
    name: { type: String },
    imageUrl: { type: String }
  }],
  certifications: [{
    name: { type: String },
    imageUrl: { type: String }
  }],
  verified: { type: Boolean, default: false },

  // Story details for artisan story page
  story: {
    // Gallery photos (array of image URLs)
    photos: [{ type: String }],

    // Videos (array of video objects with url and title)
    videos: [{
      url: { type: String },
      title: { type: String },
      thumbnail: { type: String } // Optional thumbnail image
    }],

    // Handwritten notes, sketches, or design images
    handwrittenNotes: [{ type: String }],

    // Inspirational quotes from the artisan
    quotes: [{ type: String }],

    // Cultural context and heritage information
    culturalContext: { type: String },

    // Challenges faced by the artisan
    challenges: [{ type: String }],

    // Triumphs and achievements
    triumphs: [{ type: String }],

    // Location coordinates for map (optional)
    locationCoordinates: {
      latitude: { type: Number },
      longitude: { type: Number }
    }
  },

  // Engagement metrics
  likes: { type: Number, default: 0 },
  views: { type: Number, default: 0 },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indexes for better query performance
// Note: id field already has unique: true which creates an index
artisanSchema.index({ userId: 1 });
artisanSchema.index({ verified: 1 });
artisanSchema.index({ craftSpecialization: 1 });
artisanSchema.index({ createdAt: -1 });
artisanSchema.index({ likes: -1, views: -1 });
artisanSchema.index({ name: 'text', briefBio: 'text', fullBio: 'text' }); // Text search index

export default mongoose.model('Artisan', artisanSchema);