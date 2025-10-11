import mongoose from 'mongoose';
import dotenv from 'dotenv';

console.log('🔄 Starting modular seeding system...');

// Configure environment
dotenv.config();

async function seedDatabase(options = {}) {
  const { clearFirst = true, verbose = true } = options;
  
  try {
    // Connect to database
    if (verbose) console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    if (verbose) console.log('✅ Connected to MongoDB');

    // Load all seeders
    if (verbose) console.log('📦 Loading seeder modules...');
    const { seedCategories } = await import('./seeders/categorySeeder.js');
    const { seedCollectibles } = await import('./seeders/collectibleSeeder.js');
    const { seedArtisanProducts } = await import('./seeders/artisanProductSeeder.js');
    const { seedArtisans } = await import('./seeders/artisansSeeder.js');
    const { seedCollectors } = await import('./seeders/collectorsSeeder.js');
    const { getDatabaseStats, clearDatabase } = await import('./seeders/utils.js');
    if (verbose) console.log('✅ All seeders loaded');

    // Clear database first
    if (clearFirst) {
      if (verbose) console.log('🗑️ Clearing database...');
      await clearDatabase(false);
    }

    // Seed all data
    if (verbose) console.log('🌱 Seeding categories...');
    const categoryResults = await seedCategories(verbose);
    
    if (verbose) console.log('🎯 Seeding collectibles...');
    const collectibleResults = await seedCollectibles(verbose);
    
    if (verbose) console.log('🎨 Seeding artisan products...');
    const artisanResults = await seedArtisanProducts(verbose);
    
    if (verbose) console.log('👨‍🎨 Seeding artisans...');
    const artisansResults = await seedArtisans(verbose);
    
    if (verbose) console.log('🎯 Seeding collectors...');
    const collectorsResults = await seedCollectors(verbose);

    // Get final stats
    const stats = await getDatabaseStats();
    
    if (verbose) {
      console.log('\n✅ Database seeding completed successfully!');
      console.log('� Final Statistics:');
      console.log(`   Categories: ${stats.collectibleCategories + stats.artisanCategories}`);
      console.log(`   Collectibles: ${stats.collectibles}`);
      console.log(`   Artisan Products: ${stats.artisanProducts}`);
      console.log(`   Artisans: ${stats.artisans}`);
      console.log(`   Collectors: ${stats.collectors}`);
    }

    return {
      success: true,
      categories: categoryResults,
      collectibles: collectibleResults,
      artisanProducts: artisanResults,
      artisans: artisansResults,
      collectors: collectorsResults,
      stats
    };
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    console.error(error.stack);
    throw error;
  }
}

// Main execution function
async function main() {
  try {
    // Parse command line arguments
    const args = process.argv.slice(2);
    const clearFirst = !args.includes('--no-clear');
    const verbose = !args.includes('--quiet');
    
    // Run seeding
    await seedDatabase({ clearFirst, verbose });
    
    await mongoose.connection.close();
    if (verbose) console.log('👋 Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding process failed:', error);
    process.exit(1);
  }
}

// Export functions for API use
export { seedDatabase };

// Always run main when this file is executed
if (import.meta.url === new URL(process.argv[1], 'file:').href) {
  main();
}