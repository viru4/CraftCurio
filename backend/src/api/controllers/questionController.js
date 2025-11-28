import Question from '../../models/Question.js';
import ArtisanProduct from '../../models/ArtisanProduct.js';
import mongoose from 'mongoose';

/**
 * Helper function to check if string is a valid ObjectId
 */
const isValidObjectId = (id) => {
  if (!id || typeof id !== 'string') return false;
  return mongoose.Types.ObjectId.isValid(id) && String(new mongoose.Types.ObjectId(id)) === id;
};

// Helper function to convert string ID to ObjectId if valid
const toObjectId = (id) => {
  return isValidObjectId(id) ? new mongoose.Types.ObjectId(id) : id;
};

// Get public questions for a product
export const getProductQuestions = async (req, res) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' } = req.query;

    if (!isValidObjectId(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID'
      });
    }

    const query = {
      product: productId,
      isPublic: true, // Only show public questions
      status: { $in: ['answered', 'pending'] } // Don't show archived
    };

    const sortConfig = {};
    sortConfig[sortBy] = order === 'desc' ? -1 : 1;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [questions, total] = await Promise.all([
      Question.find(query)
        .populate('user', 'name profileImage')
        .populate('answer.answeredBy', 'name')
        .sort(sortConfig)
        .skip(skip)
        .limit(parseInt(limit)),
      Question.countDocuments(query)
    ]);

    // Get stats efficiently using a single aggregation query
    const productObjectId = toObjectId(productId);
    const statsAggregation = await Question.aggregate([
      { 
        $match: { 
          product: productObjectId,
          isPublic: true 
        } 
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Initialize stats object
    const stats = {
      total: total, // Use the total from the paginated query
      answered: 0,
      pending: 0
    };

    // Populate stats from aggregation results
    statsAggregation.forEach(item => {
      if (item._id === 'answered') stats.answered = item.count;
      else if (item._id === 'pending') stats.pending = item.count;
    });

    res.status(200).json({
      success: true,
      data: {
        questions,
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
    console.error('Get product questions error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching questions',
      error: error.message
    });
  }
};

// Submit a question (authenticated users only)
export const submitQuestion = async (req, res) => {
  try {
    const { productId } = req.params;
    const { question } = req.body;

    if (!isValidObjectId(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID'
      });
    }

    // Validate required fields
    if (!question || !question.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Question is required'
      });
    }

    if (question.length > 500) {
      return res.status(400).json({
        success: false,
        message: 'Question must be 500 characters or less'
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

    // Create question
    const newQuestion = new Question({
      product: productId,
      productType: 'artisan',
      user: req.user._id,
      question: question.trim(),
      status: 'pending',
      isPublic: true
    });

    await newQuestion.save();

    const populatedQuestion = await Question.findById(newQuestion._id)
      .populate('user', 'name profileImage');

    res.status(201).json({
      success: true,
      message: 'Question submitted successfully',
      data: { question: populatedQuestion }
    });
  } catch (error) {
    console.error('Submit question error:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting question',
      error: error.message
    });
  }
};

// Get all questions for artisan's products
export const getArtisanQuestions = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' } = req.query;

    // Find all products belonging to this artisan
    const artisanProducts = await ArtisanProduct.find({ 
      'artisanInfo.id': req.user.id 
    }).select('_id');
    
    const productIds = artisanProducts.map(p => p._id);

    if (productIds.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          questions: [],
          stats: {
            total: 0,
            pending: 0,
            answered: 0,
            archived: 0
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

    if (search) {
      query.$or = [
        { question: { $regex: search, $options: 'i' } },
        { 'answer.comment': { $regex: search, $options: 'i' } }
      ];
    }

    // Sort configuration
    const sortConfig = {};
    sortConfig[sortBy] = order === 'desc' ? -1 : 1;

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [questions, total] = await Promise.all([
      Question.find(query)
        .populate('user', 'name email profileImage')
        .populate('product', 'title images price category')
        .populate('answer.answeredBy', 'name email')
        .sort(sortConfig)
        .skip(skip)
        .limit(parseInt(limit)),
      Question.countDocuments(query)
    ]);

    // Calculate stats efficiently using aggregation instead of fetching all documents
    const objectIdProductIds = productIds.map(id => toObjectId(id));
    const statsAggregation = await Question.aggregate([
      { $match: { product: { $in: objectIdProductIds } } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Initialize stats object
    const stats = {
      total: total, // Use the total from the paginated query
      pending: 0,
      answered: 0,
      archived: 0
    };

    // Populate stats from aggregation results
    statsAggregation.forEach(item => {
      if (item._id === 'pending') stats.pending = item.count;
      else if (item._id === 'answered') stats.answered = item.count;
      else if (item._id === 'archived') stats.archived = item.count;
    });

    res.status(200).json({
      success: true,
      data: {
        questions,
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
    console.error('Get artisan questions error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching questions',
      error: error.message 
    });
  }
};

// Answer a question
export const answerQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
    const { answer } = req.body;

    if (!answer || answer.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Answer is required'
      });
    }

    if (answer.length > 1000) {
      return res.status(400).json({
        success: false,
        message: 'Answer must not exceed 1000 characters'
      });
    }

    const question = await Question.findById(questionId).populate('product');
    
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    // Check if the product belongs to this artisan
    const product = await ArtisanProduct.findById(question.product._id);
    if (!product || product.artisanInfo.id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to answer this question'
      });
    }

    // Update question with answer
    question.answer = {
      comment: answer.trim(),
      answeredBy: req.user._id,
      answeredAt: new Date()
    };
    question.status = 'answered';

    await question.save();

    const populatedQuestion = await Question.findById(question._id)
      .populate('user', 'name email profileImage')
      .populate('product', 'title images price category')
      .populate('answer.answeredBy', 'name email');

    res.status(200).json({
      success: true,
      message: 'Answer added successfully',
      data: { question: populatedQuestion }
    });
  } catch (error) {
    console.error('Answer question error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error adding answer',
      error: error.message 
    });
  }
};

