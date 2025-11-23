import mongoose from 'mongoose';

/**
 * About Us Page Schema
 * Stores all content for the About Us page including hero, story, mission,
 * team members, milestones, testimonials, gallery, and contact information
 */

// Sub-schema for team members
const teamMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    required: true,
    trim: true
  },
  bio: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: '/api/placeholder/300/300'
  },
  linkedin: {
    type: String,
    default: '#'
  },
  email: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    default: 0
  }
}, { _id: true });

// Sub-schema for core values
const valueSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: 'Target'
  },
  color: {
    type: String,
    default: 'bg-amber-600'
  },
  order: {
    type: Number,
    default: 0
  }
}, { _id: true });

// Sub-schema for milestones
const milestoneSchema = new mongoose.Schema({
  year: {
    type: String,
    required: true
  },
  month: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: 'Rocket'
  },
  stats: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    default: 0
  }
}, { _id: true });

// Sub-schema for testimonials
const testimonialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  quote: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: '/api/placeholder/100/100'
  },
  type: {
    type: String,
    enum: ['collector', 'artisan'],
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 5
  },
  order: {
    type: Number,
    default: 0
  }
}, { _id: true });

// Sub-schema for gallery images
const galleryImageSchema = new mongoose.Schema({
  src: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Products', 'Workshop', 'Events', 'Team'],
    required: true
  },
  order: {
    type: Number,
    default: 0
  }
}, { _id: true });

// Sub-schema for impact statistics
const impactStatSchema = new mongoose.Schema({
  value: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: 'Users'
  },
  order: {
    type: Number,
    default: 0
  }
}, { _id: true });

// Sub-schema for initiatives
const initiativeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: '/api/placeholder/400/300'
  },
  icon: {
    type: String,
    default: 'GraduationCap'
  },
  order: {
    type: Number,
    default: 0
  }
}, { _id: true });

// Sub-schema for unique selling points
const uspSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: 'Star'
  },
  gradient: {
    type: String,
    default: 'from-amber-500 to-orange-600'
  },
  order: {
    type: Number,
    default: 0
  }
}, { _id: true });

// Main About Us Schema
const aboutUsSchema = new mongoose.Schema({
  // Hero Section
  hero: {
    headline: {
      type: String,
      required: true,
      default: 'Welcome to CraftCurio'
    },
    highlightText: {
      type: String,
      default: 'CraftCurio'
    },
    tagline: {
      type: String,
      required: true,
      default: 'Discover the journey of curated collectibles and handcrafted items'
    },
    image: {
      type: String,
      default: '/api/placeholder/600/400'
    }
  },

  // Story Section
  story: {
    title: {
      type: String,
      default: 'Our Story'
    },
    paragraphs: [{
      type: String
    }],
    image: {
      type: String,
      default: '/api/placeholder/600/500'
    },
    highlights: [{
      icon: String,
      title: String,
      description: String
    }]
  },

  // Mission & Values Section
  mission: {
    title: {
      type: String,
      default: 'Mission & Values'
    },
    missionStatement: {
      type: String,
      required: true,
      default: 'To bridge the gap between artisans and collectors, fostering a community where craftsmanship and appreciation meet.'
    },
    visionStatement: {
      type: String,
      required: true,
      default: 'To become the world\'s premier destination for unique handcrafted items and collectibles, empowering artisans globally.'
    },
    values: [valueSchema]
  },

  // Team Section
  team: {
    title: {
      type: String,
      default: 'Meet the Team'
    },
    subtitle: {
      type: String,
      default: 'Passionate individuals dedicated to connecting artisans with collectors worldwide'
    },
    members: [teamMemberSchema]
  },

  // Timeline Section
  timeline: {
    title: {
      type: String,
      default: 'Our Journey'
    },
    subtitle: {
      type: String,
      default: 'From humble beginnings to a thriving global marketplace'
    },
    milestones: [milestoneSchema],
    stats: {
      artisans: { type: String, default: '1000+' },
      collectors: { type: String, default: '50K+' },
      countries: { type: String, default: '30+' },
      itemsSold: { type: String, default: '100K+' }
    }
  },

  // Unique Selling Points Section
  unique: {
    title: {
      type: String,
      default: 'Why Choose CraftCurio?'
    },
    subtitle: {
      type: String,
      default: "We're not just another marketplace. Here's what sets us apart from the rest."
    },
    features: [uspSchema]
  },

  // Impact Section
  impact: {
    title: {
      type: String,
      default: 'Our Impact'
    },
    subtitle: {
      type: String,
      default: 'Creating positive change for artisans, communities, and our planet'
    },
    statistics: [impactStatSchema],
    initiatives: [initiativeSchema],
    stories: [{
      quote: String,
      author: String,
      location: String
    }]
  },

  // Testimonials Section
  testimonials: {
    title: {
      type: String,
      default: 'What People Say'
    },
    subtitle: {
      type: String,
      default: 'Hear from our community of artisans and collectors'
    },
    items: [testimonialSchema]
  },

  // Gallery Section
  gallery: {
    title: {
      type: String,
      default: 'Gallery'
    },
    subtitle: {
      type: String,
      default: 'A glimpse into our world of craftsmanship, community, and creativity'
    },
    images: [galleryImageSchema]
  },

  // CTA & Contact Section
  contact: {
    title: {
      type: String,
      default: 'Join Our Community'
    },
    subtitle: {
      type: String,
      default: 'Whether you\'re looking to discover unique items or share your craft with the world'
    },
    email: {
      type: String,
      default: 'hello@craftcurio.com'
    },
    phone: {
      type: String,
      default: '+1 (234) 567-890'
    },
    address: {
      type: String,
      default: '123 Artisan Street, Creative District, CA 94102'
    },
    socialLinks: {
      facebook: { type: String, default: '#' },
      instagram: { type: String, default: '#' },
      twitter: { type: String, default: '#' },
      linkedin: { type: String, default: '#' }
    }
  },

  // Metadata
  isPublished: {
    type: Boolean,
    default: true
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes for better query performance
aboutUsSchema.index({ isPublished: 1 });

// Static method to get or create About Us page
aboutUsSchema.statics.getOrCreate = async function() {
  let aboutUs = await this.findOne();
  
  if (!aboutUs) {
    aboutUs = await this.create({});
  }
  
  return aboutUs;
};

const AboutUs = mongoose.model('AboutUs', aboutUsSchema);

export default AboutUs;
