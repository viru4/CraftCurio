import CollectibleCategory from '../../models/collectiblecategory.js';
import ArtisanProductCategory from '../../models/ArtisanProductCategory.js';

// Unified category controllers (backwards compatibility)
export const getCategories = async (req, res) => {
  try {
    const { type } = req.query;
    
    if (type === 'collectible') {
      const categories = await CollectibleCategory.find()
        .select('name description image')
        .sort({ name: 1 })
        .lean();
      return res.status(200).json({
        message: 'Collectible categories retrieved successfully',
        count: categories.length,
        data: categories
      });
    }
    
    if (type === 'artisan') {
      const categories = await ArtisanProductCategory.find()
        .select('name description image')
        .sort({ name: 1 })
        .lean();
      return res.status(200).json({
        message: 'Artisan categories retrieved successfully',
        count: categories.length,
        data: categories
      });
    }
    
    // If no type specified, return both
    const [collectibleCategories, artisanCategories] = await Promise.all([
      CollectibleCategory.find().select('name description image').sort({ name: 1 }).lean(),
      ArtisanProductCategory.find().select('name description image').sort({ name: 1 }).lean()
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

// ==================== ADMIN CATEGORY MANAGEMENT ====================

// Get all categories with filters for admin (includes pending, approved, rejected)
export const getAllCategoriesForAdmin = async (req, res) => {
  try {
    const { type, status, search, page = 1, limit = 20 } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const query = {};
    
    // Filter by status
    if (status && status !== 'all') {
      query.status = status;
    }
    
    // Search by name or description
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') }
      ];
    }
    
    let collectibleCategories = [];
    let artisanCategories = [];
    let collectibleCount = 0;
    let artisanCount = 0;
    
    if (!type || type === 'all' || type === 'collectible') {
      collectibleCategories = await CollectibleCategory.find(query)
        .populate('submittedBy', 'firstName lastName email')
        .populate('reviewedBy', 'firstName lastName email')
        .sort({ createdAt: -1 })
        .skip(type === 'collectible' ? skip : 0)
        .limit(type === 'collectible' ? parseInt(limit) : 0)
        .lean();
      collectibleCount = await CollectibleCategory.countDocuments(query);
    }
    
    if (!type || type === 'all' || type === 'artisan') {
      artisanCategories = await ArtisanProductCategory.find(query)
        .populate('submittedBy', 'firstName lastName email')
        .populate('reviewedBy', 'firstName lastName email')
        .sort({ createdAt: -1 })
        .skip(type === 'artisan' ? skip : 0)
        .limit(type === 'artisan' ? parseInt(limit) : 0)
        .lean();
      artisanCount = await ArtisanProductCategory.countDocuments(query);
    }
    
    // Add type field to each category
    const collectibleWithType = collectibleCategories.map(cat => ({ ...cat, type: 'collectible' }));
    const artisanWithType = artisanCategories.map(cat => ({ ...cat, type: 'artisan' }));
    
    res.status(200).json({
      message: 'Categories retrieved successfully',
      data: {
        categories: type === 'collectible' ? collectibleWithType : 
                   type === 'artisan' ? artisanWithType : 
                   [...collectibleWithType, ...artisanWithType],
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: type === 'collectible' ? collectibleCount : 
                type === 'artisan' ? artisanCount : 
                collectibleCount + artisanCount
        },
        stats: {
          collectible: collectibleCount,
          artisan: artisanCount,
          total: collectibleCount + artisanCount
        }
      }
    });
  } catch (error) {
    console.error('Error fetching categories for admin:', error);
    res.status(500).json({ error: error.message });
  }
};

// Submit a new category (by seller/artisan)
export const submitCategory = async (req, res) => {
  try {
    const { name, description, type, icon, ...otherFields } = req.body;
    const userId = req.user._id;
    
    if (!name || !description || !type) {
      return res.status(400).json({ 
        error: 'Name, description, and type are required' 
      });
    }
    
    if (!['collectible', 'artisan'].includes(type)) {
      return res.status(400).json({ 
        error: 'Type must be either "collectible" or "artisan"' 
      });
    }
    
    // Check if category already exists
    const Model = type === 'collectible' ? CollectibleCategory : ArtisanProductCategory;
    const existingCategory = await Model.findOne({ 
      name: new RegExp(`^${name}$`, 'i') 
    });
    
    if (existingCategory) {
      return res.status(400).json({ 
        error: 'A category with this name already exists',
        category: existingCategory 
      });
    }
    
    // Create new category with pending status
    const categoryData = {
      name,
      description,
      icon: icon || '',
      status: 'pending',
      submittedBy: userId,
      ...otherFields
    };
    
    const newCategory = await Model.create(categoryData);
    
    res.status(201).json({
      message: 'Category submitted successfully and is pending approval',
      data: newCategory
    });
  } catch (error) {
    console.error('Error submitting category:', error);
    res.status(500).json({ error: error.message });
  }
};

// Update category (admin only)
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, ...updateData } = req.body;
    
    if (!type || !['collectible', 'artisan'].includes(type)) {
      return res.status(400).json({ 
        error: 'Type is required and must be either "collectible" or "artisan"' 
      });
    }
    
    const Model = type === 'collectible' ? CollectibleCategory : ArtisanProductCategory;
    const category = await Model.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
    
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    res.status(200).json({
      message: 'Category updated successfully',
      data: category
    });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ error: error.message });
  }
};

