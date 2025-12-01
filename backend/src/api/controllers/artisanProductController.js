import { randomUUID } from 'crypto';
import mongoose from 'mongoose';
import ArtisanProduct from '../../models/ArtisanProduct.js';

/**
 * Helper function to check if string is a valid ObjectId
 */
const isValidObjectId = (id) => {
  if (!id || typeof id !== 'string') return false;
  return mongoose.Types.ObjectId.isValid(id) && String(new mongoose.Types.ObjectId(id)) === id;
};

const toPositiveInt = (value, fallback) => {
  const parsed = parseInt(value, 10);
  if (Number.isFinite(parsed) && parsed > 0) {
    return parsed;
  }
  return fallback;
};

// GET /api/artisan-products - Get all artisan products
export const getArtisanProducts = async (req, res) => {
  try {
    const {
      category,
      featured,
      popular,
      recent,
      search,
      status,
      artisan,
      limit = 50,
      page = 1,
      sort = 'createdAt',
      order = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};

    // Filter by artisan if provided
    if (artisan) {
      filter['artisanInfo.id'] = artisan;
    }

    if (category) {
      // Check if category is an ObjectId or string name
      if (isValidObjectId(category)) {
        filter.category = category;
      } else {
        filter.category = { $regex: category, $options: 'i' };
      }
    }

    if (status) {
      filter.status = status;
    }

    if (featured === 'true') {
      filter.featured = true;
    }

    if (popular === 'true') {
      filter.popular = true;
    }

    if (recent === 'true') {
      filter.recent = true;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Calculate pagination
    const pageNum = toPositiveInt(page, 1);
    const limitNum = Math.min(toPositiveInt(limit, 50), 100);
    const skip = (pageNum - 1) * limitNum;

    // Build sort object
    const sortObj = {};
    sortObj[sort] = order === 'desc' ? -1 : 1;

    // Execute query with pagination
    const [artisanProducts, totalCount] = await Promise.all([
      ArtisanProduct.find(filter)
        .sort(sortObj)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      ArtisanProduct.countDocuments(filter)
    ]);

    // Map `images` array to a top-level `image` field so frontend components
    // that expect `item.image` (singular) work with our DB documents which
    // store multiple images in `images: []`.
    const transformed = artisanProducts.map(p => ({
      ...p,
      image: (p.images && p.images.length) ? p.images[0] : (p.image || null)
    }));

    res.status(200).json({
      message: 'Artisan products retrieved successfully',
      count: transformed.length,
      totalCount,
      currentPage: pageNum,
      totalPages: Math.ceil(totalCount / limitNum),
      hasNextPage: pageNum < Math.ceil(totalCount / limitNum),
      hasPrevPage: pageNum > 1,
      data: transformed
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/artisan-products/featured - Get featured items
export const getFeaturedArtisanProducts = async (req, res) => {
  try {
    const artisanProducts = await ArtisanProduct.find({ featured: true })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    const transformed = artisanProducts.map(p => ({
      ...p,
      image: (p.images && p.images.length) ? p.images[0] : (p.image || null)
    }));

    res.status(200).json({
      message: 'Featured artisan products retrieved successfully',
      count: transformed.length,
      data: transformed
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/artisan-products/popular - Get popular items
export const getPopularArtisanProducts = async (req, res) => {
  try {
    const artisanProducts = await ArtisanProduct.find({ popular: true })
      .sort({ views: -1, createdAt: -1 })
      .limit(10)
      .lean();

    const transformed = artisanProducts.map(p => ({
      ...p,
      image: (p.images && p.images.length) ? p.images[0] : (p.image || null)
    }));

    res.status(200).json({
      message: 'Popular artisan products retrieved successfully',
      count: transformed.length,
      data: transformed
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/artisan-products/recent - Get recent items
export const getRecentArtisanProducts = async (req, res) => {
  try {
    const artisanProducts = await ArtisanProduct.find({ recent: true })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    const transformed = artisanProducts.map(p => ({
      ...p,
      image: (p.images && p.images.length) ? p.images[0] : (p.image || null)
    }));

    res.status(200).json({
      message: 'Recent artisan products retrieved successfully',
      count: transformed.length,
      data: transformed
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/artisan-products/:id - Get single artisan product
export const getArtisanProductById = async (req, res) => {
  try {
    const { id } = req.params;
    let artisanProduct = null;

    // Check if ID is a valid MongoDB ObjectId format
    const isObjectId = isValidObjectId(id);

    if (isObjectId) {
      // Try MongoDB _id first if it's a valid ObjectId format
      artisanProduct = await ArtisanProduct.findById(id);

      if (artisanProduct) {
        await artisanProduct.populate([
          { path: 'reviews.user', select: 'name email' }
        ]);
      }
    }

    // If not found by _id or not a valid ObjectId, try custom 'id' field
    if (!artisanProduct) {
      artisanProduct = await ArtisanProduct.findOne({ id })
        .populate('reviews.user', 'name email');
    }

    if (!artisanProduct) {
      return res.status(404).json({ error: 'Artisan product not found' });
    }

    // Increment view count atomically to prevent race conditions
    await ArtisanProduct.updateOne(
      { _id: artisanProduct._id },
      { $inc: { views: 1 } }
    );

    // Convert to plain object and add top-level `image` for frontend
    const productObj = artisanProduct.toObject ? artisanProduct.toObject() : artisanProduct;
    productObj.image = (productObj.images && productObj.images.length) ? productObj.images[0] : (productObj.image || null);

    // Ensure productStory and artisanInfo are properly included
    if (productObj.productStory) {
      productObj.productStory = {
        storyText: productObj.productStory.storyText || '',
        storyMediaUrls: productObj.productStory.storyMediaUrls || []
      };
    }

    if (productObj.artisanInfo) {
      // Manually fetch artisan to get userId since population doesn't work on string IDs
      let artisanUserId = null;
      if (productObj.artisanInfo.id) {
        try {
          const { default: Artisan } = await import('../../models/Artisan.js');
          let artisanDoc = await Artisan.findOne({ id: productObj.artisanInfo.id }).select('userId');

          // If not found by custom id, try by _id if it looks like an ObjectId
          if (!artisanDoc && isValidObjectId(productObj.artisanInfo.id)) {
            artisanDoc = await Artisan.findById(productObj.artisanInfo.id).select('userId');
          }

          if (artisanDoc) {
            artisanUserId = artisanDoc.userId;
          }
        } catch (err) {
          console.error('Error fetching artisan details:', err);
        }
      }

      productObj.artisanInfo = {
        id: productObj.artisanInfo.id || null,
        name: productObj.artisanInfo.name || '',
        profilePhotoUrl: productObj.artisanInfo.profilePhotoUrl || '',
        briefBio: productObj.artisanInfo.briefBio || '',
        verified: productObj.artisanInfo.verified || false,
        userId: artisanUserId
      };
    }

    res.status(200).json({ data: productObj });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/artisan-products - Create new artisan product
export const createArtisanProduct = async (req, res) => {
  try {
    const artisanProductData = { ...req.body };

    if (!artisanProductData.title || !artisanProductData.description || !artisanProductData.category) {
      return res.status(400).json({ error: 'Title, description, and category are required.' });
    }

    if (Array.isArray(artisanProductData.images) === false || artisanProductData.images.length === 0) {
      return res.status(400).json({ error: 'At least one image is required.' });
    }

    if (typeof artisanProductData.price === 'string') {
      const parsedPrice = Number(artisanProductData.price);
      if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
        return res.status(400).json({ error: 'Price must be a non-negative number.' });
      }
      artisanProductData.price = parsedPrice;
    }

    if (typeof artisanProductData.price !== 'number' || !Number.isFinite(artisanProductData.price)) {
      return res.status(400).json({ error: 'Price must be a valid number.' });
    }

    artisanProductData.id = artisanProductData.id
      ? String(artisanProductData.id).trim()
      : `art-${randomUUID()}`;

    const artisanProduct = new ArtisanProduct(artisanProductData);
    const savedArtisanProduct = await artisanProduct.save();

    res.status(201).json({
      message: 'Artisan product created successfully',
      data: savedArtisanProduct
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// PUT /api/artisan-products/:id/like - Like an artisan product
export const likeArtisanProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const artisanProduct = await ArtisanProduct.findOne({ id }) || await ArtisanProduct.findById(id);
    if (!artisanProduct) {
      return res.status(404).json({ error: 'Artisan product not found' });
    }

    // Increment likes atomically to prevent race conditions
    await ArtisanProduct.updateOne(
      { _id: artisanProduct._id },
      { $inc: { likes: 1 } }
    );

    // Fetch updated product
    const updatedProduct = await ArtisanProduct.findById(artisanProduct._id);

    res.status(200).json({
      message: 'Artisan product liked successfully',
      data: updatedProduct
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PATCH /api/artisan-products/:id - Update artisan product
export const updateArtisanProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Find product by MongoDB _id or custom id field
    let artisanProduct = await ArtisanProduct.findById(id);
    if (!artisanProduct) {
      artisanProduct = await ArtisanProduct.findOne({ id });
    }

    if (!artisanProduct) {
      return res.status(404).json({ error: 'Artisan product not found' });
    }

    // Update fields
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        artisanProduct[key] = updateData[key];
      }
    });

    const updatedProduct = await artisanProduct.save();

    res.status(200).json({
      message: 'Artisan product updated successfully',
      data: updatedProduct
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE /api/artisan-products/:id - Delete artisan product
export const deleteArtisanProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Find product by MongoDB _id or custom id field
    let artisanProduct = await ArtisanProduct.findById(id);
    if (!artisanProduct) {
      artisanProduct = await ArtisanProduct.findOne({ id });
    }

    if (!artisanProduct) {
      return res.status(404).json({ error: 'Artisan product not found' });
    }

    // Collect all image URLs to delete from Cloudinary
    const imageUrls = [];
    if (artisanProduct.images && Array.isArray(artisanProduct.images)) {
      imageUrls.push(...artisanProduct.images);
    }
    if (artisanProduct.productStory?.storyMediaUrls && Array.isArray(artisanProduct.productStory.storyMediaUrls)) {
      imageUrls.push(...artisanProduct.productStory.storyMediaUrls);
    }
    if (artisanProduct.artisanInfo?.profilePhotoUrl) {
      imageUrls.push(artisanProduct.artisanInfo.profilePhotoUrl);
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

    // Delete product from database
    await ArtisanProduct.findByIdAndDelete(artisanProduct._id);

    res.status(200).json({
      message: 'Artisan product deleted successfully',
      data: artisanProduct
    });
  } catch (error) {
    console.error('Error deleting artisan product:', error);
    res.status(500).json({ error: error.message });
  }
};
