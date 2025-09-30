import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import ArtisanProductCategory from '../src/models/ArtisanProductCategory.js';
import CollectibleCategory from '../src/models/collectiblecategory.js';
import Collectible from '../src/models/Collectible.js';

// Get current directory path for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Fallback data in case file reading fails
const getDefaultData = () => {
  const categories = [];  // Not used anymore

  const collectibleItems = [
    {
      title: "1965 Morgan Silver Dollar",
      description: "Pristine condition Morgan Silver Dollar from 1965, certified authentic.",
      price: "$125.00",
      category: "Coins",
      image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&h=300&fit=crop",
      featured: false,
      popular: false,
      recent: false,
      targetSection: 'filtered-items-section',
      buttonText: 'Explore Collection'
    },
    {
      title: "Amazing Spider-Man #1 Reprint",
      description: "High-quality reprint of the iconic first Amazing Spider-Man comic book.",
      price: "$89.99",
      category: "Comic Books",
      image: "https://images.unsplash.com/photo-1601645191163-3fc0d5d64e35?w=400&h=300&fit=crop",
      featured: false,
      popular: true,
      recent: false,
      targetSection: 'filtered-items-section',
      buttonText: 'Explore Collection'
    },
    {
      title: "Vintage Star Wars Luke Skywalker",
      description: "Original 1977 Luke Skywalker action figure in mint condition with packaging.",
      price: "$299.00",
      category: "Vintage Toys",
      image: "https://images.unsplash.com/photo-1606041011872-596597976b25?w=400&h=300&fit=crop",
      featured: false,
      popular: true,
      recent: false,
      targetSection: 'filtered-items-section',
      buttonText: 'Explore Collection'
    },
    {
      title: "Jaws Movie Poster (1975)",
      description: "Original theatrical release poster from Steven Spielberg's classic thriller.",
      price: "$450.00",
      category: "Movie Posters",
      image: "https://images.unsplash.com/photo-1489599511086-4d1b81c8d46b?w=400&h=300&fit=crop",
      featured: false,
      popular: false,
      recent: false,
      targetSection: 'filtered-items-section',
      buttonText: 'Explore Collection'
    },
    {
      title: "Signed Baseball - Derek Jeter",
      description: "Official MLB baseball signed by Yankees legend Derek Jeter with certificate.",
      price: "$399.00",
      category: "Sports Memorabilia",
      image: "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=400&h=300&fit=crop",
      featured: true,
      popular: true,
      recent: false,
      targetSection: 'filtered-items-section',
      buttonText: 'Explore Collection'
    },
    {
      title: "British Guiana 1c Magenta Stamp",
      description: "The world's rarest and most valuable stamp dating from 1856, famed for its single surviving specimen.",
      price: "$9,480,000.00",
      category: "Stamps",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
      featured: true,
      popular: true,
      recent: false,
      targetSection: 'filtered-items-section',
      buttonText: 'Explore Collection'
    },
    {
      title: "1909 T206 Honus Wagner Baseball Card",
      description: "Considered the 'Holy Grail' of sports cards, featuring legendary player Honus Wagner.",
      price: "$7,250,000.00",
      category: "Trading Cards",
      image: "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=400&h=300&fit=crop",
      featured: true,
      popular: true,
      recent: false,
      targetSection: 'filtered-items-section',
      buttonText: 'Explore Collection'
    },
    {
      title: "Vintage Rolex Submariner Watch",
      description: "1970s Rolex Submariner in excellent condition with original box and papers.",
      price: "$8,500.00",
      category: "Watches and Timepieces",
      image: "https://images.unsplash.com/photo-1594534475808-b18fc33b045e?w=400&h=300&fit=crop",
      featured: true,
      popular: true,
      recent: true,
      targetSection: 'filtered-items-section',
      buttonText: 'Explore Collection'
    },
    {
      title: "Apollo 11 Lunar Sample Bag",
      description: "Used by astronauts on the Apollo 11 mission to collect moon dust. Unique piece of space exploration history.",
      price: "$1,800,000.00",
      category: "Scientific Instruments",
      image: "https://images.unsplash.com/photo-1576671081837-49000212a370?w=400&h=300&fit=crop",
      featured: true,
      popular: false,
      recent: true,
      targetSection: 'filtered-items-section',
      buttonText: 'Explore Collection'
    },
    {
      title: "Civil War Era Compass",
      description: "Authentic brass pocket compass from the American Civil War period with leather case.",
      price: "$525.00",
      category: "Scientific Instruments",
      image: "https://images.unsplash.com/photo-1576671081837-49000212a370?w=400&h=300&fit=crop",
      featured: false,
      popular: false,
      recent: true,
      targetSection: 'filtered-items-section',
      buttonText: 'Explore Collection'
    }
  ];

  return { categories, collectibleItems };
};

