import mongoose from 'mongoose';
import Collectible from '../../models/Collectible.js';

const toPositiveInt = (value, fallback) => {
  const parsed = parseInt(value, 10);
  if (Number.isFinite(parsed) && parsed > 0) {
    return parsed;
  }
  return fallback;
};

export const createCollectibles = async (req, res) => {
  try {
    const collectibles = req.body.collectibles;

    if (!Array.isArray(collectibles) || collectibles.length === 0) {
      return res.status(400).json({ error: 'collectibles must be a non-empty array' });
    }

    // Normalize prices to numbers and preserve custom IDs
    const normalizedCollectibles = collectibles.map(item => ({
      ...item,
      id: item.id || undefined,  // Preserve custom ID if provided
      price: typeof item.price === 'string' ? parseFloat(item.price) || 0 : (typeof item.price === 'number' ? item.price : 0),
      views: item.views || 0,
      likes: item.likes || 0
    }));

    const result = await Collectible.insertMany(normalizedCollectibles);
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
    const { category, featured, popular, recent, search } = req.query;
    const limit = Math.min(toPositiveInt(req.query.limit, 20), 100);
    const page = toPositiveInt(req.query.page, 1);
    
    const query = {};
    
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
      .limit(limit)
      .skip(skip)
      .lean();
      
    const total = await Collectible.countDocuments(query);
    const totalPages = Math.ceil(total / limit) || 1;
    
    res.status(200).json({
      message: 'Collectibles retrieved successfully',
      count: collectibles.length,
      total,
      page,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      data: collectibles
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCollectibleById = async (req, res) => {
  try {
    const { id } = req.params;
    
    let collectible = null;
    
    // Check if ID is a valid MongoDB ObjectId format
    const isValidObjectId = mongoose.Types.ObjectId.isValid(id);
    
    if (isValidObjectId) {
      // Try MongoDB _id first if it's a valid ObjectId format
      collectible = await Collectible.findById(id);
    }
    
    // If not found by _id or not a valid ObjectId, try custom 'id' field
    if (!collectible) {
      collectible = await Collectible.findOne({ id });
    }
    
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