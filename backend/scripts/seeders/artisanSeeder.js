import ArtisanProduct from '../../src/models/ArtisanProduct.js';
import { artisanProducts } from '../data/artisanProducts.js';

// Generate a seeder function that upserts artisan products with images using Mongoose bulkWrite
export const seedArtisanProducts = async (verbose = true) => {
  try {
    const bulkOps = artisanProducts.map(product => ({
      updateOne: {
        filter: { id: product.id },  // Find product by unique ID
        update: { $set: product },   // Update all fields including images
        upsert: true                 // Insert if not found
      }
    }));

    const result = await ArtisanProduct.bulkWrite(bulkOps);
    
    if (verbose) {
      console.log(`🎨 Artisan Products - Upserted: ${result.upsertedCount}, Modified: ${result.modifiedCount}`);
    }
    
    return {
      upserted: result.upsertedCount,
      modified: result.modifiedCount,
      total: artisanProducts.length
    };
  } catch (error) {
    console.error('❌ Artisan Products seeding failed:', error.message);
    throw error;
  }
};