// Dynamic data import - now falls back to default data
const loadProductsData = () => {
  try {
    const productsPath = path.join(__dirname, '../../front-end/src/data/Products.jsx');
    const productsContent = fs.readFileSync(productsPath, 'utf8');
    
    // Since Products.jsx is now deprecated, just return default data
    console.log('📄 Products.jsx is deprecated, using default collectible items...');
    return getDefaultData();
  } catch (error) {
    console.log('📄 Using fallback collectible items data...');
    return getDefaultData();
  }
};

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

// Utility functions
const createSlug = (name) => {
  return name.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .trim();
};

const formatCollectible = (item) => {
  const { id, ...itemWithoutId } = item;
  return {
    ...itemWithoutId,
    // Ensure required fields have defaults
    targetSection: item.targetSection || 'filtered-items-section',
    buttonText: item.buttonText || 'Explore Collection',
    featured: item.featured || false,
    popular: item.popular || false,
    recent: item.recent || false
  };
};

// Add predefined subcategories data
const getCollectibleSubcategories = () => {
  return [
    {
      name: "Coins",
      description: "Antique, commemorative, and rare currency collections",
      historicalEra: "Various",
      provenanceRequired: true,
      validConditions: ["Mint", "Fine", "Very Fine", "Good", "Poor"],
      collectorType: ["numismatist"],
      tags: ["coins", "currency", "antique", "commemorative"]
    },
    {
      name: "Stamps",
      description: "Historical and limited edition postal stamps",
      historicalEra: "Modern",
      provenanceRequired: false,
      validConditions: ["Mint", "Used", "First Day Cover"],
      collectorType: ["philatelist"],
      tags: ["stamps", "postal", "historical", "limited-edition"]
    },
    {
      name: "Vintage Banknotes",
      description: "Historic paper currency and banknotes",
      historicalEra: "Colonial to Modern",
      provenanceRequired: true,
      validConditions: ["Crisp", "Fine", "Good", "Poor"],
      collectorType: ["numismatist"],
      tags: ["banknotes", "currency", "vintage", "paper-money"]
    },
    {
      name: "Sports Memorabilia",
      description: "Signed jerseys, cricket bats, medals, and sports collectibles",
      historicalEra: "Modern",
      provenanceRequired: true,
      validConditions: ["Mint", "Good", "Used"],
      collectorType: ["sports-collector"],
      tags: ["sports", "memorabilia", "signed", "jerseys", "medals"]
    },
    {
      name: "Comic Books",
      description: "Rare and collectible comic book editions",
      historicalEra: "Modern",
      provenanceRequired: false,
      validConditions: ["Mint", "Near Mint", "Fine", "Good", "Poor"],
      collectorType: ["comic-collector"],
      tags: ["comics", "rare-editions", "graphic-novels"]
    },
    {
      name: "Movie Posters",
      description: "Original, historic, Bollywood, and Hollywood movie posters",
      historicalEra: "Various",
      provenanceRequired: true,
      validConditions: ["Mint", "Fine", "Good", "Restored"],
      collectorType: ["poster-collector", "film-enthusiast"],
      tags: ["movie-posters", "bollywood", "hollywood", "vintage", "original"]
    },
    {
      name: "Antique Cameras",
      description: "Vintage and collectible photographic equipment",
      historicalEra: "Pre-digital",
      provenanceRequired: true,
      validConditions: ["Working", "Restored", "Display Only"],
      collectorType: ["camera-collector", "photography-enthusiast"],
      tags: ["cameras", "antique", "photography", "vintage"]
    },
    {
      name: "Autographs",
      description: "Signed items from film stars, sports personalities, and political figures",
      historicalEra: "Modern",
      provenanceRequired: true,
      validConditions: ["Authenticated", "Unverified"],
      collectorType: ["autograph-collector"],
      tags: ["autographs", "signed", "celebrities", "sports", "political"]
    },
    {
      name: "Porcelain and Glassware",
      description: "Collectible porcelain, Murano glass, Fenton glass, and fine glassware",
      historicalEra: "Various",
      provenanceRequired: false,
      validConditions: ["Mint", "Good", "Chipped", "Restored"],
      collectorType: ["glass-collector", "porcelain-enthusiast"],
      tags: ["porcelain", "glassware", "murano", "fenton", "decorative"]
    },
    {
      name: "Vintage Toys",
      description: "Tin toys, early action figures, and collectible toys",
      historicalEra: "Mid-20th Century",
      provenanceRequired: false,
      validConditions: ["Mint in Box", "Good", "Used", "Restored"],
      collectorType: ["toy-collector"],
      tags: ["toys", "vintage", "tin-toys", "action-figures"]
    },
    {
      name: "Militaria",
      description: "Military medals, badges, uniforms, and wartime collectibles",
      historicalEra: "Various Wars",
      provenanceRequired: true,
      validConditions: ["Original", "Reproduction", "Restored"],
      collectorType: ["military-collector"],
      tags: ["militaria", "medals", "badges", "uniforms", "wartime"]
    },
    {
      name: "Old Maps and Atlases",
      description: "Historic maps, atlases, and geographical documents",
      historicalEra: "Pre-modern",
      provenanceRequired: true,
      validConditions: ["Fine", "Good", "Aged", "Restored"],
      collectorType: ["cartography-enthusiast"],
      tags: ["maps", "atlases", "geography", "historic", "cartography"]
    },
    {
      name: "Vintage Fashion",
      description: "Designer handbags, vintage clothing, and fashion accessories",
      historicalEra: "20th Century",
      provenanceRequired: false,
      validConditions: ["Mint", "Good", "Used", "Restored"],
      collectorType: ["fashion-collector"],
      tags: ["fashion", "vintage", "designer", "handbags", "clothing"]
    },
    {
      name: "Music Records and Memorabilia",
      description: "Vinyl records, cassettes, signed albums, and music collectibles",
      historicalEra: "Modern",
      provenanceRequired: false,
      validConditions: ["Mint", "Good", "Played", "Rare"],
      collectorType: ["music-collector"],
      tags: ["music", "vinyl", "records", "cassettes", "signed-albums"]
    },
    {
      name: "Scientific Instruments",
      description: "Antique telescopes, compasses, and scientific equipment",
      historicalEra: "Pre-modern to Modern",
      provenanceRequired: true,
      validConditions: ["Working", "Display Only", "Restored"],
      collectorType: ["science-collector"],
      tags: ["scientific", "instruments", "telescopes", "compasses", "antique"]
    },
    {
      name: "Art Deco Objects",
      description: "Art deco sculptures, furniture, and decorative objects",
      historicalEra: "Art Deco Period",
      provenanceRequired: true,
      validConditions: ["Mint", "Good", "Restored"],
      collectorType: ["art-deco-collector"],
      tags: ["art-deco", "sculptures", "furniture", "decorative"]
    },
    {
      name: "Ephemera",
      description: "Historic tickets, brochures, postcards, and paper collectibles",
      historicalEra: "Various",
      provenanceRequired: false,
      validConditions: ["Fine", "Good", "Aged"],
      collectorType: ["ephemera-collector"],
      tags: ["ephemera", "tickets", "postcards", "brochures", "paper"]
    },
    {
      name: "Film Props and Collectibles",
      description: "Movie costumes, set pieces, and film production items",
      historicalEra: "Modern",
      provenanceRequired: true,
      validConditions: ["Screen Used", "Production Made", "Replica"],
      collectorType: ["film-collector"],
      tags: ["film-props", "costumes", "movie", "production", "collectibles"]
    },
    {
      name: "Classic Car Spare Parts",
      description: "Vintage car emblems, horns, and automotive collectibles",
      historicalEra: "Classic Car Era",
      provenanceRequired: true,
      validConditions: ["Original", "Restored", "Reproduction"],
      collectorType: ["automotive-collector"],
      tags: ["car-parts", "emblems", "automotive", "vintage", "classic"]
    },
    {
      name: "Trading Cards",
      description: "Sports cards, movie cards, and gaming collectible cards",
      historicalEra: "Modern",
      provenanceRequired: false,
      validConditions: ["Mint", "Near Mint", "Good", "Poor"],
      collectorType: ["card-collector"],
      tags: ["trading-cards", "sports-cards", "gaming", "collectible"]
    },
    {
      name: "Photos and Photographs",
      description: "Historic photographs and collectible prints",
      historicalEra: "Various",
      provenanceRequired: true,
      validConditions: ["Fine", "Good", "Aged", "Restored"],
      collectorType: ["photography-collector"],
      tags: ["photographs", "historic", "prints", "collectible"]
    },
    {
      name: "Book First Editions",
      description: "Antiquarian books and rare first edition publications",
      historicalEra: "Various",
      provenanceRequired: true,
      validConditions: ["Fine", "Good", "Aged", "Restored"],
      collectorType: ["book-collector"],
      tags: ["books", "first-editions", "antiquarian", "rare"]
    },
    {
      name: "Ethnic Artifacts",
      description: "Cultural masks, ritual objects, and ethnic collectibles",
      historicalEra: "Traditional",
      provenanceRequired: true,
      validConditions: ["Original", "Restored", "Aged"],
      collectorType: ["artifact-collector"],
      tags: ["ethnic", "artifacts", "masks", "ritual", "cultural"]
    },
    {
      name: "Watches and Timepieces",
      description: "Luxury watches, antique timepieces, and horological collectibles",
      historicalEra: "Various",
      provenanceRequired: true,
      validConditions: ["Working", "Serviced", "Display Only", "Parts"],
      collectorType: ["watch-collector"],
      tags: ["watches", "timepieces", "luxury", "antique", "horological"]
    },
    {
      name: "Jewelry",
      description: "Historic jewelry, precious stones, and collectible accessories",
      historicalEra: "Various",
      provenanceRequired: true,
      validConditions: ["Mint", "Good", "Antique", "Restored"],
      collectorType: ["jewelry-collector"],
      tags: ["jewelry", "precious-stones", "historic", "accessories"]
    }
  ];
};

