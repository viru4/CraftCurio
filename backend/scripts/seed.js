import mongoose from 'mongoose';
import dotenv from 'dotenv';

console.log('🔄 Starting modular seeding system...');

// Configure environment
dotenv.config();

// Database connection
const connectDB = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

// Import seeder modules step by step
const loadSeeders = async () => {
  try {
    console.log('📦 Loading seeder modules...');
    
    const { seedCategories } = await import('./seeders/categorySeeder.js');
    console.log('✅ Category seeder loaded');
    
    const { seedCollectibles } = await import('./seeders/collectibleSeeder.js');
    console.log('✅ Collectible seeder loaded');
    
    const { seedArtisanProducts } = await import('./seeders/artisanSeeder.js');
    console.log('✅ Artisan seeder loaded');
    
    const { getDatabaseStats, clearDatabase } = await import('./seeders/utils.js');
    console.log('✅ Utils loaded');
    
    return { seedCategories, seedCollectibles, seedArtisanProducts, getDatabaseStats, clearDatabase };
  } catch (error) {
    console.error('❌ Failed to load seeders:', error.message);
    throw error;
  }
};

// Enhanced seeding with subcategories and duplicate handling
const seedDatabase = async (options = {}) => {
  const { clearFirst = true, verbose = true } = options;
  
  try {
    if (verbose) console.log('🌱 Starting database seeding...');
    
    // Load all seeder modules
    const { seedCategories, seedCollectibles, seedArtisanProducts, getDatabaseStats, clearDatabase } = await loadSeeders();
    
    // Force clear collections to avoid duplicates
    if (clearFirst) {
      await clearDatabase(verbose);
    }
    
    // Seed categories
    const categoryResults = await seedCategories(verbose);
    
    // Seed collectibles
    const collectibleResults = await seedCollectibles(verbose);
    
    // Seed artisan products
    const artisanResults = await seedArtisanProducts(verbose);
    
    // Generate summary
    const stats = await getDatabaseStats();
    
    if (verbose) {
      console.log('\n✅ Database seeding completed successfully!');
      console.log('📈 Final Statistics:');
      console.log(`   Collectible Categories: ${stats.collectibleCategories}`);
      console.log(`   Artisan Categories: ${stats.artisanCategories}`);
      console.log(`   Collectibles: ${stats.collectibles}`);
      console.log(`   Artisan Products: ${stats.artisanProducts}`);
    }
    
    return {
      success: true,
      categories: categoryResults,
      collectibles: collectibleResults,
      artisanProducts: artisanResults,
      stats
    };
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    throw error;
  }
};

// Main execution function
const main = async () => {
  try {
    await connectDB();
    
    // Parse command line arguments
    const args = process.argv.slice(2);
    const clearFirst = !args.includes('--no-clear');
    const verbose = !args.includes('--quiet');
    
    // Run seeding
    await seedDatabase({ clearFirst, verbose });
    
    // Show final stats
    const { getDatabaseStats } = await import('./seeders/utils.js');
    const finalStats = await getDatabaseStats();
    
    if (verbose) {
      console.log('\n📊 Database Summary:');
      console.log(`   Total Collections: ${Object.keys(finalStats).length - 3}`);
      console.log(`   Total Documents: ${finalStats.collectibleCategories + finalStats.artisanCategories + finalStats.collectibles + finalStats.artisanProducts}`);
      console.log(`   Featured Items: ${finalStats.featured.collectibles + finalStats.featured.artisanProducts}`);
      console.log(`   Popular Items: ${finalStats.popular.collectibles + finalStats.popular.artisanProducts}`);
      console.log(`   Recent Items: ${finalStats.recent.collectibles + finalStats.recent.artisanProducts}`);
    }
    
    await mongoose.connection.close();
    console.log('👋 Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding process failed:', error);
    process.exit(1);
  }
};

// Export functions for API use
export { seedDatabase };

// Always run main when this file is executed
if (import.meta.url === new URL(process.argv[1], 'file:').href) {
  main();
}