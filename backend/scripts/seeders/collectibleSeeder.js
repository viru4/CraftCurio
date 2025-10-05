import Collectible from '../../src/models/Collectible.js';
import { collectibleItems } from '../data/collectibleItems.js';

// Utility function to format collectibles
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