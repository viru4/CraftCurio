import express from 'express';
import { createCategories, getCategories, getCategoryBySlug } from '../controllers/categoryController.js';

const router = express.Router();

// GET /api/categories - Get all categories
router.get('/', getCategories);

// GET /api/categories/:slug - Get category by slug
router.get('/:slug', getCategoryBySlug);

// POST /api/categories/bulk - Create multiple categories
router.post('/bulk', createCategories);

export default router;