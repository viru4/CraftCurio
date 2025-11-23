import express from 'express';
import { 
  getAllUsers, 
  getUserById, 
  createUser, 
  updateUser, 
  deleteUser 
} from '../controllers/admin.controllers.js';
import { authenticate } from '../../middleware/authMiddleware.js';
import { requireAdmin } from '../../middleware/roleMiddleware.js';

const adminRouter = express.Router();

// User management routes - require admin authentication
// All routes are protected with authenticate + requireAdmin middleware

adminRouter.get('/users', authenticate, requireAdmin, getAllUsers);
adminRouter.get('/users/:id', authenticate, requireAdmin, getUserById);
adminRouter.post('/users', authenticate, requireAdmin, createUser);
adminRouter.patch('/users/:id', authenticate, requireAdmin, updateUser);
adminRouter.delete('/users/:id', authenticate, requireAdmin, deleteUser);

export default adminRouter;
