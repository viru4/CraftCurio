import express from 'express';
import {
  getArtisans,
  getArtisanById,
  createArtisan,
  updateArtisan,
  deleteArtisan
} from '../controllers/artisanController.js';

const router = express.Router();

// GET /api/artisans - Get all artisans with pagination
router.get('/', getArtisans);

// GET /api/artisans/:id - Get artisan by ID
router.get('/:id', getArtisanById);

// POST /api/artisans - Create new artisan
router.post('/', createArtisan);

// PUT /api/artisans/:id - Update artisan
router.put('/:id', updateArtisan);

// DELETE /api/artisans/:id - Delete artisan
router.delete('/:id', deleteArtisan);

export default router;