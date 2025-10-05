import express from 'express';
import { seedDatabase, clearDatabase, getDatabaseStats } from '../../../scripts/seedData.js';

const router = express.Router();

// Seed database via API
router.post('/run', async (req, res) => {
  try {
    const { clearFirst = true } = req.body;
    const result = await seedDatabase({ clearFirst, verbose: false });
    res.status(200).json({
      message: 'Database seeded successfully',
      ...result
    });
  } catch (error) {
    res.status(500).json({
      error: 'Seeding failed',
      message: error.message
    });
  }
});

// Clear database via API
router.delete('/clear', async (req, res) => {
  try {
    const result = await clearDatabase(false);
    res.status(200).json({
      message: 'Database cleared successfully',
      ...result
    });
  } catch (error) {
    res.status(500).json({
      error: 'Clear operation failed',
      message: error.message
    });
  }
});

// Get database statistics via API
router.get('/stats', async (req, res) => {
  try {
    const stats = await getDatabaseStats();
    res.status(200).json({
      message: 'Database statistics retrieved successfully',
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get statistics',
      message: error.message
    });
  }
});

export default router;