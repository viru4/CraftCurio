import { seedDatabase as seedDB } from '../../scripts/seed.js';
import { clearDatabase as clearDB, getDatabaseStats as getStats } from '../../scripts/seeders/utils.js';

export const seedDatabase = async (req, res) => {
  try {
    console.log('🌱 API: Starting database seeding...');
    
    const result = await seedDB({ 
      clearFirst: true, 
      verbose: true 
    });
    
    res.status(200).json({
      message: 'Database seeded successfully',
      data: {
        categories: result.categories,
        collectibles: result.collectibles,
        stats: result.stats,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('❌ API: Seeding failed:', error);
    res.status(500).json({ 
      error: 'Seeding failed', 
      details: error.message 
    });
  }
};

export const clearDatabase = async (req, res) => {
  try {
    console.log('🗑️  API: Clearing database...');
    
    const result = await clearDB(true);
    
    res.status(200).json({
      message: 'Database cleared successfully',
      data: {
        removedCategories: result.categoryCount,
        removedCollectibles: result.collectibleCount,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('❌ API: Clear failed:', error);
    res.status(500).json({ 
      error: 'Failed to clear database', 
      details: error.message 
    });
  }
};

export const getDatabaseStats = async (req, res) => {
  try {
    console.log('📊 API: Getting database statistics...');
    
    const stats = await getStats();
    
    res.status(200).json({
      message: 'Database statistics retrieved successfully',
      data: stats
    });
  } catch (error) {
    console.error('❌ API: Stats failed:', error);
    res.status(500).json({ 
      error: 'Failed to get database stats', 
      details: error.message 
    });
  }
};
