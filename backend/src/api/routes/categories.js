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
  getArtisanCategoryByName,
  // Admin management functions
  getAllCategoriesForAdmin,
  submitCategory,
  updateCategory,
  approveCategory,
  rejectCategory,
  deleteCategory,
  getCategoryStats
} from '../controllers/categoryController.js';
import { authenticate } from '../../middleware/authMiddleware.js';

// Admin middleware
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Access denied. Admin only.' });
  }
};

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

// Admin management routes
router.get('/admin/all', authenticate, adminOnly, getAllCategoriesForAdmin);
router.get('/admin/stats', authenticate, adminOnly, getCategoryStats);
router.post('/admin/submit', authenticate, submitCategory); // Sellers can submit
router.put('/admin/:id', authenticate, adminOnly, updateCategory);
router.post('/admin/:id/approve', authenticate, adminOnly, approveCategory);
router.post('/admin/:id/reject', authenticate, adminOnly, rejectCategory);
router.delete('/admin/:id', authenticate, adminOnly, deleteCategory);

export default router;