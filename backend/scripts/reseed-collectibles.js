import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Collectible from '../src/models/Collectible.js';
import { seedCollectibles } from './seeders/collectibleSeeder.js';

// Configure environment
dotenv.config();

async function reseedCollectibles() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing collectibles
    console.log('🗑️  Clearing existing collectibles...');
    const deletedCount = await Collectible.deleteMany({});
    console.log(`✅ Deleted ${deletedCount.deletedCount} collectibles`);

    // Seed new collectibles
    console.log('🌱 Seeding collectibles...');
    const result = await seedCollectibles(true);

    console.log(`\n✅ Collectibles reseeded successfully!`);
    console.log(`   Total collectibles: ${result.count}`);

    await mongoose.connection.close();
    console.log('👋 Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Reseeding failed:', error.message);
    console.error(error.stack);
    await mongoose.connection.close();
    process.exit(1);
  }
}

reseedCollectibles();
