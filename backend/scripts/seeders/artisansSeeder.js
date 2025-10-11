import Artisan from '../../src/models/Artisan.js';
import { artisansData } from '../data/artisans.js';

// Generate a seeder function that upserts artisans using Mongoose bulkWrite
export const seedArtisans = async (verbose = true) => {
  try {
    const bulkOps = artisansData.map(artisan => ({
      updateOne: {
        filter: { id: artisan.id },  // Find artisan by unique ID
        update: { $set: artisan },   // Update all fields
        upsert: true                 // Insert if not found
      }
    }));

    const result = await Artisan.bulkWrite(bulkOps);
    
    if (verbose) {
      console.log(`👨‍🎨 Artisans - Upserted: ${result.upsertedCount}, Modified: ${result.modifiedCount}`);
    }
    
    return {
      upserted: result.upsertedCount,
      modified: result.modifiedCount,
      total: artisansData.length
    };
  } catch (error) {
    console.error('❌ Artisans seeding failed:', error.message);
    throw error;
  }
};