import express from 'express';
import * as messageController from '../controllers/messageController.js';
import { authenticate } from '../../middleware/authMiddleware.js';

const router = express.Router();

/**
 * All message routes require authentication
 */
router.use(authenticate);

/**
 * @route   GET /api/messages/conversations
 * @desc    Get all conversations for authenticated user
 * @access  Private
 */
router.get('/conversations', messageController.getConversations);

/**
 * @route   GET /api/messages/:conversationId
 * @desc    Get messages for a specific conversation
 * @access  Private
 */
router.get('/:conversationId', messageController.getMessages);

/**
 * @route   POST /api/messages
 * @desc    Send a new message
 * @access  Private
 */
router.post('/', messageController.sendMessage);

/**
 * @route   DELETE /api/messages/:messageId
 * @desc    Delete a message (soft delete)
 * @access  Private
 */
router.delete('/:messageId', messageController.deleteMessage);

/**
 * @route   POST /api/messages/:messageId/react
 * @desc    Add reaction to a message
 * @access  Private
 */
router.post('/:messageId/react', messageController.reactToMessage);

/**
 * @route   PUT /api/messages/:conversationId/read
 * @desc    Mark all messages in conversation as read
 * @access  Private
 */
router.put('/:conversationId/read', messageController.markAsRead);

export default router;
