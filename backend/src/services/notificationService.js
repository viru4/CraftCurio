import Notification from '../models/Notification.js';

/**
 * Notification Service - Handles in-app notifications
 */

/**
 * Create a new notification
 * @param {Object} params - Notification parameters
 * @param {String} params.userId - User ID to notify
 * @param {String} params.type - Notification type ('message', 'order', 'system', 'auction')
 * @param {String} params.title - Notification title
 * @param {String} params.message - Notification message
 * @param {String} params.relatedId - Related entity ID (optional)
 * @returns {Promise<Object>} Created notification
 */
export const createNotification = async ({ userId, type, title, message, relatedId }) => {
  try {
    const notification = await Notification.create({
      userId,
      type,
      title,
      message,
      relatedId,
      read: false
    });

    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

/**
 * Create multiple notifications at once
 * @param {Array} notifications - Array of notification objects
 * @returns {Promise<Array>} Created notifications
 */
export const createBulkNotifications = async (notifications) => {
  try {
    const created = await Notification.insertMany(notifications);
    return created;
  } catch (error) {
    console.error('Error creating bulk notifications:', error);
    throw error;
  }
};

/**
 * Get notifications for a user
 * @param {String} userId - User ID
 * @param {Object} options - Query options
 * @returns {Promise<Array>} User notifications
 */
export const getUserNotifications = async (userId, options = {}) => {
  try {
    const {
      unreadOnly = false,
      limit = 50,
      skip = 0,
      type = null
    } = options;

    const query = { userId };
    
    if (unreadOnly) {
      query.read = false;
    }
    
    if (type) {
      query.type = type;
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean();

    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({ userId, read: false });

    return {
      notifications,
      total,
      unreadCount
    };
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

/**
 * Mark notification as read
 * @param {String} notificationId - Notification ID
 * @param {String} userId - User ID (for verification)
 * @returns {Promise<Object>} Updated notification
 */
export const markAsRead = async (notificationId, userId) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, userId },
      { read: true },
      { new: true }
    );

    return notification;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

/**
 * Mark all notifications as read for a user
 * @param {String} userId - User ID
 * @returns {Promise<Object>} Update result
 */
export const markAllAsRead = async (userId) => {
  try {
    const result = await Notification.updateMany(
      { userId, read: false },
      { read: true }
    );

    return result;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
};

/**
 * Delete notification
 * @param {String} notificationId - Notification ID
 * @param {String} userId - User ID (for verification)
 * @returns {Promise<Object>} Deletion result
 */
export const deleteNotification = async (notificationId, userId) => {
  try {
    const result = await Notification.deleteOne({ _id: notificationId, userId });
    return result;
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
};

export default {
  createNotification,
  createBulkNotifications,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification
};
