import huggingfaceService from './huggingfaceService.js';

class ContentGenerationService {
  /**
   * Generate product description
   * @param {Object} productData - Product information
   * @returns {Promise<string>} Generated description
   */
  async generateProductDescription(productData) {
    const { name, category, materials, isAuction, images } = productData;

    // Analyze images if provided
    let imageAnalysis = '';
    if (images && images.length > 0) {
      try {
        console.log('🖼️  Analyzing product images...');
        // Analyze the first image
        const firstImage = images[0];
        imageAnalysis = await huggingfaceService.analyzeImage(firstImage);
        console.log('✅ Image analysis:', imageAnalysis);
      } catch (error) {
        console.error('Image analysis failed:', error.message);
        // Continue without image analysis if it fails
      }
    }

    const prompt = `Generate a compelling, detailed product description for an artisan product on CraftCurio marketplace.

**Product Details:**
- Name: ${name}
- Category: ${category}
- Materials: ${materials || 'handcrafted materials'}
- Type: ${isAuction ? 'Auction Item' : 'Direct Sale'}
${imageAnalysis ? `- Visual Details: ${imageAnalysis}` : ''}

**Requirements:**
- Write 50-100 words (concise and focused)
- Highlight craftsmanship and unique qualities
- Include emotional appeal and benefits
- Use sensory language (texture, appearance, feel)
${imageAnalysis ? '- Incorporate visual details from the image analysis' : ''}
- Mention artisan dedication and quality
- SEO-friendly with natural keywords
- Professional yet warm tone
- DO NOT mention price

Generate the description now:`;

    const messages = [
      { role: 'user', content: prompt }
    ];

    const rawDescription = await huggingfaceService.generateResponse(messages, {});
    
    // Clean and format the description professionally
    const cleanedDescription = rawDescription
      .replace(/\*\*/g, '') // Remove markdown bold
      .replace(/\*/g, '') // Remove markdown italic  
      .replace(/\n{3,}/g, '\n\n') // Replace multiple newlines with max 2
      .replace(/^[\s\n]+/, '') // Remove leading whitespace
      .replace(/[\s\n]+$/, '') // Remove trailing whitespace
      .replace(/\s{2,}/g, ' ') // Replace multiple spaces with single space
      .replace(/^[0-9]+\.\s*/, '') // Remove numbered list formatting
      .replace(/^-\s*/, '') // Remove bullet points
      .replace(/^\*\s*/, '') // Remove asterisk bullets
      .trim();
    
    return cleanedDescription;
  }

  /**
   * Generate product title variations
   * @param {Object} productData - Basic product info
   * @returns {Promise<Array<string>>} Title suggestions
   */
  async generateProductTitles(productData) {
    const { category, materials, style, keywords } = productData;

    const prompt = `Generate 5 compelling product titles for a handcrafted item.

**Details:**
- Category: ${category}
- Materials: ${materials || 'artisan materials'}
- Style: ${style || 'unique handcrafted'}
- Keywords: ${keywords || 'handmade, artisan'}

**Requirements:**
- 5-10 words each
- SEO-friendly
- Descriptive and appealing
- Include key materials or techniques
- Professional yet creative

Provide exactly 5 titles, one per line:`;

    const messages = [
      { role: 'user', content: prompt }
    ];

    const response = await huggingfaceService.generateResponse(messages, {});
    const titles = response.split('\n')
      .filter(line => line.trim())
      .map(line => line.replace(/^\d+[\.\)]\s*/, '').trim())
      .slice(0, 5);

