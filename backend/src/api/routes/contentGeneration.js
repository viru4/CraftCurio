import express from 'express';
import * as contentGenerationController from '../controllers/contentGenerationController.js';
import { authenticate } from '../../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication (artisans only for most endpoints)
router.post('/generate-description', authenticate, contentGenerationController.generateDescription);
router.post('/generate-titles', authenticate, contentGenerationController.generateTitles);
router.post('/generate-auction-announcement', authenticate, contentGenerationController.generateAuctionAnnouncement);
router.post('/generate-category-description', authenticate, contentGenerationController.generateCategoryDescription);
router.post('/generate-social-post', authenticate, contentGenerationController.generateSocialPost);
router.post('/enhance-description', authenticate, contentGenerationController.enhanceDescription);
router.post('/generate-keywords', authenticate, contentGenerationController.generateKeywords);
router.post('/generate-batch', authenticate, contentGenerationController.generateBatch);

export default router;
