import express from 'express';
import {
  getArtisanProducts,
  getFeaturedArtisanProducts,
  getPopularArtisanProducts,
  getRecentArtisanProducts,
  getArtisanProductById,
  createArtisanProduct,
  likeArtisanProduct
} from '../controllers/artisanProductController.js';

const router = express.Router();

// GET /api/artisan-products - Get all artisan products
router.get('/', getArtisanProducts);

// GET /api/artisan-products/featured - Get featured items
router.get('/featured', getFeaturedArtisanProducts);

// GET /api/artisan-products/popular - Get popular items
router.get('/popular', getPopularArtisanProducts);

// GET /api/artisan-products/recent - Get recent items
router.get('/recent', getRecentArtisanProducts);

// GET /api/artisan-products/:id - Get single artisan product
router.get('/:id', getArtisanProductById);

// POST /api/artisan-products - Create new artisan product
router.post('/', createArtisanProduct);

// PUT /api/artisan-products/:id/like - Like an artisan product
router.put('/:id/like', likeArtisanProduct);

export default router;
