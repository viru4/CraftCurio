import Artisan from '../../models/Artisan.js';

// Get all artisans with pagination
export const getArtisans = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const artisans = await Artisan.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Artisan.countDocuments();

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
    
    console.log(`Requested artisan ID: ${id}`);
    console.log(`ID type: ${typeof id}`);

    const artisan = await Artisan.findOne({ id: id }).populate('userId');
    
    console.log(`Found artisan: ${artisan ? 'Yes' : 'No'}`);

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
    const artisan = new Artisan(req.body);
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

    const artisan = await Artisan.findOneAndUpdate(
      { id: id },
      updates,
      { new: true, runValidators: true }
    ).populate('userId');

    if (!artisan) {
      return res.status(404).json({
        success: false,
        error: 'Artisan not found',
        message: `No artisan found with ID: ${id}`
      });
    }

    res.json({
      success: true,
      data: artisan,
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

    const artisan = await Artisan.findOneAndDelete({ id: id });

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