const getArtisanSubcategories = () => {
  return [
    {
      name: "Handloom Sarees and Textiles",
      description: "Traditional handwoven sarees including Banarasi, Kanchipuram, and Chanderi",
      craftTechniques: ["handloom weaving", "silk weaving", "gold thread work"],
      materialTypes: ["silk", "cotton", "gold thread", "silver thread"],
      originRegions: ["Varanasi", "Kanchipuram", "Chanderi", "West Bengal"],
      styleTags: ["traditional", "wedding", "ceremonial"],
      tags: ["sarees", "handloom", "silk", "traditional", "weaving"]
    },
    {
      name: "Block Printed Fabrics",
      description: "Hand block printed textiles from Bagru, Sanganer, and Ajrakh traditions",
      craftTechniques: ["block printing", "natural dyeing", "hand carving"],
      materialTypes: ["cotton", "silk", "natural dyes"],
      originRegions: ["Bagru", "Sanganer", "Gujarat", "Rajasthan"],
      styleTags: ["traditional", "geometric", "floral"],
      tags: ["block-print", "textiles", "natural-dyes", "handmade"]
    },
    {
      name: "Terracotta Pottery and Sculpture",
      description: "Traditional clay pottery and sculptural works",
      craftTechniques: ["pottery", "sculpting", "glazing", "firing"],
      materialTypes: ["clay", "terracotta", "natural pigments"],
      originRegions: ["West Bengal", "Gujarat", "Uttar Pradesh"],
      styleTags: ["traditional", "decorative", "functional"],
      tags: ["terracotta", "pottery", "sculpture", "clay", "handmade"]
    },
    {
      name: "Brassware and Metal Crafts",
      description: "Traditional brass and metal handicrafts from Moradabad and Rajasthan",
      craftTechniques: ["metal casting", "engraving", "embossing", "polishing"],
      materialTypes: ["brass", "copper", "silver", "bronze"],
      originRegions: ["Moradabad", "Rajasthan", "Gujarat"],
      styleTags: ["traditional", "decorative", "functional"],
      tags: ["brassware", "metal-crafts", "engraving", "traditional"]
    },
    {
      name: "Wooden Toys",
      description: "Traditional wooden toys from Channapatna and Varanasi",
      craftTechniques: ["wood turning", "carving", "lacquer work", "painting"],
      materialTypes: ["soft wood", "natural lacquer", "natural colors"],
      originRegions: ["Channapatna", "Varanasi", "Karnataka"],
      styleTags: ["traditional", "colorful", "eco-friendly"],
      tags: ["wooden-toys", "lacquer", "traditional", "eco-friendly"]
    },
    {
      name: "Bamboo and Cane Products",
      description: "Handcrafted baskets, mats, and furniture from bamboo and cane",
      craftTechniques: ["weaving", "basketry", "furniture making"],
      materialTypes: ["bamboo", "cane", "rattan"],
      originRegions: ["Assam", "Tripura", "Northeast India"],
      styleTags: ["traditional", "eco-friendly", "functional"],
      tags: ["bamboo", "cane", "baskets", "eco-friendly", "handwoven"]
    },
    {
      name: "Tribal Jewelry",
      description: "Traditional Dokra, silver jewelry, and beadwork from tribal communities",
      craftTechniques: ["dokra casting", "silver smithing", "beadwork", "wire work"],
      materialTypes: ["brass", "silver", "beads", "natural materials"],
      originRegions: ["Odisha", "West Bengal", "Chhattisgarh", "Jharkhand"],
      styleTags: ["tribal", "traditional", "ethnic"],
      tags: ["tribal-jewelry", "dokra", "silver", "beadwork", "ethnic"]
    },
    {
      name: "Blue Pottery",
      description: "Traditional blue pottery from Jaipur with distinctive glazing",
      craftTechniques: ["pottery", "glazing", "hand painting", "firing"],
      materialTypes: ["clay", "blue glaze", "natural pigments"],
      originRegions: ["Jaipur", "Rajasthan"],
      styleTags: ["traditional", "decorative", "blue-white"],
      tags: ["blue-pottery", "jaipur", "glazed", "decorative"]
    },
    {
      name: "Embroidered Shawls",
      description: "Kashmiri pashmina, Phulkari, and traditional embroidered textiles",
      craftTechniques: ["embroidery", "phulkari", "pashmina weaving"],
      materialTypes: ["pashmina", "wool", "silk", "cotton"],
      originRegions: ["Kashmir", "Punjab", "Himachal Pradesh"],
      styleTags: ["traditional", "luxurious", "warm"],
      tags: ["shawls", "embroidery", "pashmina", "phulkari", "traditional"]
    },
    {
      name: "Stone and Marble Carving",
      description: "Intricate stone and marble sculptures from Agra and Khajuraho",
      craftTechniques: ["stone carving", "marble inlay", "sculpting", "polishing"],
      materialTypes: ["marble", "sandstone", "soapstone"],
      originRegions: ["Agra", "Khajuraho", "Rajasthan", "Uttar Pradesh"],
      styleTags: ["traditional", "architectural", "decorative"],
      tags: ["stone-carving", "marble", "sculpture", "inlay", "traditional"]
    },
    {
      name: "Shell Craft",
      description: "Decorative items made from shells from coastal regions",
      craftTechniques: ["shell carving", "jewelry making", "decoration"],
      materialTypes: ["conch shells", "cowrie shells", "sea shells"],
      originRegions: ["Goa", "Odisha", "coastal regions"],
      styleTags: ["coastal", "decorative", "natural"],
      tags: ["shell-craft", "coastal", "decorative", "natural", "handmade"]
    },
    {
      name: "Glass Craft",
      description: "Colored glass lanterns, vases, and decorative glassware",
      craftTechniques: ["glass blowing", "cutting", "engraving", "coloring"],
      materialTypes: ["colored glass", "crystal", "mirrors"],
      originRegions: ["Uttar Pradesh", "Rajasthan"],
      styleTags: ["decorative", "colorful", "traditional"],
      tags: ["glass-craft", "lanterns", "vases", "colored-glass"]
    },
    {
      name: "Bidriware",
      description: "Traditional metal handicraft from Karnataka with silver inlay",
      craftTechniques: ["metal casting", "silver inlay", "blackening", "engraving"],
      materialTypes: ["zinc", "copper", "silver"],
      originRegions: ["Bidar", "Karnataka"],
      styleTags: ["traditional", "metallic", "decorative"],
      tags: ["bidriware", "metal-craft", "silver-inlay", "karnataka"]
    },
    {
      name: "Leathercraft",
      description: "Handcrafted leather bags, wallets, and Kolhapuri footwear",
      craftTechniques: ["leather working", "tooling", "stitching", "dyeing"],
      materialTypes: ["leather", "natural dyes", "thread"],
      originRegions: ["Kolhapur", "Rajasthan", "Tamil Nadu"],
      styleTags: ["traditional", "functional", "durable"],
      tags: ["leather", "bags", "footwear", "kolhapuri", "handcrafted"]
    },
    {
      name: "Papier Mache",
      description: "Traditional paper pulp crafts from Kashmir and Rajasthan",
      craftTechniques: ["paper molding", "painting", "lacquering", "carving"],
      materialTypes: ["paper pulp", "natural colors", "lacquer"],
      originRegions: ["Kashmir", "Rajasthan"],
      styleTags: ["traditional", "lightweight", "decorative"],
      tags: ["papier-mache", "paper-craft", "traditional", "decorative"]
    },
    {
      name: "Madhubani Paintings",
      description: "Traditional folk paintings from Bihar with natural colors",
      craftTechniques: ["painting", "natural pigments", "brush work"],
      materialTypes: ["natural colors", "paper", "cloth", "bamboo"],
      originRegions: ["Madhubani", "Bihar"],
      styleTags: ["folk", "traditional", "colorful"],
      tags: ["madhubani", "folk-art", "painting", "bihar", "traditional"]
    },
    {
      name: "Kalamkari Paintings",
      description: "Hand-painted textiles and art from Andhra Pradesh",
      craftTechniques: ["hand painting", "block printing", "natural dyeing"],
      materialTypes: ["cotton", "silk", "natural dyes"],
      originRegions: ["Andhra Pradesh", "Telangana"],
      styleTags: ["traditional", "narrative", "religious"],
      tags: ["kalamkari", "hand-painted", "textiles", "traditional"]
    },
    {
      name: "Bell Metal Craft",
      description: "Traditional bell metal items from West Bengal and Odisha",
      craftTechniques: ["metal casting", "engraving", "polishing"],
      materialTypes: ["bell metal", "brass", "bronze"],
      originRegions: ["West Bengal", "Odisha"],
      styleTags: ["traditional", "functional", "ceremonial"],
      tags: ["bell-metal", "traditional", "functional", "ceremonial"]
    },
    {
      name: "Embroidery",
      description: "Traditional Zardozi and Chikankari embroidery work",
      craftTechniques: ["zardozi", "chikankari", "hand embroidery"],
      materialTypes: ["silk", "cotton", "gold thread", "silver thread"],
      originRegions: ["Lucknow", "Delhi", "Kashmir"],
      styleTags: ["traditional", "luxurious", "intricate"],
      tags: ["embroidery", "zardozi", "chikankari", "traditional"]
    },
    {
      name: "Handpainted Pottery",
      description: "Traditional painted pottery from Kutch and Manipur",
      craftTechniques: ["pottery", "hand painting", "glazing"],
      materialTypes: ["clay", "natural colors", "glaze"],
      originRegions: ["Kutch", "Manipur", "Gujarat"],
      styleTags: ["traditional", "colorful", "decorative"],
      tags: ["pottery", "hand-painted", "traditional", "decorative"]
    },
    {
      name: "Wooden Furniture",
      description: "Handcrafted Sheesham and rosewood furniture with carvings",
      craftTechniques: ["wood carving", "joinery", "polishing", "inlay"],
      materialTypes: ["sheesham", "rosewood", "teak", "mango wood"],
      originRegions: ["Rajasthan", "Punjab", "Gujarat"],
      styleTags: ["traditional", "carved", "functional"],
      tags: ["furniture", "wood-carving", "sheesham", "rosewood"]
    },
    {
      name: "Folk Toys and Dolls",
      description: "Traditional folk toys and dolls from Rajasthan and Andhra Pradesh",
      craftTechniques: ["cloth work", "stuffing", "painting", "decoration"],
      materialTypes: ["cloth", "cotton", "natural colors"],
      originRegions: ["Rajasthan", "Andhra Pradesh"],
      styleTags: ["folk", "traditional", "colorful"],
      tags: ["folk-toys", "dolls", "traditional", "handmade"]
    },
    {
      name: "Bamboo Musical Instruments",
      description: "Traditional musical instruments crafted from bamboo",
      craftTechniques: ["bamboo crafting", "tuning", "carving"],
      materialTypes: ["bamboo", "natural materials"],
      originRegions: ["Assam", "Northeast India"],
      styleTags: ["traditional", "musical", "eco-friendly"],
      tags: ["musical-instruments", "bamboo", "traditional", "eco-friendly"]
    },
    {
      name: "Crochet Lace Products",
      description: "Handmade crochet lace items and decorative textiles",
      craftTechniques: ["crocheting", "lace making", "pattern work"],
      materialTypes: ["cotton thread", "silk thread"],
      originRegions: ["Goa", "Kerala", "Karnataka"],
      styleTags: ["traditional", "delicate", "decorative"],
      tags: ["crochet", "lace", "handmade", "textiles", "decorative"]
    }
  ];
};

