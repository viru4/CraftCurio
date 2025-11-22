import Review from '../../models/Review.js';
import ArtisanProduct from '../../models/ArtisanProduct.js';
import mongoose from 'mongoose';

// Get public reviews for a product
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' } = req.query;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID'
      });
    }

    const query = { 
      product: productId,
      status: 'approved' // Only show approved reviews
    };

    const sortConfig = {};
    sortConfig[sortBy] = order === 'desc' ? -1 : 1;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [reviews, total] = await Promise.all([
      Review.find(query)
        .populate('user', 'name profileImage')
        .sort(sortConfig)
        .skip(skip)
        .limit(parseInt(limit)),
      Review.countDocuments(query)
    ]);

    // Calculate rating distribution
    const allReviews = await Review.find({ product: productId, status: 'approved' });
    const ratingDistribution = {
      5: allReviews.filter(r => r.rating === 5).length,
      4: allReviews.filter(r => r.rating === 4).length,
      3: allReviews.filter(r => r.rating === 3).length,
      2: allReviews.filter(r => r.rating === 2).length,
      1: allReviews.filter(r => r.rating === 1).length
    };

    const averageRating = allReviews.length > 0
      ? (allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length).toFixed(1)
      : 0;

    res.status(200).json({
      success: true,
      data: {
        reviews,
        stats: {
          total: allReviews.length,
          averageRating: parseFloat(averageRating),
          distribution: ratingDistribution
        },
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get product reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reviews',
      error: error.message
    });
  }
};

// Submit a review (authenticated users only)
export const submitReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, title, comment, images } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID'
      });
    }

    // Validate required fields
    if (!rating || !title || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Rating, title, and comment are required'
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    // Check if product exists
    const product = await ArtisanProduct.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      product: productId,
      user: req.user._id
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product'
      });
    }

    // Create review
    const review = new Review({
      product: productId,
      productType: 'artisan',
      user: req.user._id,
      rating,
      title: title.trim(),
      comment: comment.trim(),
      images: images || [],
      status: 'approved' // Auto-approve for now, can add moderation later
    });

    await review.save();

    // Update product rating
    const allReviews = await Review.find({ product: productId, status: 'approved' });
    const avgRating = allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;
    
    await ArtisanProduct.findByIdAndUpdate(productId, {
      'rating.average': avgRating,
      'rating.count': allReviews.length
    });

    const populatedReview = await Review.findById(review._id)
      .populate('user', 'name profileImage');

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: { review: populatedReview }
    });
  } catch (error) {
    console.error('Submit review error:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting review',
      error: error.message
    });
  }
};

// Get all reviews for artisan's products
export const getArtisanReviews = async (req, res) => {
  try {
    const { status, search, rating, hasReply, page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' } = req.query;

    // Find all products belonging to this artisan
    const artisanProducts = await ArtisanProduct.find({ 
      'artisanInfo.id': req.user.id 
    }).select('_id');
    
    const productIds = artisanProducts.map(p => p._id);

    if (productIds.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          reviews: [],
          stats: {
            total: 0,
            pending: 0,
            replied: 0,
            averageRating: 0,
            byRating: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
          },
          pagination: {
            total: 0,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: 0
          }
        }
      });
    }

    // Build query
    const query = { product: { $in: productIds } };

    if (status && status !== 'all') {
      query.status = status;
    }

    if (rating) {
      query.rating = parseInt(rating);
    }

    if (hasReply === 'true') {
      query['artisanReply.comment'] = { $exists: true, $ne: null };
    } else if (hasReply === 'false') {
      query.$or = [
        { 'artisanReply.comment': { $exists: false } },
        { 'artisanReply.comment': null }
      ];
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { comment: { $regex: search, $options: 'i' } }
      ];
    }

    // Sort configuration
    const sortConfig = {};
    sortConfig[sortBy] = order === 'desc' ? -1 : 1;

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [reviews, total] = await Promise.all([
      Review.find(query)
        .populate('user', 'name email profileImage')
        .populate('product', 'title images price category')
        .sort(sortConfig)
        .skip(skip)
        .limit(parseInt(limit)),
      Review.countDocuments(query)
    ]);

    // Calculate stats
    const allReviews = await Review.find({ product: { $in: productIds } });
    const stats = {
      total: allReviews.length,
      pending: allReviews.filter(r => !r.artisanReply || !r.artisanReply.comment).length,
      replied: allReviews.filter(r => r.artisanReply && r.artisanReply.comment).length,
      averageRating: allReviews.length > 0 
        ? (allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length).toFixed(1)
        : 0,
      byRating: {
        5: allReviews.filter(r => r.rating === 5).length,
        4: allReviews.filter(r => r.rating === 4).length,
        3: allReviews.filter(r => r.rating === 3).length,
        2: allReviews.filter(r => r.rating === 2).length,
        1: allReviews.filter(r => r.rating === 1).length
      }
    };

    res.status(200).json({
      success: true,
      data: {
        reviews,
        stats,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get artisan reviews error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching reviews',
      error: error.message 
    });
  }
};

// Reply to a review
export const replyToReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { comment } = req.body;

    if (!comment || comment.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Reply comment is required'
      });
    }

    if (comment.length > 500) {
      return res.status(400).json({
        success: false,
        message: 'Reply comment must not exceed 500 characters'
      });
    }

    const review = await Review.findById(reviewId).populate('product');
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if the product belongs to this artisan
    const product = await ArtisanProduct.findById(review.product._id);
    if (!product || product.artisanInfo.id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to reply to this review'
      });
    }

    // Update review with reply
    review.artisanReply = {
      comment: comment.trim(),
      repliedAt: new Date()
    };

    await review.save();

    const populatedReview = await Review.findById(review._id)
      .populate('user', 'name email profileImage')
      .populate('product', 'title images price category');

    res.status(200).json({
      success: true,
      message: 'Reply added successfully',
      data: { review: populatedReview }
    });
  } catch (error) {
    console.error('Reply to review error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error adding reply',
      error: error.message 
    });
  }
};

// Update a reply
export const updateReply = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { comment } = req.body;

    if (!comment || comment.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Reply comment is required'
      });
    }

    if (comment.length > 500) {
      return res.status(400).json({
        success: false,
        message: 'Reply comment must not exceed 500 characters'
      });
    }

    const review = await Review.findById(reviewId).populate('product');
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if the product belongs to this artisan
    const product = await ArtisanProduct.findById(review.product._id);
    if (!product || product.artisanInfo.id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this reply'
      });
    }

    // Update reply
    review.artisanReply.comment = comment.trim();
    await review.save();

    const populatedReview = await Review.findById(review._id)
      .populate('user', 'name email profileImage')
      .populate('product', 'title images price category');

    res.status(200).json({
      success: true,
      message: 'Reply updated successfully',
      data: { review: populatedReview }
    });
  } catch (error) {
    console.error('Update reply error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating reply',
      error: error.message 
    });
  }
};

// Delete a reply
export const deleteReply = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId).populate('product');
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if the product belongs to this artisan
    const product = await ArtisanProduct.findById(review.product._id);
    if (!product || product.artisanInfo.id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this reply'
      });
    }

    // Remove reply
    review.artisanReply = undefined;
    await review.save();

    const populatedReview = await Review.findById(review._id)
      .populate('user', 'name email profileImage')
      .populate('product', 'title images price category');

    res.status(200).json({
      success: true,
      message: 'Reply deleted successfully',
      data: { review: populatedReview }
    });
  } catch (error) {
    console.error('Delete reply error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting reply',
      error: error.message 
    });
  }
};
