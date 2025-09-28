import express from 'express';
import { createCollectibles, getCollectibles, getCollectibleById } from '../controllers/collectibleController.js';

const router = express.Router();

// GET /api/collectibles - Get all collectibles with filtering
router.get('/', getCollectibles);

// GET /api/collectibles/:id - Get collectible by ID
router.get('/:id', getCollectibleById);

// POST /api/collectibles/bulk - Create multiple collectibles
router.post('/bulk', createCollectibles);

export default router;