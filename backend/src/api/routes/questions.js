import express from 'express';
import { 
  getArtisanQuestions,
  answerQuestion,
  updateAnswer,
  deleteAnswer,
  archiveQuestion,
  getProductQuestions,
  submitQuestion
} from '../controllers/questionController.js';
import { authenticate } from '../../middleware/authMiddleware.js';
import { requireRole } from '../../middleware/roleMiddleware.js';

const router = express.Router();

// Public routes
router.get('/product/:productId', getProductQuestions);

// Authenticated customer routes
router.post('/product/:productId', authenticate, submitQuestion);

// Artisan routes - require authentication and artisan role
router.get('/artisan/my-questions', authenticate, requireRole('artisan'), getArtisanQuestions);
router.post('/artisan/:questionId/answer', authenticate, requireRole('artisan'), answerQuestion);
router.put('/artisan/:questionId/answer', authenticate, requireRole('artisan'), updateAnswer);
router.delete('/artisan/:questionId/answer', authenticate, requireRole('artisan'), deleteAnswer);
router.put('/artisan/:questionId/archive', authenticate, requireRole('artisan'), archiveQuestion);

export default router;
