import express from 'express';
import { authenticate } from '../../middleware/authMiddleware.js';
import { requireRole } from '../../middleware/roleMiddleware.js';
import {
  submitVerification,
  getMyVerification,
  getAllVerifications,
  getVerificationById,
  approveVerification,
  rejectVerification
} from '../controllers/verification.controller.js';

const router = express.Router();

// Artisan routes
router.post('/request', authenticate, requireRole('artisan'), submitVerification);
router.get('/my-request', authenticate, requireRole('artisan'), getMyVerification);

// Admin routes
router.get('/requests', authenticate, requireRole('admin'), getAllVerifications);
router.get('/requests/:id', authenticate, requireRole('admin'), getVerificationById);
router.put('/requests/:id/approve', authenticate, requireRole('admin'), approveVerification);
router.put('/requests/:id/reject', authenticate, requireRole('admin'), rejectVerification);

export default router;
