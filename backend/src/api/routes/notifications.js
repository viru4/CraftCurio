import express from 'express';
import { authenticate } from '../../middleware/authMiddleware.js';
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  removeNotification
} from '../controllers/notificationController.js';

const router = express.Router();

/**
 * @route   GET /api/notifications
 * @desc    Get user notifications
 * @access  Private
 */
router.get('/', authenticate, getNotifications);

/**
 * @route   PATCH /api/notifications/read-all
 * @desc    Mark all notifications as read
 * @access  Private
 */
router.patch('/read-all', authenticate, markAllNotificationsAsRead);

/**
 * @route   PATCH /api/notifications/:id/read
 * @desc    Mark single notification as read
 * @access  Private
 */
router.patch('/:id/read', authenticate, markNotificationAsRead);

/**
 * @route   DELETE /api/notifications/:id
 * @desc    Delete notification
 * @access  Private
 */
router.delete('/:id', authenticate, removeNotification);

export default router;
