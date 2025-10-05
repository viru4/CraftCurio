import ArtisanProduct from '../../models/ArisanProduct.js';

// GET /api/artisan-products - Get all artisan products
export const getArtisanProducts = async (req, res) => {
  try {
    const { 
      category, 
      featured, 
      popular, 
      recent, 
      search, 
      limit = 50, 
      page = 1,
      sort = 'createdAt',
      order = 'desc'
    } = req.query;
    
    // Build filter object
    const filter = {};
    
    if (category) {
      filter.category = { $regex: category, $options: 'i' };
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
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
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
    const artisanProduct = await ArtisanProduct.findById(req.params.id);
    if (!artisanProduct) {
      return res.status(404).json({ error: 'Artisan product not found' });
    }

    // Increment view count
    artisanProduct.views += 1;
    await artisanProduct.save();

    // Convert to plain object and add top-level `image` for frontend
    const productObj = artisanProduct.toObject ? artisanProduct.toObject() : artisanProduct;
    productObj.image = (productObj.images && productObj.images.length) ? productObj.images[0] : (productObj.image || null);

    res.status(200).json({ data: productObj });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/artisan-products - Create new artisan product
export const createArtisanProduct = async (req, res) => {
  try {
    const artisanProductData = { ...req.body };
    
    // Store original ID if provided
    if (req.body.id) {
      artisanProductData.originalId = req.body.id;
      delete artisanProductData.id; // Remove id field as MongoDB will create _id
    }
    
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
    const artisanProduct = await ArtisanProduct.findById(req.params.id);
    if (!artisanProduct) {
      return res.status(404).json({ error: 'Artisan product not found' });
    }
    
    artisanProduct.likes += 1;
    await artisanProduct.save();
    
    res.status(200).json({
      message: 'Artisan product liked successfully',
      data: artisanProduct
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
