import Collectible from '../../models/Collectible.js';

export const createCollectibles = async (req, res) => {
  try {
    const collectibles = req.body.collectibles;
    const result = await Collectible.insertMany(collectibles);
    res.status(201).json({ 
      message: 'Collectibles created successfully', 
      count: result.length,
      data: result 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCollectibles = async (req, res) => {
  try {
    const { category, featured, popular, recent, search, limit = 20, page = 1 } = req.query;
    
    let query = {};
    
    // Add filters
    if (category) query.category = category;
    if (featured === 'true') query.featured = true;
    if (popular === 'true') query.popular = true;
    if (recent === 'true') query.recent = true;
    if (search) {
      query.$text = { $search: search };
    }
    
    const skip = (page - 1) * limit;
    
    const collectibles = await Collectible.find(query)
      .sort(search ? { score: { $meta: 'textScore' } } : { createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);
      
    const total = await Collectible.countDocuments(query);
    
    res.status(200).json({
      message: 'Collectibles retrieved successfully',
      count: collectibles.length,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      data: collectibles
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCollectibleById = async (req, res) => {
  try {
    const collectible = await Collectible.findById(req.params.id);
    if (!collectible) {
      return res.status(404).json({ error: 'Collectible not found' });
    }
    
    // Increment views
    collectible.views += 1;
    await collectible.save();
    
    res.status(200).json({ data: collectible });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};