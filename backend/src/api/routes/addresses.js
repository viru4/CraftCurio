import express from 'express';
import {
  getSavedAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress
} from '../controllers/addressController.js';
import { authenticate } from '../../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all saved addresses
router.get('/', getSavedAddresses);

// Add new address
router.post('/', addAddress);

// Update address
router.put('/:addressId', updateAddress);

// Delete address
router.delete('/:addressId', deleteAddress);

// Set default address
router.patch('/:addressId/default', setDefaultAddress);

export default router;
