import express from 'express';
import { 
  createCategories, 
  getCategories, 
  getCategoryBySlug,
  getCollectibleCategories,
  getArtisanCategories,
  createCollectibleCategories,
  createArtisanCategories,
  getCollectibleCategoryByName,
  getArtisanCategoryByName
} from '../controllers/categoryController.js';

const router = express.Router();

// Unified routes (backwards compatible)
router.get('/', getCategories);
router.get('/:slug', getCategoryBySlug);
router.post('/bulk', createCategories);

// Specific category type routes
router.get('/collectible/all', getCollectibleCategories);
router.get('/artisan/all', getArtisanCategories);
router.post('/collectible/bulk', createCollectibleCategories);
router.post('/artisan/bulk', createArtisanCategories);
router.get('/collectible/:name', getCollectibleCategoryByName);
router.get('/artisan/:name', getArtisanCategoryByName);

export default router;