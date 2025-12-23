import mongoose from 'mongoose';
import Collectible from '../../models/Collectible.js';
import Collector from '../../models/Collector.js';
import { updateAuctionStatus, getAuctionStats } from '../../services/auctionService.js';
import { findCollectorByIdentifier } from '../../utils/collectorIdentifier.js';

/**
 * Collectible Controller - Enhanced with auction and direct sale support
 * Manages all collectible listing operations with proper validation and ownership
 */

/**
 * Helper function to check if string is a valid ObjectId
 */
const isValidObjectId = (id) => {
  if (!id || typeof id !== 'string') return false;
  return mongoose.Types.ObjectId.isValid(id) && String(new mongoose.Types.ObjectId(id)) === id;
};

/**
 * Helper function to convert string to positive integer
 */
const toPositiveInt = (value, fallback) => {
  const parsed = parseInt(value, 10);
  if (Number.isFinite(parsed) && parsed > 0) {
    return parsed;
  }
  return fallback;
};

/**
 * Create a new collectible listing (direct sale or auction)
 * POST /api/collectibles
 * @access Private - Authenticated collectors only
 */
export const createCollectible = async (req, res) => {
  try {
    const collectibleData = req.validatedBody || req.body;
    const userId = req.user?._id || req.user?.id;

    // Set owner if not provided
    if (!collectibleData.owner && userId) {
      // Find or create collector profile
      let collector = await Collector.findOne({ userId });

      if (!collector) {
        // Create collector profile if it doesn't exist
        console.log('Creating collector profile for user:', userId);
        const { generateCollectorId } = await import('../../utils/collectorIdentifier.js');
        collector = new Collector({
          userId,
          id: await generateCollectorId(),
          name: req.user?.name || req.user?.username || 'Anonymous Collector',
          email: req.user?.email,
          listedCollectibles: [],
          activeBids: [],
          wonAuctions: []
        });
        await collector.save();
        console.log('Collector profile created:', collector._id);
      }

      collectibleData.owner = collector._id;
    }

    // Validate auction-specific logic
    if (collectibleData.saleType === 'auction') {
      if (!collectibleData.auction) {
        return res.status(400).json({
          error: 'Auction details are required for auction listings'
        });
      }

      // Set initial auction values
      collectibleData.auction.currentBid = collectibleData.price; // Starting bid
      collectibleData.auction.bidHistory = [];
      collectibleData.auction.totalBids = 0;
      collectibleData.auction.uniqueBidders = 0;

      // Validate times
      const startTime = new Date(collectibleData.auction.startTime);
      const endTime = new Date(collectibleData.auction.endTime);
      const now = new Date();

      if (startTime >= endTime) {
        return res.status(400).json({
          error: 'Auction end time must be after start time'
        });
      }

      if (startTime <= now) {
        return res.status(400).json({
          error: 'Auction start time must be in the future'
        });
      }

      // Set initial auction status based on timing
      // If start time is within the next 5 minutes, set to 'live' immediately
      const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000);
      if (startTime <= fiveMinutesFromNow) {
        collectibleData.auction.auctionStatus = 'live';
        collectibleData.status = 'active';
      } else {
        collectibleData.auction.auctionStatus = 'scheduled';
      }
    }

    const collectible = new Collectible(collectibleData);
    await collectible.save();

    // Update auction status if needed
    if (collectibleData.saleType === 'auction') {
      await updateAuctionStatus(collectible._id);
    }

    // Update collector's listed items
    if (collectibleData.owner) {
      await Collector.findByIdAndUpdate(
        collectibleData.owner,
        { $push: { listedCollectibles: collectible._id } }
      );
    }

    res.status(201).json({
      message: 'Collectible created successfully',
      data: collectible
    });
  } catch (error) {
    console.error('Error creating collectible:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Bulk create collectibles (for seeding/admin)
 * POST /api/collectibles/bulk
 * @access Private - Admin only
 */
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
      likes: item.likes || 0,
      saleType: item.saleType || 'direct' // Default to direct sale
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

/**
 * Get all collectibles with advanced filtering
 * GET /api/collectibles
 * @access Public
 */
export const getCollectibles = async (req, res) => {
  try {
    const {
      category,
      featured,
      popular,
      recent,
      search,
      status,
      saleType, // Filter by 'direct' or 'auction'
      promoted,
      minPrice,
      maxPrice
    } = req.query;

    const limit = Math.min(toPositiveInt(req.query.limit, 20), 100);
    const page = toPositiveInt(req.query.page, 1);

    const query = {};

    // Add filters
    if (category) {
      // Check if category is an ObjectId or string name
      if (isValidObjectId(category)) {
        query.category = category;
      } else {
        query.category = { $regex: category, $options: 'i' };
      }
    }

    if (status) query.status = status;
    if (saleType) query.saleType = saleType;
    if (promoted === 'true') query.promoted = true;
    if (featured === 'true') query.featured = true;
    if (popular === 'true') query.popular = true;
    if (recent === 'true') query.recent = true;

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    if (search) {
      query.$text = { $search: search };
    }

    const skip = (page - 1) * limit;

    const collectibles = await Collectible.find(query)
      .sort(search ? { score: { $meta: 'textScore' } } : { promoted: -1, createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .populate('owner', 'name profilePhotoUrl location')
      .lean();

    // Update auction statuses for auction items
    const updatedCollectibles = await Promise.all(
      collectibles.map(async (item) => {
        if (item.saleType === 'auction') {
          await updateAuctionStatus(item._id);
          const updated = await Collectible.findById(item._id).lean();
          return { ...updated, stats: getAuctionStats(updated) };
        }
        return item;
      })
    );

    const total = await Collectible.countDocuments(query);
    const totalPages = Math.ceil(total / limit) || 1;

    res.status(200).json({
      message: 'Collectibles retrieved successfully',
      count: updatedCollectibles.length,
      total,
      page,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      data: updatedCollectibles
    });
  } catch (error) {
    console.error('Error fetching collectibles:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get a single collectible by ID
 * GET /api/collectibles/:id
 * @access Public
 */
export const getCollectibleById = async (req, res) => {
  try {
    const { id } = req.params;

    let collectible = null;

    // Check if ID is a valid MongoDB ObjectId format
    const isObjectId = isValidObjectId(id);

    if (isObjectId) {
      // Try MongoDB _id first if it's a valid ObjectId format
      collectible = await Collectible.findById(id)
        .populate('owner', 'name profilePhotoUrl location email userId')
        .lean();
    }

    // If not found by _id or not a valid ObjectId, try custom 'id' field
    if (!collectible) {
      collectible = await Collectible.findOne({ id })
        .populate('owner', 'name profilePhotoUrl location email userId')
        .lean();
    }

    if (!collectible) {
      return res.status(404).json({ error: 'Collectible not found' });
    }

    // Update auction status if needed (need to convert back to document for save)
    if (collectible.saleType === 'auction') {
      const collectibleDoc = await Collectible.findById(collectible._id);
      if (collectibleDoc) {
        await updateAuctionStatus(collectibleDoc._id);
        // Refetch with updated status
        collectible = await Collectible.findById(collectibleDoc._id)
          .populate('owner', 'name profilePhotoUrl location email userId')
          .lean();
      }
    }

    // Increment views (use updateOne for better performance)
    await Collectible.updateOne(
      { _id: collectible._id },
      { $inc: { views: 1 } }
    );
    collectible.views = (collectible.views || 0) + 1;

    // Add auction stats if applicable
    const response = collectible;
    if (collectible.saleType === 'auction') {
      response.stats = getAuctionStats(collectible);
    }

    res.status(200).json({
      message: 'Collectible retrieved successfully',
      data: response
    });
  } catch (error) {
    console.error('Error fetching collectible:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Update a collectible listing
 * PUT /api/collectibles/:id
 * @access Private - Owner or Admin only
 */
export const updateCollectible = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.validatedBody || req.body;
    const userId = req.user?._id || req.user?.id;

    // Log incoming update request for debugging
    console.log('=== UPDATE COLLECTIBLE REQUEST ===');
    console.log('Collectible ID:', id);
    console.log('User ID:', userId);
    console.log('Raw Update Data:', JSON.stringify(updateData, null, 2));

    // Find collectible first to check ownership and current state
    let collectible = await Collectible.findById(id);
    if (!collectible) {
      collectible = await Collectible.findOne({ id });
    }

    if (!collectible) {
      return res.status(404).json({ error: 'Collectible not found' });
    }

    console.log('Current collectible saleType:', collectible.saleType);

    // Check ownership - need to find collector by userId
    if (collectible.owner && req.user?.role !== 'admin') {
      const collector = await Collector.findOne({ userId });
      
      if (!collector || collector._id.toString() !== collectible.owner.toString()) {
        return res.status(403).json({
          error: 'Access denied',
          message: 'You do not have permission to update this listing'
        });
      }
    }

    // Prevent certain updates for active auctions with bids
    if (collectible.saleType === 'auction' &&
      collectible.auction?.bidHistory?.length > 0 &&
      collectible.auction.auctionStatus === 'live') {

      const restrictedFields = ['price', 'auction.startTime', 'auction.endTime', 'auction.reservePrice'];
      const attemptedChanges = restrictedFields.filter(field => {
        if (field.includes('.')) {
          const [parent, child] = field.split('.');
          return updateData[parent]?.[child] !== undefined;
        }
        return updateData[field] !== undefined;
      });

      if (attemptedChanges.length > 0) {
        return res.status(400).json({
          error: 'Cannot modify key auction parameters after bids have been placed',
          restrictedFields: attemptedChanges
        });
      }
    }

    // Whitelist of allowed fields for update
    const allowedFields = [
      'title',
      'description',
      'price',
      'category',
      'image',
      'images',
      'featured',
      'popular',
      'recent',
      'targetSection',
      'buttonText',
      'history',
      'provenance',
      'productStory',
      'specifications',
      'manufacturer',
      'serialNumber',
      'editionNumber',
      'saleType',
      'auction',
      'promoted',
      'promotionEndDate',
      'shippingInfo',
      'availability',
      'authenticityCertificateUrl',
      'status',
      'tags'
    ];

    // Build sanitized update object from whitelist
    const update = {};
    
    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        update[field] = updateData[field];
      }
    });

    // Special handling: Remove auction field if saleType is 'direct'
    const targetSaleType = update.saleType || collectible.saleType;
    if (targetSaleType === 'direct') {
      delete update.auction;
      console.log('Removed auction field for direct sale');
    }

    // Type conversion for numeric fields
    if (update.price !== undefined) {
      update.price = Number(update.price);
      if (isNaN(update.price) || update.price < 0) {
        return res.status(400).json({ error: 'Invalid price value' });
      }
    }

    // Convert auction numeric fields if present
    if (update.auction) {
      if (update.auction.reservePrice !== undefined) {
        update.auction.reservePrice = Number(update.auction.reservePrice);
        if (isNaN(update.auction.reservePrice)) {
          return res.status(400).json({ error: 'Invalid reservePrice value' });
        }
      }
      if (update.auction.buyNowPrice !== undefined) {
        update.auction.buyNowPrice = Number(update.auction.buyNowPrice);
        if (isNaN(update.auction.buyNowPrice)) {
          return res.status(400).json({ error: 'Invalid buyNowPrice value' });
        }
      }
      if (update.auction.minimumBidIncrement !== undefined) {
        update.auction.minimumBidIncrement = Number(update.auction.minimumBidIncrement);
        if (isNaN(update.auction.minimumBidIncrement)) {
          return res.status(400).json({ error: 'Invalid minimumBidIncrement value' });
        }
      }
      if (update.auction.currentBid !== undefined) {
        update.auction.currentBid = Number(update.auction.currentBid);
      }
      if (update.auction.winningBid !== undefined) {
        update.auction.winningBid = Number(update.auction.winningBid);
      }
    }

    // Convert shipping numeric fields if present
    if (update.shippingInfo) {
      if (update.shippingInfo.weight !== undefined) {
        update.shippingInfo.weight = Number(update.shippingInfo.weight);
        if (isNaN(update.shippingInfo.weight)) {
          return res.status(400).json({ error: 'Invalid weight value' });
        }
      }
      if (update.shippingInfo.freeShippingThreshold !== undefined) {
        update.shippingInfo.freeShippingThreshold = Number(update.shippingInfo.freeShippingThreshold);
      }
      if (update.shippingInfo.dimensions) {
        if (update.shippingInfo.dimensions.height !== undefined) {
          update.shippingInfo.dimensions.height = Number(update.shippingInfo.dimensions.height);
        }
        if (update.shippingInfo.dimensions.width !== undefined) {
          update.shippingInfo.dimensions.width = Number(update.shippingInfo.dimensions.width);
        }
        if (update.shippingInfo.dimensions.depth !== undefined) {
          update.shippingInfo.dimensions.depth = Number(update.shippingInfo.dimensions.depth);
        }
      }
    }

    // Convert specifications numeric fields if present
    if (update.specifications) {
      if (update.specifications.weight !== undefined) {
        update.specifications.weight = Number(update.specifications.weight);
      }
      if (update.specifications.dimensions) {
        if (update.specifications.dimensions.height !== undefined) {
          update.specifications.dimensions.height = Number(update.specifications.dimensions.height);
        }
        if (update.specifications.dimensions.width !== undefined) {
          update.specifications.dimensions.width = Number(update.specifications.dimensions.width);
        }
        if (update.specifications.dimensions.depth !== undefined) {
          update.specifications.dimensions.depth = Number(update.specifications.dimensions.depth);
        }
      }
    }

    console.log('Sanitized Update Object:', JSON.stringify(update, null, 2));

    // Use findByIdAndUpdate with runValidators
    const updatedCollectible = await Collectible.findByIdAndUpdate(
      collectible._id,
      update,
      { 
        new: true, 
        runValidators: true,
        context: 'query' // Needed for validation to work properly with findByIdAndUpdate
      }
    );

    if (!updatedCollectible) {
      return res.status(404).json({ error: 'Collectible not found after update' });
    }

    console.log('=== UPDATE SUCCESSFUL ===');

    res.status(200).json({
      message: 'Collectible updated successfully',
      data: updatedCollectible
    });
  } catch (error) {
    console.error('=== UPDATE ERROR ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      console.error('Validation errors:', error.errors);
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: Object.keys(error.errors).map(key => ({
          field: key,
          message: error.errors[key].message,
          value: error.errors[key].value
        }))
      });
    }
    
    // Handle Mongoose cast errors (e.g., invalid ObjectId)
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        error: 'Invalid data format',
        field: error.path,
        message: error.message
      });
    }
    
    // Generic server error
    res.status(500).json({ 
      error: error.message || 'Internal server error',
      type: error.name,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

/**
 * Delete a collectible listing
 * DELETE /api/collectibles/:id
 * @access Private - Owner or Admin only
 */
export const deleteCollectible = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id || req.user?.id;

    // Find collectible
    let collectible = await Collectible.findById(id);
    if (!collectible) {
      collectible = await Collectible.findOne({ id });
    }

    if (!collectible) {
      return res.status(404).json({ error: 'Collectible not found' });
    }

    // Check ownership - need to find collector by userId
    if (collectible.owner && req.user?.role !== 'admin') {
      const collector = await Collector.findOne({ userId });
      
      if (!collector || collector._id.toString() !== collectible.owner.toString()) {
        return res.status(403).json({
          error: 'Access denied',
          message: 'You do not have permission to delete this listing'
        });
      }
    }

    // Prevent deletion of active auctions with bids
    if (collectible.saleType === 'auction' &&
      collectible.auction.bidHistory.length > 0 &&
      collectible.auction.auctionStatus === 'live') {
      return res.status(400).json({
        error: 'Cannot delete active auction with existing bids. Cancel the auction first.'
      });
    }

    // Collect all image URLs to delete from Cloudinary
    const imageUrls = [];
    if (collectible.image) {
      imageUrls.push(collectible.image);
    }
    if (collectible.images && Array.isArray(collectible.images)) {
      imageUrls.push(...collectible.images);
    }
    if (collectible.productStory?.storyMediaUrls && Array.isArray(collectible.productStory.storyMediaUrls)) {
      imageUrls.push(...collectible.productStory.storyMediaUrls);
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

    // Remove from collector's listings
    if (collectible.owner) {
      await Collector.findByIdAndUpdate(
        collectible.owner,
        { $pull: { listedCollectibles: collectible._id } }
      );
    }

    await Collectible.findByIdAndDelete(collectible._id);

    res.status(200).json({
      message: 'Collectible deleted successfully',
      data: collectible
    });
  } catch (error) {
    console.error('Error deleting collectible:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Like/Unlike a collectible
 * PUT /api/collectibles/:id/like
 * @access Public
 */
export const likeCollectible = async (req, res) => {
  try {
    const { id } = req.params;
    let collectible = null;

    // Check if ID is a valid MongoDB ObjectId format
    const isObjectId = isValidObjectId(id);

    if (isObjectId) {
      collectible = await Collectible.findById(id).lean();
    }

    // If not found by _id or not a valid ObjectId, try custom 'id' field
    if (!collectible) {
      collectible = await Collectible.findOne({ id });
    }

    if (!collectible) {
      return res.status(404).json({ error: 'Collectible not found' });
    }

    collectible.likes += 1;
    await collectible.save();

    res.status(200).json({
      message: 'Collectible liked successfully',
      data: { likes: collectible.likes }
    });
  } catch (error) {
    console.error('Error liking collectible:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get collectibles by collector
 * GET /api/collector/:id/listings
 * @access Public
 */
export const getCollectorListings = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, saleType, page = 1, limit = 20 } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = Math.min(parseInt(limit, 10), 100);
    const skip = (pageNum - 1) * limitNum;

    // Find collector by MongoDB _id, userId or custom id
    const collector = await findCollectorByIdentifier(id, { lean: true });

    if (!collector) {
      return res.status(404).json({ error: 'Collector not found' });
    }

    // Build query - owner should be the collector ID
    const query = { owner: collector._id };
    if (status) query.status = status;
    if (saleType) query.saleType = saleType;

    const collectibles = await Collectible.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    const total = await Collectible.countDocuments(query);

    res.status(200).json({
      message: 'Collector listings retrieved successfully',
      data: collectibles,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Error fetching collector listings:', error);
    res.status(500).json({ error: error.message });
  }
};

export default {
  createCollectible,
  createCollectibles,
  getCollectibles,
  getCollectibleById,
  updateCollectible,
  deleteCollectible,
  likeCollectible,
  getCollectorListings
};
