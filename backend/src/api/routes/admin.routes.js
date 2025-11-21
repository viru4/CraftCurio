import express from 'express';
import { 
  getAllUsers, 
  getUserById, 
  createUser, 
  updateUser, 
  deleteUser 
} from '../controllers/admin.controllers.js';
import { authenticate } from '../../middleware/authMiddleware.js';

const adminRouter = express.Router();

// User management routes - require authentication
// Note: For production, you should add role-based access control
// import { requireAdmin } from '../../middleware/roleMiddleware.js';
// Then add requireAdmin middleware to routes that should be admin-only

adminRouter.get('/users', authenticate, getAllUsers);
adminRouter.get('/users/:id', authenticate, getUserById);
adminRouter.post('/users', authenticate, createUser);
adminRouter.patch('/users/:id', authenticate, updateUser);
adminRouter.delete('/users/:id', authenticate, deleteUser);

export default adminRouter;