// Update an answer
export const updateAnswer = async (req, res) => {
  try {
    const { questionId } = req.params;
    const { answer } = req.body;

    if (!answer || answer.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Answer is required'
      });
    }

    if (answer.length > 1000) {
      return res.status(400).json({
        success: false,
        message: 'Answer must not exceed 1000 characters'
      });
    }

    const question = await Question.findById(questionId).populate('product');
    
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    // Check if the product belongs to this artisan
    const product = await ArtisanProduct.findById(question.product._id);
    if (!product || product.artisanInfo.id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this answer'
      });
    }

    // Update answer
    question.answer.comment = answer.trim();
    await question.save();

    const populatedQuestion = await Question.findById(question._id)
      .populate('user', 'name email profileImage')
      .populate('product', 'title images price category')
      .populate('answer.answeredBy', 'name email');

    res.status(200).json({
      success: true,
      message: 'Answer updated successfully',
      data: { question: populatedQuestion }
    });
  } catch (error) {
    console.error('Update answer error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating answer',
      error: error.message 
    });
  }
};

// Delete an answer
export const deleteAnswer = async (req, res) => {
  try {
    const { questionId } = req.params;

    const question = await Question.findById(questionId).populate('product');
    
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    // Check if the product belongs to this artisan
    const product = await ArtisanProduct.findById(question.product._id);
    if (!product || product.artisanInfo.id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this answer'
      });
    }

    // Remove answer and change status back to pending
    question.answer = undefined;
    question.status = 'pending';
    await question.save();

    const populatedQuestion = await Question.findById(question._id)
      .populate('user', 'name email profileImage')
      .populate('product', 'title images price category');

    res.status(200).json({
      success: true,
      message: 'Answer deleted successfully',
      data: { question: populatedQuestion }
    });
  } catch (error) {
    console.error('Delete answer error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting answer',
      error: error.message 
    });
  }
};

// Archive a question
export const archiveQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;

    const question = await Question.findById(questionId).populate('product');
    
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    // Check if the product belongs to this artisan
    const product = await ArtisanProduct.findById(question.product._id);
    if (!product || product.artisanInfo.id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to archive this question'
      });
    }

    question.status = 'archived';
    await question.save();

    const populatedQuestion = await Question.findById(question._id)
      .populate('user', 'name email profileImage')
      .populate('product', 'title images price category')
      .populate('answer.answeredBy', 'name email');

    res.status(200).json({
      success: true,
      message: 'Question archived successfully',
      data: { question: populatedQuestion }
    });
  } catch (error) {
    console.error('Archive question error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error archiving question',
      error: error.message 
    });
  }
};
