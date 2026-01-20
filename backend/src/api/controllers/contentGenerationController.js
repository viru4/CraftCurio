import contentGenerationService from '../../services/contentGenerationService.js';

/**
 * Generate product description
 * POST /api/content/generate-description
 */
export const generateDescription = async (req, res) => {
  try {
    const { name, category, materials, isAuction, images } = req.body;

    if (!name || !category) {
      return res.status(400).json({
        success: false,
        error: 'Product name and category are required'
      });
    }

    const description = await contentGenerationService.generateProductDescription({
      name,
      category,
      materials,
      isAuction,
      images
    });

    res.status(200).json({
      success: true,
      data: {
        description,
        wordCount: description.split(' ').length
      }
    });
  } catch (error) {
    console.error('Generate Description Error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate description'
    });
  }
};

/**
 * Generate product title variations
 * POST /api/content/generate-titles
 */
export const generateTitles = async (req, res) => {
  try {
    const { category, materials, style, keywords } = req.body;

    if (!category) {
      return res.status(400).json({
        success: false,
        error: 'Category is required'
      });
    }

    const titles = await contentGenerationService.generateProductTitles({
      category,
      materials,
      style,
      keywords
    });

    res.status(200).json({
      success: true,
      data: {
        titles,
        count: titles.length
      }
    });
  } catch (error) {
    console.error('Generate Titles Error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate titles'
    });
  }
};

/**
 * Generate auction announcement
 * POST /api/content/generate-auction-announcement
 */
export const generateAuctionAnnouncement = async (req, res) => {
  try {
    const { productName, category, startingBid, endTime, highlights } = req.body;

    if (!productName || !category || !startingBid) {
      return res.status(400).json({
        success: false,
        error: 'Product name, category, and starting bid are required'
      });
    }

    const announcement = await contentGenerationService.generateAuctionAnnouncement({
      productName,
      category,
      startingBid,
      endTime,
      highlights
    });

    res.status(200).json({
      success: true,
      data: {
        announcement,
        wordCount: announcement.split(' ').length
      }
    });
  } catch (error) {
    console.error('Generate Auction Announcement Error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate announcement'
    });
  }
};

/**
 * Generate category description
 * POST /api/content/generate-category-description
 */
export const generateCategoryDescription = async (req, res) => {
  try {
    const { name, itemCount, topArtisans } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'Category name is required'
      });
    }

    const description = await contentGenerationService.generateCategoryDescription({
      name,
      itemCount,
      topArtisans
    });

    res.status(200).json({
      success: true,
      data: {
        description,
        wordCount: description.split(' ').length
      }
    });
  } catch (error) {
    console.error('Generate Category Description Error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate category description'
    });
  }
};

/**
 * Generate social media post
 * POST /api/content/generate-social-post
 */
export const generateSocialPost = async (req, res) => {
  try {
    const { name, category, price, imageUrl, isAuction } = req.body;

    if (!name || !category) {
      return res.status(400).json({
        success: false,
        error: 'Product name and category are required'
      });
    }

    const post = await contentGenerationService.generateSocialMediaPost({
      name,
      category,
      price,
      imageUrl,
      isAuction
    });

    res.status(200).json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error('Generate Social Post Error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate social post'
    });
  }
};

/**
 * Enhance existing description
 * POST /api/content/enhance-description
 */
export const enhanceDescription = async (req, res) => {
  try {
    const { description, improvementType } = req.body;

    if (!description) {
      return res.status(400).json({
        success: false,
        error: 'Description is required'
      });
    }

    const enhanced = await contentGenerationService.enhanceDescription(
      description,
      improvementType
    );

    res.status(200).json({
      success: true,
      data: {
        original: description,
        enhanced,
        wordCount: enhanced.split(' ').length
      }
    });
  } catch (error) {
    console.error('Enhance Description Error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to enhance description'
    });
  }
};

/**
 * Generate keywords/tags
 * POST /api/content/generate-keywords
 */
export const generateKeywords = async (req, res) => {
  try {
    const { name, category, description, materials } = req.body;

    if (!name || !category) {
      return res.status(400).json({
        success: false,
        error: 'Product name and category are required'
      });
    }

    const keywords = await contentGenerationService.generateKeywords({
      name,
      category,
      description,
      materials
    });

    res.status(200).json({
      success: true,
      data: {
        keywords,
        count: keywords.length
      }
    });
  } catch (error) {
    console.error('Generate Keywords Error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate keywords'
    });
  }
};

/**
 * Batch generate content
 * POST /api/content/generate-batch
 */
export const generateBatch = async (req, res) => {
  try {
    const { productData, contentTypes } = req.body;

    if (!productData || !contentTypes || !Array.isArray(contentTypes)) {
      return res.status(400).json({
        success: false,
        error: 'Product data and content types array are required'
      });
    }

    const results = {};

    // Generate requested content types in parallel
    const promises = contentTypes.map(async (type) => {
      switch (type) {
        case 'description':
          results.description = await contentGenerationService.generateProductDescription(productData);
          break;
        case 'titles':
          results.titles = await contentGenerationService.generateProductTitles(productData);
          break;
        case 'keywords':
          results.keywords = await contentGenerationService.generateKeywords(productData);
          break;
        case 'socialPost':
          results.socialPost = await contentGenerationService.generateSocialMediaPost(productData);
          break;
        default:
          break;
      }
    });

    await Promise.all(promises);

    res.status(200).json({
      success: true,
      data: results
    });
  } catch (error) {
    console.error('Generate Batch Error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate batch content'
    });
  }
};
