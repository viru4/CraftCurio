import CollectibleCategory from '../models/collectiblecategory.js';
import ArtisanProductCategory from '../models/ArtisanProductCategory.js';

// Unified category controllers (backwards compatibility)
export const getCategories = async (req, res) => {
  try {
    const { type } = req.query;
    
    if (type === 'collectible') {
      const categories = await CollectibleCategory.find().sort({ name: 1 });
      return res.status(200).json({
        message: 'Collectible categories retrieved successfully',
        count: categories.length,
        data: categories
      });
    }
    
    if (type === 'artisan') {
      const categories = await ArtisanProductCategory.find().sort({ name: 1 });
      return res.status(200).json({
        message: 'Artisan categories retrieved successfully',
        count: categories.length,
        data: categories
      });
    }
    
    // If no type specified, return both
    const [collectibleCategories, artisanCategories] = await Promise.all([
      CollectibleCategory.find().sort({ name: 1 }),
      ArtisanProductCategory.find().sort({ name: 1 })
    ]);
    
    res.status(200).json({
      message: 'All categories retrieved successfully',
      data: {
        collectible: collectibleCategories,
        artisan: artisanCategories,
        total: collectibleCategories.length + artisanCategories.length
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const { type } = req.query;
    
    // Convert slug back to name (reverse of createSlug function)
    const name = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    let category = null;
    
    if (type === 'collectible') {
      category = await CollectibleCategory.findOne({ 
        $or: [{ name }, { name: new RegExp(name, 'i') }]
      });
    } else if (type === 'artisan') {
      category = await ArtisanProductCategory.findOne({ 
        $or: [{ name }, { name: new RegExp(name, 'i') }]
      });
    } else {
      // Search both if type not specified
      category = await CollectibleCategory.findOne({ 
        $or: [{ name }, { name: new RegExp(name, 'i') }]
      });
      
      if (!category) {
        category = await ArtisanProductCategory.findOne({ 
          $or: [{ name }, { name: new RegExp(name, 'i') }]
        });
      }
    }
    
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    res.status(200).json({ data: category });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createCategories = async (req, res) => {
  try {
    const { categories, type } = req.body;
    
    if (!type || !['collectible', 'artisan'].includes(type)) {
      return res.status(400).json({ 
        error: 'Type is required and must be either "collectible" or "artisan"' 
      });
    }
    
    let result;
    if (type === 'collectible') {
      result = await CollectibleCategory.insertMany(categories);
    } else {
      result = await ArtisanProductCategory.insertMany(categories);
    }
    
    res.status(201).json({ 
      message: `${type} categories created successfully`, 
      count: result.length,
      data: result 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Collectible Category Controllers
export const createCollectibleCategories = async (req, res) => {
  try {
    const categories = req.body.categories;
    const result = await CollectibleCategory.insertMany(categories);
    res.status(201).json({ 
      message: 'Collectible categories created successfully', 
      count: result.length,
      data: result 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCollectibleCategories = async (req, res) => {
  try {
    const categories = await CollectibleCategory.find().sort({ name: 1 });
    res.status(200).json({
      message: 'Collectible categories retrieved successfully',
      count: categories.length,
      data: categories
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCollectibleCategoryByName = async (req, res) => {
  try {
    const category = await CollectibleCategory.findOne({ name: req.params.name });
    if (!category) {
      return res.status(404).json({ error: 'Collectible category not found' });
    }
    res.status(200).json({ data: category });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Artisan Category Controllers
export const createArtisanCategories = async (req, res) => {
  try {
    const categories = req.body.categories;
    const result = await ArtisanProductCategory.insertMany(categories);
    res.status(201).json({ 
      message: 'Artisan categories created successfully', 
      count: result.length,
      data: result 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getArtisanCategories = async (req, res) => {
  try {
    const categories = await ArtisanProductCategory.find().sort({ name: 1 });
    res.status(200).json({
      message: 'Artisan categories retrieved successfully',
      count: categories.length,
      data: categories
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getArtisanCategoryByName = async (req, res) => {
  try {
    const category = await ArtisanProductCategory.findOne({ name: req.params.name });
    if (!category) {
      return res.status(404).json({ error: 'Artisan category not found' });
    }
    res.status(200).json({ data: category });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
