import Collector from '../../models/Collector.js';

// Get all collectors with pagination
export const getCollectors = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const collectors = await Collector.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate('wishlist.productId')
      .populate('purchaseHistory.productId');

    const total = await Collector.countDocuments();

    res.json({
      success: true,
      data: collectors,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    console.error('Error fetching collectors:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
};

// Get collector by ID
export const getCollectorById = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log(`Requested collector ID: ${id}`);
    console.log(`ID type: ${typeof id}`);

    const collector = await Collector.findOne({ id: id })
      .populate('userId')
      .populate('wishlist.productId')
      .populate('purchaseHistory.productId');
    
    console.log(`Found collector: ${collector ? 'Yes' : 'No'}`);

    if (!collector) {
      return res.status(404).json({
        success: false,
        error: 'Collector not found',
        message: `No collector found with ID: ${id}`
      });
    }

    res.json({
      success: true,
      data: collector
    });
  } catch (error) {
    console.error('Error fetching collector by ID:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
};

// Create new collector
export const createCollector = async (req, res) => {
  try {
    const collector = new Collector(req.body);
    await collector.save();

    res.status(201).json({
      success: true,
      data: collector,
      message: 'Collector created successfully'
    });
  } catch (error) {
    console.error('Error creating collector:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.errors
      });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Duplicate key error',
        message: 'Collector with this ID already exists'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
};

// Update collector
export const updateCollector = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body, updatedAt: new Date() };

    const collector = await Collector.findOneAndUpdate(
      { id: id },
      updates,
      { new: true, runValidators: true }
    ).populate('userId')
     .populate('wishlist.productId')
     .populate('purchaseHistory.productId');

    if (!collector) {
      return res.status(404).json({
        success: false,
        error: 'Collector not found',
        message: `No collector found with ID: ${id}`
      });
    }

    res.json({
      success: true,
      data: collector,
      message: 'Collector updated successfully'
    });
  } catch (error) {
    console.error('Error updating collector:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.errors
      });
    }

    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
};

// Delete collector
export const deleteCollector = async (req, res) => {
  try {
    const { id } = req.params;

    const collector = await Collector.findOneAndDelete({ id: id });

    if (!collector) {
      return res.status(404).json({
        success: false,
        error: 'Collector not found',
        message: `No collector found with ID: ${id}`
      });
    }

    res.json({
      success: true,
      message: 'Collector deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting collector:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
};

// Add item to collector's wishlist
export const addToWishlist = async (req, res) => {
  try {
    const { id } = req.params;
    const { productId } = req.body;

    const collector = await Collector.findOneAndUpdate(
      { id: id },
      { 
        $addToSet: { 
          wishlist: { 
            productId: productId,
            addedAt: new Date()
          } 
        } 
      },
      { new: true }
    ).populate('wishlist.productId');

    if (!collector) {
      return res.status(404).json({
        success: false,
        error: 'Collector not found',
        message: `No collector found with ID: ${id}`
      });
    }

    res.json({
      success: true,
      data: collector,
      message: 'Item added to wishlist successfully'
    });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
};

// Remove item from collector's wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const { id, productId } = req.params;

    const collector = await Collector.findOneAndUpdate(
      { id: id },
      { 
        $pull: { 
          wishlist: { productId: productId }
        } 
      },
      { new: true }
    ).populate('wishlist.productId');

    if (!collector) {
      return res.status(404).json({
        success: false,
        error: 'Collector not found',
        message: `No collector found with ID: ${id}`
      });
    }

    res.json({
      success: true,
      data: collector,
      message: 'Item removed from wishlist successfully'
    });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
};