import Wishlist from '../../models/Wishlist.js';
import ArtisanProduct from '../../models/ArtisanProduct.js';
import Collectible from '../../models/Collectible.js';
import mongoose from 'mongoose';

/**
 * Get user's wishlist with populated product details
 */
export const getWishlist = async (req, res) => {
  try {
    const userId = req.user._id;

    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      return res.status(200).json({
        success: true,
        data: { items: [] }
      });
    }

    // Populate product details for each item
    const populatedItems = await Promise.all(
      wishlist.items.map(async (item) => {
        let product = null;
        
        if (item.productType === 'artisan-product') {
          product = await ArtisanProduct.findById(item.productId)
            .select('title price image category artisan description');
        } else if (item.productType === 'collectible') {
          product = await Collectible.findById(item.productId)
            .select('title price image category artisan description');
        }

        if (!product) {
          return null; // Product no longer exists
        }

        return {
          id: product._id,
          name: product.title,
          price: product.price,
          image: product.image || (product.images && product.images[0]),
          artisan: product.artisan || product.artisanInfo?.name || 'Artisan',
          category: product.category,
          type: item.productType,
          addedAt: item.addedAt
        };
      })
    );

    // Filter out null items (deleted products)
    const validItems = populatedItems.filter(item => item !== null);

    res.status(200).json({
      success: true,
      data: { items: validItems }
    });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch wishlist',
      error: error.message
    });
  }
};

/**
 * Add item to wishlist
 */
export const addToWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, productType } = req.body;

    if (!productId || !productType) {
      return res.status(400).json({
        success: false,
        message: 'Product ID and type are required'
      });
    }

    // Verify product exists - handle both MongoDB ObjectId and custom string IDs
    let product = null;
    const isValidObjectId = mongoose.Types.ObjectId.isValid(productId);
    
    try {
      if (productType === 'artisan-product') {
        // Try MongoDB _id first if it's a valid ObjectId
        if (isValidObjectId) {
          product = await ArtisanProduct.findById(productId);
        }
        // If not found, try custom 'id' field
        if (!product) {
          product = await ArtisanProduct.findOne({ id: productId });
        }
      } else if (productType === 'collectible') {
        // Try MongoDB _id first if it's a valid ObjectId
        if (isValidObjectId) {
          product = await Collectible.findById(productId);
        }
        // If not found, try custom 'id' field
        if (!product) {
          product = await Collectible.findOne({ id: productId });
        }
      }
    } catch (error) {
      console.error('Error finding product:', error);
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Use MongoDB _id for storage (standardize on MongoDB IDs)
    const standardizedProductId = product._id;

    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      // Create new wishlist
      wishlist = new Wishlist({
        userId,
        items: [{ productId: standardizedProductId, productType, addedAt: new Date() }]
      });
    } else {
      // Check if item already exists (using MongoDB _id)
      const itemExists = wishlist.items.some(
        item => item.productId.toString() === standardizedProductId.toString() && item.productType === productType
      );

      if (itemExists) {
        return res.status(400).json({
          success: false,
          message: 'Item already in wishlist'
        });
      }

      // Add new item
      wishlist.items.push({ productId: standardizedProductId, productType, addedAt: new Date() });
    }

    await wishlist.save();

    res.status(200).json({
      success: true,
      message: 'Item added to wishlist',
      data: { itemCount: wishlist.items.length }
    });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add item to wishlist',
      error: error.message
    });
  }
};

/**
 * Remove item from wishlist
 */
export const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    const wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found'
      });
    }

    // Handle both MongoDB ObjectId and custom string IDs
    // Try to find and convert custom ID to MongoDB _id if needed
    let standardizedProductId = productId;
    const isValidObjectId = mongoose.Types.ObjectId.isValid(productId);
    
    if (!isValidObjectId) {
      // It's a custom ID, need to find the MongoDB _id
      const collectible = await Collectible.findOne({ id: productId });
      const artisanProduct = await ArtisanProduct.findOne({ id: productId });
      const product = collectible || artisanProduct;
      
      if (product) {
        standardizedProductId = product._id.toString();
      }
    }

    // Remove item (comparing MongoDB _id)
    wishlist.items = wishlist.items.filter(
      item => item.productId.toString() !== standardizedProductId.toString()
    );

    await wishlist.save();

    res.status(200).json({
      success: true,
      message: 'Item removed from wishlist',
      data: { itemCount: wishlist.items.length }
    });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove item from wishlist',
      error: error.message
    });
  }
};

/**
 * Clear entire wishlist
 */
export const clearWishlist = async (req, res) => {
  try {
    const userId = req.user._id;

    await Wishlist.findOneAndUpdate(
      { userId },
      { items: [] },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      message: 'Wishlist cleared'
    });
  } catch (error) {
    console.error('Error clearing wishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear wishlist',
      error: error.message
    });
  }
};