// Enhanced seeding with subcategories and duplicate handling
const seedDatabase = async (options = {}) => {
  const { clearFirst = true, verbose = true } = options;
  
  try {
    if (verbose) console.log('🌱 Starting database seeding...');
    
    // Force clear collections to avoid duplicates
    if (clearFirst) {
      await CollectibleCategory.deleteMany({});
      await ArtisanProductCategory.deleteMany({});
      await Collectible.deleteMany({});
      if (verbose) console.log('🗑️  Existing collections cleared');
    }
    
    // Seed collectible subcategories
    const collectibleSubcategories = getCollectibleSubcategories();
    if (collectibleSubcategories.length > 0) {
      // Use upsert to handle duplicates
      const collectibleOps = collectibleSubcategories.map(cat => ({
        updateOne: {
          filter: { name: cat.name },
          update: { $set: cat },
          upsert: true
        }
      }));
      
      const collectibleResult = await CollectibleCategory.bulkWrite(collectibleOps);
      if (verbose) console.log(`📂 ${collectibleResult.upsertedCount + collectibleResult.modifiedCount} collectible subcategories processed`);
    }
    
    // Seed artisan subcategories  
    const artisanSubcategories = getArtisanSubcategories();
    if (artisanSubcategories.length > 0) {
      const artisanOps = artisanSubcategories.map(cat => ({
        updateOne: {
          filter: { name: cat.name },
          update: { $set: cat },
          upsert: true
        }
      }));
      
      const artisanResult = await ArtisanProductCategory.bulkWrite(artisanOps);
      if (verbose) console.log(`📂 ${artisanResult.upsertedCount + artisanResult.modifiedCount} artisan subcategories processed`);
    }
    
    // Load collectible items data from Products.jsx for seeding
    const { collectibleItems } = loadProductsData();
    
    // Seed collectibles only (no duplicate categories)
    const collectibleDocs = collectibleItems.map(formatCollectible);
    const savedCollectibles = await Collectible.insertMany(collectibleDocs);
    if (verbose) console.log(`🎯 ${savedCollectibles.length} collectibles seeded`);
    
    // Generate summary
    const stats = await getDatabaseStats();
    
    if (verbose) {
      console.log('\n✅ Database seeding completed successfully!');
      console.log('📈 Final Statistics:');
      console.log(`   Collectible Categories: ${stats.collectibleCategories}`);
      console.log(`   Artisan Categories: ${stats.artisanCategories}`);
      console.log(`   Collectibles: ${stats.collectibles}`);
    }
    
    return {
      success: true,
      collectibleCategories: stats.collectibleCategories,
      artisanCategories: stats.artisanCategories,
      collectibles: savedCollectibles.length,
      stats
    };
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    throw error;
  }
};

