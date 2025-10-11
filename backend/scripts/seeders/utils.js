
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Configure environment
dotenv.config();

import CollectibleCategory from '../../src/models/collectiblecategory.js';
import ArtisanProductCategory from '../../src/models/ArtisanProductCategory.js';
import Collectible from '../../src/models/Collectible.js';
import ArtisanProduct from '../../src/models/ArtisanProduct.js';
import Artisan from '../../src/models/Artisan.js';
import Collector from '../../src/models/Collector.js';

// Utility functions
export const createSlug = (name) => {
  return name.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .trim();
};

// Ensure database connection
const ensureConnection = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI);
  }
};

// Get database statistics
export const getDatabaseStats = async () => {
  try {
    await ensureConnection();
    const [
      collectibleCategoryCount, 
      artisanCategoryCount, 
      collectibleCount, 
      artisanProductCount,
      artisanCount,
      collectorCount,
      featuredCollectibles, 
      popularCollectibles, 
      recentCollectibles,
      featuredArtisanProducts,
      popularArtisanProducts,
      recentArtisanProducts
    ] = await Promise.all([
      CollectibleCategory.countDocuments(),
      ArtisanProductCategory.countDocuments(),
      Collectible.countDocuments(),
      ArtisanProduct.countDocuments(),
      Artisan.countDocuments(),
      Collector.countDocuments(),
      Collectible.countDocuments({ featured: true }),
      Collectible.countDocuments({ popular: true }),
      Collectible.countDocuments({ recent: true }),
      ArtisanProduct.countDocuments({ featured: true }),
      ArtisanProduct.countDocuments({ popular: true }),
      ArtisanProduct.countDocuments({ recent: true })
    ]);
    
    return {
      collectibleCategories: collectibleCategoryCount,
      artisanCategories: artisanCategoryCount,
      collectibles: collectibleCount,
      artisanProducts: artisanProductCount,
      artisans: artisanCount,
      collectors: collectorCount,
      featured: {
        collectibles: featuredCollectibles,
        artisanProducts: featuredArtisanProducts
      },
      popular: {
        collectibles: popularCollectibles,
        artisanProducts: popularArtisanProducts
      },
      recent: {
        collectibles: recentCollectibles,
        artisanProducts: recentArtisanProducts
      }
    };
  } catch (error) {
    console.error('❌ Failed to get database stats:', error.message);
    throw error;
  }
};

// Clear database function
export const clearDatabase = async (verbose = true) => {
  try {
    await ensureConnection();
    const collectibleCategoryCount = await CollectibleCategory.countDocuments();
    const artisanCategoryCount = await ArtisanProductCategory.countDocuments();
    const collectibleCount = await Collectible.countDocuments();
    const artisanProductCount = await ArtisanProduct.countDocuments();
    const artisanCount = await Artisan.countDocuments();
    const collectorCount = await Collector.countDocuments();
    
    await CollectibleCategory.deleteMany({});
    await ArtisanProductCategory.deleteMany({});
    await Collectible.deleteMany({});
    await ArtisanProduct.deleteMany({});
    await Artisan.deleteMany({});
    await Collector.deleteMany({});
    
    if (verbose) {
      console.log('🗑️  Database cleared successfully');
      console.log(`   Removed ${collectibleCategoryCount} collectible categories`);
      console.log(`   Removed ${artisanCategoryCount} artisan categories`);
      console.log(`   Removed ${collectibleCount} collectibles`);
      console.log(`   Removed ${artisanProductCount} artisan products`);
      console.log(`   Removed ${artisanCount} artisans`);
      console.log(`   Removed ${collectorCount} collectors`);
    }
    
    return { collectibleCategoryCount, artisanCategoryCount, collectibleCount, artisanProductCount, artisanCount, collectorCount };
  } catch (error) {
    console.error('❌ Failed to clear database:', error.message);
    throw error;
  }
};