// Approve category (admin only)
export const approveCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.body;
    const adminId = req.user._id;
    
    if (!type || !['collectible', 'artisan'].includes(type)) {
      return res.status(400).json({ 
        error: 'Type is required and must be either "collectible" or "artisan"' 
      });
    }
    
    const Model = type === 'collectible' ? CollectibleCategory : ArtisanProductCategory;
    const category = await Model.findByIdAndUpdate(
      id,
      {
        $set: {
          status: 'approved',
          reviewedBy: adminId,
          reviewedAt: new Date(),
          rejectionReason: ''
        }
      },
      { new: true }
    ).populate('submittedBy', 'firstName lastName email');
    
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    res.status(200).json({
      message: 'Category approved successfully',
      data: category
    });
  } catch (error) {
    console.error('Error approving category:', error);
    res.status(500).json({ error: error.message });
  }
};

// Reject category (admin only)
export const rejectCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, reason } = req.body;
    const adminId = req.user._id;
    
    if (!type || !['collectible', 'artisan'].includes(type)) {
      return res.status(400).json({ 
        error: 'Type is required and must be either "collectible" or "artisan"' 
      });
    }
    
    const Model = type === 'collectible' ? CollectibleCategory : ArtisanProductCategory;
    const category = await Model.findByIdAndUpdate(
      id,
      {
        $set: {
          status: 'rejected',
          reviewedBy: adminId,
          reviewedAt: new Date(),
          rejectionReason: reason || 'No reason provided'
        }
      },
      { new: true }
    ).populate('submittedBy', 'firstName lastName email');
    
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    res.status(200).json({
      message: 'Category rejected successfully',
      data: category
    });
  } catch (error) {
    console.error('Error rejecting category:', error);
    res.status(500).json({ error: error.message });
  }
};

// Delete category (admin only)
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.query;
    
    if (!type || !['collectible', 'artisan'].includes(type)) {
      return res.status(400).json({ 
        error: 'Type is required and must be either "collectible" or "artisan"' 
      });
    }
    
    const Model = type === 'collectible' ? CollectibleCategory : ArtisanProductCategory;
    const category = await Model.findByIdAndDelete(id);
    
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    res.status(200).json({
      message: 'Category deleted successfully',
      data: category
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get category statistics (admin only)
export const getCategoryStats = async (req, res) => {
  try {
    const [collectibleStats, artisanStats] = await Promise.all([
      CollectibleCategory.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]),
      ArtisanProductCategory.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ])
    ]);
    
    const formatStats = (stats) => {
      const result = { pending: 0, approved: 0, rejected: 0, total: 0 };
      stats.forEach(stat => {
        result[stat._id] = stat.count;
        result.total += stat.count;
      });
      return result;
    };
    
    res.status(200).json({
      message: 'Category statistics retrieved successfully',
      data: {
        collectible: formatStats(collectibleStats),
        artisan: formatStats(artisanStats)
      }
    });
  } catch (error) {
    console.error('Error fetching category stats:', error);
    res.status(500).json({ error: error.message });
  }
};