    return titles;
  }

  /**
   * Generate auction announcement
   * @param {Object} auctionData - Auction details
   * @returns {Promise<string>} Announcement text
   */
  async generateAuctionAnnouncement(auctionData) {
    const { productName, category, startingBid, endTime, highlights } = auctionData;

    const prompt = `Create an exciting auction announcement for CraftCurio marketplace.

**Auction Details:**
- Product: ${productName}
- Category: ${category}
- Starting Bid: $${startingBid}
- Ends: ${endTime}
- Highlights: ${highlights || 'Unique handcrafted item'}

**Requirements:**
- 1-2 paragraphs (80-120 words)
- Create urgency and excitement
- Highlight uniqueness and value
- Include call-to-action
- Mention limited availability
- Professional and engaging tone

Generate the announcement:`;

    const messages = [
      { role: 'user', content: prompt }
    ];

    const announcement = await huggingfaceService.generateResponse(messages, {});
    return announcement.trim();
  }

  /**
   * Generate category description
   * @param {Object} categoryData - Category information
   * @returns {Promise<string>} Category description
   */
  async generateCategoryDescription(categoryData) {
    const { name, itemCount, topArtisans } = categoryData;

    const prompt = `Write an engaging category description for the "${name}" section on CraftCurio.

**Category Info:**
- Name: ${name}
- Items Available: ${itemCount || 'many'}
- Top Artisans: ${topArtisans || 'skilled craftspeople'}

**Requirements:**
- 2-3 paragraphs (120-150 words)
- Describe the craft tradition and techniques
- Highlight quality and authenticity
- SEO-optimized with natural keywords
- Inspire browsing and purchases
- Mention artisan expertise

Generate the description:`;

    const messages = [
      { role: 'user', content: prompt }
    ];

    const rawDescription = await huggingfaceService.generateResponse(messages, {});
    
    // Clean and format professionally
    const cleanedDescription = rawDescription
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/\n{3,}/g, '\n\n')
      .replace(/^[\s\n]+/, '')
      .replace(/[\s\n]+$/, '')
      .replace(/\s{2,}/g, ' ')
      .trim();
    
    return cleanedDescription;
  }

  /**
   * Generate social media post
   * @param {Object} productData - Product for promotion
   * @returns {Promise<Object>} Social media content
   */
  async generateSocialMediaPost(productData) {
    const { name, category, price, imageUrl, isAuction } = productData;

    const prompt = `Create a social media post to promote this artisan product.

**Product:**
- Name: ${name}
- Category: ${category}
- ${isAuction ? `Auction starting at $${price}` : `Price: $${price}`}

**Requirements:**
- 1-2 sentences (30-50 words)
- Include 3-5 relevant hashtags
- Engaging and shareable
- Create urgency or appeal
- Platform: Instagram/Facebook

Format:
[Post text]

[Hashtags]

Generate the post:`;

    const messages = [
      { role: 'user', content: prompt }
    ];

    const response = await huggingfaceService.generateResponse(messages, {});
    
    // Parse post and hashtags
    const parts = response.split('\n\n');
    const text = parts[0]?.trim() || response;
    const hashtags = parts[1]?.trim() || '';

    return {
      text,
      hashtags,
      imageUrl: imageUrl || null
    };
  }

  /**
   * Enhance existing description
   * @param {string} currentDescription - Existing text
   * @param {string} improvementType - Type of enhancement
   * @returns {Promise<string>} Enhanced description
   */
  async enhanceDescription(currentDescription, improvementType = 'general') {
    const improvementPrompts = {
      general: 'Make it more compelling and professional',
      seo: 'Add more SEO keywords and improve search visibility',
      emotional: 'Add more emotional appeal and storytelling',
      concise: 'Make it more concise while keeping key information',
      detailed: 'Add more details about craftsmanship and materials'
    };

    const prompt = `Improve this product description: "${currentDescription}"

Enhancement needed: ${improvementPrompts[improvementType] || improvementPrompts.general}

Requirements:
- Keep the same basic information
- Improve readability and flow
- Maintain professional tone
- Keep length similar (unless concise requested)

Provide the enhanced description:`;

    const messages = [
      { role: 'user', content: prompt }
    ];

    const rawEnhanced = await huggingfaceService.generateResponse(messages, {});
    
    // Clean and format professionally
    const cleanedEnhanced = rawEnhanced
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/\n{3,}/g, '\n\n')
      .replace(/^[\s\n]+/, '')
      .replace(/[\s\n]+$/, '')
      .replace(/\s{2,}/g, ' ')
      .replace(/^[0-9]+\.\s*/, '')
      .replace(/^-\s*/, '')
      .replace(/^\*\s*/, '')
      .trim();
    
    return cleanedEnhanced;
  }

  /**
   * Generate product keywords/tags
   * @param {Object} productData - Product information
   * @returns {Promise<Array<string>>} Keywords
   */
  async generateKeywords(productData) {
    const { name, category, description, materials } = productData;

    const prompt = `Generate 10 relevant keywords/tags for this product.

**Product:**
- Name: ${name}
- Category: ${category}
- Description: ${description?.substring(0, 200) || 'Handcrafted item'}
- Materials: ${materials || 'various'}

**Requirements:**
- 10 single words or short phrases
- SEO-relevant
- Mix of general and specific terms
- Include materials, style, and use cases
- No hashtags, just words

Provide keywords, one per line:`;

    const messages = [
      { role: 'user', content: prompt }
    ];

    const response = await huggingfaceService.generateResponse(messages, {});
    const keywords = response.split('\n')
      .filter(line => line.trim())
      .map(line => line.replace(/^\d+[\.\)]\s*/, '').trim())
      .slice(0, 10);

    return keywords;
  }
}

// Export singleton instance
const contentGenerationService = new ContentGenerationService();
export default contentGenerationService;
