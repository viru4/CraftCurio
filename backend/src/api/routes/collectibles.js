import express from 'express';
import mongoose from 'mongoose';
import {
  getCollectibles,
  getCollectibleById,
  createCollectibles
} from '../controllers/collectibleController.js';
import Collectible from '../../models/Collectible.js';

const router = express.Router();

// GET /api/collectibles - Get all collectibles
router.get('/', getCollectibles);

// GET /api/collectibles/featured - Get featured items
router.get('/featured', async (req, res) => {
  try {
    const collectibles = await Collectible.find({ featured: true })
      .sort({ createdAt: -1 })
      .limit(10);
    
    res.status(200).json({
      message: 'Featured collectibles retrieved successfully',
      count: collectibles.length,
      data: collectibles
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/collectibles/popular - Get popular items
router.get('/popular', async (req, res) => {
  try {
    const collectibles = await Collectible.find({ popular: true })
      .sort({ views: -1, createdAt: -1 })
      .limit(10);
    
    res.status(200).json({
      message: 'Popular collectibles retrieved successfully',
      count: collectibles.length,
      data: collectibles
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/collectibles/recent - Get recent items
router.get('/recent', async (req, res) => {
  try {
    const collectibles = await Collectible.find({ recent: true })
      .sort({ createdAt: -1 })
      .limit(10);
    
    res.status(200).json({
      message: 'Recent collectibles retrieved successfully',
      count: collectibles.length,
      data: collectibles
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/collectibles/:id - Get single collectible
// IMPORTANT: This route must be AFTER the specific routes (featured, popular, recent)
// to avoid route conflicts
router.get('/:id', getCollectibleById);

// POST /api/collectibles - Create new collectible
router.post('/', createCollectibles);

// PATCH /api/collectibles/:id - Update collectible
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Find collectible by MongoDB _id or custom id field
    let collectible = await Collectible.findById(id);
    if (!collectible) {
      collectible = await Collectible.findOne({ id });
    }

    if (!collectible) {
      return res.status(404).json({ error: 'Collectible not found' });
    }

    // Update fields
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        collectible[key] = updateData[key];
      }
    });

    const updatedCollectible = await collectible.save();

    res.status(200).json({
      message: 'Collectible updated successfully',
      data: updatedCollectible
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/collectibles/:id - Delete collectible
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete collectible by MongoDB _id or custom id field
    let collectible = await Collectible.findByIdAndDelete(id);
    if (!collectible) {
      collectible = await Collectible.findOneAndDelete({ id });
    }

    if (!collectible) {
      return res.status(404).json({ error: 'Collectible not found' });
    }

    res.status(200).json({
      message: 'Collectible deleted successfully',
      data: collectible
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/collectibles/:id/like - Like a collectible
router.put('/:id/like', async (req, res) => {
  try {
    const { id } = req.params;
    let collectible = null;
    
    // Check if ID is a valid MongoDB ObjectId format
    const isValidObjectId = mongoose.Types.ObjectId.isValid(id);
    
    if (isValidObjectId) {
      collectible = await Collectible.findById(id);
    }
    
    // If not found by _id or not a valid ObjectId, try custom 'id' field
    if (!collectible) {
      collectible = await Collectible.findOne({ id });
    }
    
    if (!collectible) {
      return res.status(404).json({ error: 'Collectible not found' });
    }
    
    collectible.likes += 1;
    await collectible.save();
    
    res.status(200).json({
      message: 'Collectible liked successfully',
      data: collectible
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;