import mongoose from 'mongoose';
import Artisan from '../../models/Artisan.js';

// Helper function to check if string is a valid ObjectId
const isValidObjectId = (id) => {
  if (!id || typeof id !== 'string') return false;
  return mongoose.Types.ObjectId.isValid(id) && String(new mongoose.Types.ObjectId(id)) === id;
};

const normalizeMediaArray = (input) => {
  if (!Array.isArray(input)) {
    return input;
  }

  return input
    .map(item => {
      if (!item) return null;
      if (typeof item === 'string') return item;
      if (typeof item === 'object' && item.url) return item.url;
      return null;
    })
    .filter(Boolean);
};

// Get all artisans with pagination
export const getArtisans = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10, 100); // Cap at 100
    const skip = (page - 1) * limit;

    // Use Promise.all for parallel execution and lean() for better performance
    const [artisans, total] = await Promise.all([
      Artisan.find()
        .select('-story.photos -story.handwrittenNotes -story.videos') // Exclude large fields by default
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean(),
      Artisan.countDocuments()
    ]);

    res.json({
      success: true,
      data: artisans,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    console.error('Error fetching artisans:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
};

// Get artisan by ID
export const getArtisanById = async (req, res) => {
  try {
    const { id } = req.params;
    const query = isValidObjectId(id)
      ? { _id: id }
      : { id: id };

    const artisan = await Artisan.findOne(query)
      .populate('userId', 'name email role')
      .lean();

    if (!artisan) {
      return res.status(404).json({
        success: false,
        error: 'Artisan not found',
        message: `No artisan found with ID: ${id}`
      });
    }

    res.json({
      success: true,
      data: artisan
    });
  } catch (error) {
    console.error('Error fetching artisan by ID:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
};

// Create new artisan
export const createArtisan = async (req, res) => {
  try {
    const payload = { ...req.body };

    if (payload.story) {
      payload.story = {
        ...payload.story,
        photos: normalizeMediaArray(payload.story.photos),
        handwrittenNotes: normalizeMediaArray(payload.story.handwrittenNotes),
      };
    }

    const artisan = new Artisan(payload);
    await artisan.save();

    res.status(201).json({
      success: true,
      data: artisan,
      message: 'Artisan created successfully'
    });
  } catch (error) {
    console.error('Error creating artisan:', error);
    
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
        message: 'Artisan with this ID already exists'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
};

// Update artisan
export const updateArtisan = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body, updatedAt: new Date() };

    if (updates.story) {
      updates.story = {
        ...updates.story,
        photos: normalizeMediaArray(updates.story.photos),
        handwrittenNotes: normalizeMediaArray(updates.story.handwrittenNotes),
      };
    }

    const query = isValidObjectId(id)
      ? { _id: id }
      : { id: id };

    const artisan = await Artisan.findOne(query);

    if (!artisan) {
      return res.status(404).json({
        success: false,
        error: 'Artisan not found',
        message: `No artisan found with ID: ${id}`
      });
    }

    // Sync profilePhotoUrl to User profileImage if userId exists
    if (updates.profilePhotoUrl !== undefined && artisan.userId) {
      try {
        const User = (await import('../../models/User.js')).default;
        await User.findByIdAndUpdate(
          artisan.userId,
          { profileImage: updates.profilePhotoUrl },
          { new: true }
        );
      } catch (syncError) {
        console.error('Error syncing profile photo to User:', syncError);
        // Don't fail the request if sync fails, just log it
      }
    }

    // Update artisan
    const updatedArtisan = await Artisan.findOneAndUpdate(
      query,
      updates,
      { new: true, runValidators: true }
    )
      .populate('userId', 'name email role profileImage')
      .lean();

    res.json({
      success: true,
      data: updatedArtisan,
      message: 'Artisan updated successfully'
    });
  } catch (error) {
    console.error('Error updating artisan:', error);
    
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

// Delete artisan
export const deleteArtisan = async (req, res) => {
  try {
    const { id } = req.params;

    const query = isValidObjectId(id)
      ? { _id: id }
      : { id: id };

    const artisan = await Artisan.findOneAndDelete(query);

    if (!artisan) {
      return res.status(404).json({
        success: false,
        error: 'Artisan not found',
        message: `No artisan found with ID: ${id}`
      });
    }

    res.json({
      success: true,
      message: 'Artisan deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting artisan:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
};