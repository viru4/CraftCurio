import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Category from '../src/models/Category.js';
import Collectible from '../src/models/Collectible.js';

// Get current directory path for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Dynamic data import - reads from frontend Products.jsx
const loadProductsData = () => {
  try {
    const productsPath = path.join(__dirname, '../../front-end/src/data/Products.jsx');
    const productsContent = fs.readFileSync(productsPath, 'utf8');
    
    // Extract categories array using regex
    const categoriesMatch = productsContent.match(/export const categories = (\[[\s\S]*?\]);/);
    const collectiblesMatch = productsContent.match(/export const collectibleItems = (\[[\s\S]*?\]);/);
    
    if (!categoriesMatch || !collectiblesMatch) {
      throw new Error('Could not parse Products.jsx file');
    }
    
    // Use eval to parse the arrays (in a controlled environment)
    const categories = eval(categoriesMatch[1]);
    const collectibleItems = eval(collectiblesMatch[1]);
    
    return { categories, collectibleItems };
  } catch (error) {
    console.error('Error loading products data:', error.message);
    console.log('Falling back to default data...');
    return getDefaultData();
  }
};

// Fallback data in case file reading fails
const getDefaultData = () => {
  const categories = [
    {
      name: "Coins, Currency, and Stamps",
      description: "Numismatics, paper currency, banknotes, stamps, and postal collectibles from around the world."
    },
    {
      name: "Books and Periodicals",
      description: "Comic books, magazines, printed materials, rare editions, and literary collectibles."
    },
    {
      name: "Action Figures and Toys",
      description: "Star Wars figures, G.I. Joe, Funko Pop, Barbie dolls, Hot Wheels cars, LEGO themed sets."
    },
    {
      name: "Vintage Fashion",
      description: "Retro clothing, hats, sneakers, handbags, and accessories from past decades."
    }
  ];

  const collectibleItems = [
    {
      id: 1,
      title: "Sample Collectible",
      description: "Default sample item",
      price: "$100.00",
      category: "Coins, Currency, and Stamps",
      image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&h=300&fit=crop",
      featured: false,
      popular: false,
      recent: false,
      targetSection: 'filtered-items-section',
      buttonText: 'Explore Collection'
    }
  ];

  return { categories, collectibleItems };
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

// Main seeding function
const seedDatabase = async (options = {}) => {
  const { clearFirst = true, verbose = true } = options;
  
  try {
    if (verbose) console.log('🌱 Starting database seeding...');
    
    // Load data dynamically
    const { categories, collectibleItems } = loadProductsData();
    
    if (clearFirst) {
      await Category.deleteMany({});
      await Collectible.deleteMany({});
      if (verbose) console.log('🗑️  Existing data cleared');
    }
    
    // Seed categories with slugs
    const categoryDocs = categories.map(cat => ({
      ...cat,
      slug: createSlug(cat.name),
      itemCount: 0 // Will be updated after collectibles are seeded
    }));
    
    const savedCategories = await Category.insertMany(categoryDocs);
    if (verbose) console.log(`📂 ${savedCategories.length} categories seeded`);
    
    // Seed collectibles
    const collectibleDocs = collectibleItems.map(formatCollectible);
    const savedCollectibles = await Collectible.insertMany(collectibleDocs);
    if (verbose) console.log(`🎯 ${savedCollectibles.length} collectibles seeded`);
    
    // Update category item counts
    for (const category of savedCategories) {
      const count = await Collectible.countDocuments({ category: category.name });
      await Category.findByIdAndUpdate(category._id, { itemCount: count });
    }
    if (verbose) console.log('📊 Category counts updated');
    
    // Generate summary
    const stats = await getDatabaseStats();
    
    if (verbose) {
      console.log('\n✅ Database seeding completed successfully!');
      console.log('📈 Final Statistics:');
      console.log(`   Categories: ${stats.categories}`);
      console.log(`   Collectibles: ${stats.collectibles}`);
      console.log(`   Featured: ${stats.featured}`);
      console.log(`   Popular: ${stats.popular}`);
      console.log(`   Recent: ${stats.recent}`);
    }
    
    return {
      success: true,
      categories: savedCategories.length,
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
    const categoryCount = await Category.countDocuments();
    const collectibleCount = await Collectible.countDocuments();
    
    await Category.deleteMany({});
    await Collectible.deleteMany({});
    
    if (verbose) {
      console.log('🗑️  Database cleared successfully');
      console.log(`   Removed ${categoryCount} categories`);
      console.log(`   Removed ${collectibleCount} collectibles`);
    }
    
    return { categoryCount, collectibleCount };
  } catch (error) {
    console.error('❌ Failed to clear database:', error.message);
    throw error;
  }
};

// Get database statistics
const getDatabaseStats = async () => {
  try {
    const [categoryCount, collectibleCount, featuredCount, popularCount, recentCount] = await Promise.all([
      Category.countDocuments(),
      Collectible.countDocuments(),
      Collectible.countDocuments({ featured: true }),
      Collectible.countDocuments({ popular: true }),
      Collectible.countDocuments({ recent: true })
    ]);
    
    return {
      categories: categoryCount,
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