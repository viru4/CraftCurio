import Collectible from '../../src/models/Collectible.js';
import { collectibleItems } from '../data/collectibleItems.js';

// Utility function to format collectibles
const formatCollectible = (item) => {
  return {
    ...item,
    // Preserve custom ID if provided
    id: item.id || undefined,
    // Ensure price is a number
    price: typeof item.price === 'string' ? parseFloat(item.price) || 0 : (item.price || 0),
    // Ensure required fields have defaults
    targetSection: item.targetSection || 'filtered-items-section',
    buttonText: item.buttonText || 'Explore Collection',
    featured: item.featured || false,
    popular: item.popular || false,
    recent: item.recent || false,
    views: item.views || 0,
    likes: item.likes || 0
  };
};

export const seedCollectibles = async (verbose = true) => {
  try {
    // Format and insert collectibles
    const collectibleDocs = collectibleItems.map(formatCollectible);
    const savedCollectibles = await Collectible.insertMany(collectibleDocs);
    
    if (verbose) {
      console.log(`🎯 ${savedCollectibles.length} collectibles seeded`);
    }
    
    return {
      count: savedCollectibles.length,
      items: savedCollectibles
    };
  } catch (error) {
    console.error('❌ Collectibles seeding failed:', error.message);
    throw error;
  }
};