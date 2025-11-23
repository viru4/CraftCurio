import express from 'express';
import {
  getAboutUs,
  updateAboutUs,
  updateAboutUsSection,
  addArrayItem,
  updateArrayItem,
  deleteArrayItem,
  togglePublishStatus
} from '../controllers/aboutUsController.js';
import { authenticate } from '../../middleware/authMiddleware.js';
import { requireAdmin } from '../../middleware/roleMiddleware.js';

const router = express.Router();

/**
 * About Us Routes
 * 
 * Public routes:
 * - GET /api/about-us - Get About Us page data
 * 
 * Admin routes (require authentication + admin role):
 * - PUT /api/about-us - Update entire About Us page
 * - PATCH /api/about-us/:section - Update specific section
 * - POST /api/about-us/:section/:field - Add item to array field
 * - PUT /api/about-us/:section/:field/:itemId - Update array item
 * - DELETE /api/about-us/:section/:field/:itemId - Delete array item
 * - PATCH /api/about-us/publish - Toggle publish status
 */

// Public route - get About Us data
router.get('/', getAboutUs);

// Admin routes - require authentication and admin role
router.put('/', authenticate, requireAdmin, updateAboutUs);
router.patch('/publish', authenticate, requireAdmin, togglePublishStatus);
router.patch('/:section', authenticate, requireAdmin, updateAboutUsSection);
router.post('/:section/:field', authenticate, requireAdmin, addArrayItem);
router.put('/:section/:field/:itemId', authenticate, requireAdmin, updateArrayItem);
router.delete('/:section/:field/:itemId', authenticate, requireAdmin, deleteArrayItem);

export default router;
