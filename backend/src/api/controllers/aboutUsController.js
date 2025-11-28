import AboutUs from '../../models/AboutUs.js';
import asyncHandler from '../../middleware/asyncHandler.js';

/**
 * About Us Controller
 * Handles CRUD operations for About Us page content
 */

/**
 * @desc    Get About Us page data
 * @route   GET /api/about-us
 * @access  Public
 */
export const getAboutUs = asyncHandler(async (req, res) => {
  try {
    // Get or create About Us page data
    const aboutUs = await AboutUs.getOrCreate();

    res.status(200).json({
      success: true,
      data: aboutUs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch About Us data',
      error: error.message
    });
  }
});

/**
 * @desc    Update About Us page data (full update)
 * @route   PUT /api/about-us
 * @access  Private/Admin
 */
export const updateAboutUs = asyncHandler(async (req, res) => {
  try {
    const updates = req.body;

    // Get or create About Us page
    let aboutUs = await AboutUs.getOrCreate();

    // Update all provided fields
    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined && key !== '_id' && key !== '__v') {
        aboutUs[key] = updates[key];
      }
    });

    // Track who made the update
    if (req.user) {
      aboutUs.lastUpdatedBy = req.user._id;
    }

    // Save updates
    await aboutUs.save();

    res.status(200).json({
      success: true,
      message: 'About Us page updated successfully',
      data: aboutUs
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update About Us page',
      error: error.message
    });
  }
});

/**
 * @desc    Update specific section of About Us page
 * @route   PATCH /api/about-us/:section
 * @access  Private/Admin
 */
export const updateAboutUsSection = asyncHandler(async (req, res) => {
  try {
    const { section } = req.params;
    const updates = req.body;

    console.log(`[About Us] Updating section: ${section}`);
    console.log('[About Us] Update data:', JSON.stringify(updates, null, 2));

    // Valid sections
    const validSections = [
      'hero', 'story', 'mission', 'team', 'timeline', 
      'unique', 'impact', 'testimonials', 'gallery', 'contact'
    ];

    if (!validSections.includes(section)) {
      return res.status(400).json({
        success: false,
        message: `Invalid section. Must be one of: ${validSections.join(', ')}`
      });
    }

    // Get or create About Us page
    let aboutUs = await AboutUs.getOrCreate();

    // Update specific section
    aboutUs[section] = {
      ...aboutUs[section].toObject(),
      ...updates
    };

    // Track who made the update
    if (req.user) {
      aboutUs.lastUpdatedBy = req.user._id;
    }

    await aboutUs.save();
    
    console.log(`[About Us] Section ${section} saved successfully`);

    res.status(200).json({
      success: true,
      message: `${section} section updated successfully`,
      data: aboutUs[section]
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: `Failed to update ${req.params.section} section`,
      error: error.message
    });
  }
});

/**
 * @desc    Add item to array field (team member, testimonial, etc.)
 * @route   POST /api/about-us/:section/:field
 * @access  Private/Admin
 */
export const addArrayItem = asyncHandler(async (req, res) => {
  try {
    const { section, field } = req.params;
    const itemData = req.body;

    let aboutUs = await AboutUs.getOrCreate();

    // Check if section and field exist
    if (!aboutUs[section] || !Array.isArray(aboutUs[section][field])) {
      return res.status(400).json({
        success: false,
        message: `Invalid section or field path: ${section}.${field}`
      });
    }

    // Add new item to array
    aboutUs[section][field].push(itemData);

    // Track who made the update
    if (req.user) {
      aboutUs.lastUpdatedBy = req.user._id;
    }

    await aboutUs.save();

    // Get the newly added item
    const newItem = aboutUs[section][field][aboutUs[section][field].length - 1];

    res.status(201).json({
      success: true,
      message: `Item added to ${section}.${field} successfully`,
      data: newItem
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to add item',
      error: error.message
    });
  }
});

/**
 * @desc    Update item in array field
 * @route   PUT /api/about-us/:section/:field/:itemId
 * @access  Private/Admin
 */
export const updateArrayItem = asyncHandler(async (req, res) => {
  try {
    const { section, field, itemId } = req.params;
    const updates = req.body;

    let aboutUs = await AboutUs.getOrCreate();

    // Check if section and field exist
    if (!aboutUs[section] || !Array.isArray(aboutUs[section][field])) {
      return res.status(400).json({
        success: false,
        message: `Invalid section or field path: ${section}.${field}`
      });
    }

    // Find and update the item
    const item = aboutUs[section][field].id(itemId);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    // Update item properties
    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined && key !== '_id') {
        item[key] = updates[key];
      }
    });

    // Track who made the update
    if (req.user) {
      aboutUs.lastUpdatedBy = req.user._id;
    }

    await aboutUs.save();

    res.status(200).json({
      success: true,
      message: 'Item updated successfully',
      data: item
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update item',
      error: error.message
    });
  }
});

/**
 * @desc    Delete item from array field
 * @route   DELETE /api/about-us/:section/:field/:itemId
 * @access  Private/Admin
 */
export const deleteArrayItem = asyncHandler(async (req, res) => {
  try {
    const { section, field, itemId } = req.params;

    let aboutUs = await AboutUs.getOrCreate();

    // Check if section and field exist
    if (!aboutUs[section] || !Array.isArray(aboutUs[section][field])) {
      return res.status(400).json({
        success: false,
        message: `Invalid section or field path: ${section}.${field}`
      });
    }

    // Find the item to delete and collect image URLs for cleanup
    const itemToDelete = aboutUs[section][field].id(itemId);
    const imageUrls = [];
    
    if (itemToDelete) {
      // Collect image URLs based on field type
      if (itemToDelete.image) {
        imageUrls.push(itemToDelete.image);
      }
      if (itemToDelete.src) {
        imageUrls.push(itemToDelete.src);
      }
      // For team members
      if (itemToDelete.profilePhotoUrl) {
        imageUrls.push(itemToDelete.profilePhotoUrl);
      }
    }

    // Delete images from Cloudinary (non-blocking)
    if (imageUrls.length > 0) {
      try {
        const { deleteImages } = await import('../../services/uploadService.js');
        await deleteImages(imageUrls);
      } catch (error) {
        console.error('Error deleting images from Cloudinary:', error);
        // Continue with deletion even if image cleanup fails
      }
    }

    // Remove the item
    aboutUs[section][field].pull(itemId);

    // Track who made the update
    if (req.user) {
      aboutUs.lastUpdatedBy = req.user._id;
    }

    await aboutUs.save();

    res.status(200).json({
      success: true,
      message: 'Item deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to delete item',
      error: error.message
    });
  }
});

/**
 * @desc    Toggle publish status
 * @route   PATCH /api/about-us/publish
 * @access  Private/Admin
 */
export const togglePublishStatus = asyncHandler(async (req, res) => {
  try {
    let aboutUs = await AboutUs.getOrCreate();

    aboutUs.isPublished = !aboutUs.isPublished;

    // Track who made the update
    if (req.user) {
      aboutUs.lastUpdatedBy = req.user._id;
    }

    await aboutUs.save();

    res.status(200).json({
      success: true,
      message: `About Us page ${aboutUs.isPublished ? 'published' : 'unpublished'}`,
      data: { isPublished: aboutUs.isPublished }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to toggle publish status',
      error: error.message
    });
  }
});
