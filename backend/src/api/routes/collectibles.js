import express from 'express';
import Collectible from '../../models/Collectible.js';

const router = express.Router();

// GET /api/collectibles - Get all collectibles
router.get('/', async (req, res) => {
  try {
    const { 
      category, 
      featured, 
      popular, 
      recent, 
      search, 
      limit = 50, 
      page = 1,
      sort = 'createdAt',
      order = 'desc'
    } = req.query;
    
    // Build filter object
    const filter = {};
    
    if (category) {
      filter.category = { $regex: category, $options: 'i' };
    }
    
    if (featured === 'true') {
      filter.featured = true;
    }
    
    if (popular === 'true') {
      filter.popular = true;
    }
    
    if (recent === 'true') {
      filter.recent = true;
    }
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    // Build sort object
    const sortObj = {};
    sortObj[sort] = order === 'desc' ? -1 : 1;
    
    // Execute query with pagination
    const [collectibles, totalCount] = await Promise.all([
      Collectible.find(filter)
        .sort(sortObj)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Collectible.countDocuments(filter)
    ]);
    
    res.status(200).json({
      message: 'Collectibles retrieved successfully',
      count: collectibles.length,
      totalCount,
      currentPage: pageNum,
      totalPages: Math.ceil(totalCount / limitNum),
      hasNextPage: pageNum < Math.ceil(totalCount / limitNum),
      hasPrevPage: pageNum > 1,
      data: collectibles
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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
router.get('/:id', async (req, res) => {
  try {
    const collectible = await Collectible.findById(req.params.id);
    if (!collectible) {
      return res.status(404).json({ error: 'Collectible not found' });
    }
    
    // Increment view count
    collectible.views += 1;
    await collectible.save();
    
    res.status(200).json({ data: collectible });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/collectibles - Create new collectible
router.post('/', async (req, res) => {
  try {
    const collectibleData = { ...req.body };
    
    // Store original ID if provided
    if (req.body.id) {
      collectibleData.originalId = req.body.id;
      delete collectibleData.id; // Remove id field as MongoDB will create _id
    }
    
    const collectible = new Collectible(collectibleData);
    const savedCollectible = await collectible.save();
    
    res.status(201).json({
      message: 'Collectible created successfully',
      data: savedCollectible
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/collectibles/:id/like - Like a collectible
router.put('/:id/like', async (req, res) => {
  try {
    const collectible = await Collectible.findById(req.params.id);
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