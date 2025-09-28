import express from 'express';
import { seedDatabase, clearDatabase, getDatabaseStats } from '../controllers/seedController.js';

const router = express.Router();

// POST /api/seed - Seed the database with sample data
router.post('/', seedDatabase);

// DELETE /api/seed - Clear all data from database
router.delete('/', clearDatabase);

// GET /api/seed/stats - Get database statistics
router.get('/stats', getDatabaseStats);

export default router;