// Clear database function
const clearDatabase = async (verbose = true) => {
  try {
    const collectibleCategoryCount = await CollectibleCategory.countDocuments();
    const artisanCategoryCount = await ArtisanProductCategory.countDocuments();
    const collectibleCount = await Collectible.countDocuments();
    
    await CollectibleCategory.deleteMany({});
    await ArtisanProductCategory.deleteMany({});
    await Collectible.deleteMany({});
    
    if (verbose) {
      console.log('🗑️  Database cleared successfully');
      console.log(`   Removed ${collectibleCategoryCount} collectible categories`);
      console.log(`   Removed ${artisanCategoryCount} artisan categories`);
      console.log(`   Removed ${collectibleCount} collectibles`);
    }
    
    return { collectibleCategoryCount, artisanCategoryCount, collectibleCount };
  } catch (error) {
    console.error('❌ Failed to clear database:', error.message);
    throw error;
  }
};

// Get database statistics
const getDatabaseStats = async () => {
  try {
    const [collectibleCategoryCount, artisanCategoryCount, collectibleCount, featuredCount, popularCount, recentCount] = await Promise.all([
      CollectibleCategory.countDocuments(),
      ArtisanProductCategory.countDocuments(),
      Collectible.countDocuments(),
      Collectible.countDocuments({ featured: true }),
      Collectible.countDocuments({ popular: true }),
      Collectible.countDocuments({ recent: true })
    ]);
    
    return {
      collectibleCategories: collectibleCategoryCount,
      artisanCategories: artisanCategoryCount,
      collectibles: collectibleCount,
      featured: featuredCount,
      popular: popularCount,
      recent: recentCount,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('❌ Failed to get database stats:', error.message);
    throw error;
  }
};

// CLI interface
const runCLI = async () => {
  const args = process.argv.slice(2);
  const command = args[0];
  
  await connectDB();
  
  try {
    switch (command) {
      case 'seed':
        await seedDatabase();
        break;
      
      case 'clear':
        await clearDatabase();
        break;
      
      case 'stats':
        const stats = await getDatabaseStats();
        console.log('📊 Database Statistics:');
        console.log(JSON.stringify(stats, null, 2));
        break;
      
      case 'reseed':
        await clearDatabase();
        await seedDatabase();
        break;
      
      default:
        console.log('📋 Available commands:');
        console.log('  npm run seed:data     - Seed database with products data');
        console.log('  npm run clear:data    - Clear all data from database');
        console.log('  npm run stats:data    - Show database statistics');
        console.log('  npm run reseed:data   - Clear and re-seed database');
        break;
    }
  } catch (error) {
    console.error('❌ Command failed:', error.message);
    process.exit(1);
  }
  
  await mongoose.connection.close();
  console.log('👋 Database connection closed');
  process.exit(0);
};

// Export functions for API use
export { seedDatabase, clearDatabase, getDatabaseStats, connectDB };

// Run CLI if called directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runCLI();
}