import Collector from '../../models/Collector.js';
import {
  buildCollectorIdentifierFilter,
  findCollectorByIdentifier,
  generateCollectorId,
  normalizeCollectorId
} from '../../utils/collectorIdentifier.js';

// Get all collectors with pagination
export const getCollectors = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Use Promise.all for parallel execution and lean() for better performance
    const [collectors, total] = await Promise.all([
      Collector.find()
        .select('-wishlist -purchaseHistory') // Exclude large arrays by default, populate only if needed
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean(),
      Collector.countDocuments()
    ]);

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

// Get collector by ID (MongoDB _id or userId)
export const getCollectorById = async (req, res) => {
  try {
    const { id } = req.params;

    const collector = await findCollectorByIdentifier(id, {
      populate: ['userId', 'wishlist.productId', 'purchaseHistory.productId']
    });

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
    const payload = { ...req.body };

    if (payload.id) {
      payload.id = normalizeCollectorId(payload.id);
      const existing = await Collector.exists({ id: payload.id });
      if (existing) {
        return res.status(409).json({
          success: false,
          error: 'Duplicate collector id',
          message: `Collector id ${payload.id} already exists`
        });
      }
    } else {
      payload.id = await generateCollectorId();
    }

    const collector = new Collector(payload);
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
        message: 'A collector already exists for this user'
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
    const currentCollector = await findCollectorByIdentifier(id);

    if (!currentCollector) {
      return res.status(404).json({
        success: false,
        error: 'Collector not found',
        message: `No collector found with ID: ${id}`
      });
    }

    const updates = { ...req.body, updatedAt: new Date() };

    if (updates.id) {
      updates.id = normalizeCollectorId(updates.id);
      const exists = await Collector.exists({ id: updates.id, _id: { $ne: currentCollector._id } });
      if (exists) {
        return res.status(409).json({
          success: false,
          error: 'Duplicate collector id',
          message: `Collector id ${updates.id} already exists`
        });
      }
    }

    // Sync profilePhotoUrl to User profileImage if userId exists
    if (updates.profilePhotoUrl !== undefined && currentCollector.userId) {
      try {
        const User = (await import('../../models/User.js')).default;
        await User.findByIdAndUpdate(
          currentCollector.userId,
          { profileImage: updates.profilePhotoUrl },
          { new: true }
        );
      } catch (syncError) {
        console.error('Error syncing profile photo to User:', syncError);
        // Don't fail the request if sync fails, just log it
      }
    }

    const collector = await Collector.findByIdAndUpdate(
      currentCollector._id,
      updates,
      { new: true, runValidators: true }
    )
      .populate('userId')
      .populate('wishlist.productId')
      .populate('purchaseHistory.productId');

    // collector should exist because we already found it, but guard just in case
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

    const filter = buildCollectorIdentifierFilter(id);
    if (!filter) {
      return res.status(400).json({
        success: false,
        error: 'Invalid collector identifier'
      });
    }

    const collector = await Collector.findOneAndDelete(filter);

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

    const currentCollector = await findCollectorByIdentifier(id);
    if (!currentCollector) {
      return res.status(404).json({
        success: false,
        error: 'Collector not found',
        message: `No collector found with ID: ${id}`
      });
    }

    const collector = await Collector.findByIdAndUpdate(
      currentCollector._id,
      {
        $addToSet: {
          wishlist: {
            productId,
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

    const currentCollector = await findCollectorByIdentifier(id);
    if (!currentCollector) {
      return res.status(404).json({
        success: false,
        error: 'Collector not found',
        message: `No collector found with ID: ${id}`
      });
    }

    const collector = await Collector.findByIdAndUpdate(
      currentCollector._id,
      {
        $pull: {
          wishlist: { productId }
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