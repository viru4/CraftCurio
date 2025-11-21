import Conversation from '../../models/Conversation.js';
import Message from '../../models/Message.js';
import User from '../../models/User.js';

/**
 * Get all conversations for the authenticated user
 * @route GET /api/messages/conversations
 */
export const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find all conversations where user is a participant
    const conversations = await Conversation.find({
      participants: userId
    })
      .populate('participants', 'name email role')
      .populate('lastMessage')
      .sort({ lastMessageTime: -1 });

    // Format conversations for frontend
    const formattedConversations = await Promise.all(
      conversations.map(async (conv) => {
        // Get the other participant
        const otherParticipant = conv.participants.find(
          p => p._id.toString() !== userId.toString()
        );

        // Get last message text
        const lastMessageText = conv.lastMessage ? conv.lastMessage.text : '';

        // Get unread count for this user
        const unreadCount = conv.unreadCount?.get(userId.toString()) || 0;

        return {
          id: conv._id,
          user: {
            id: otherParticipant._id,
            name: otherParticipant.name,
            email: otherParticipant.email,
            role: otherParticipant.role,
            online: false // TODO: Implement online status with Socket.IO
          },
          lastMessage: lastMessageText,
          lastMessageTime: conv.lastMessageTime,
          unreadCount: unreadCount,
          isTyping: false // TODO: Implement with Socket.IO
        };
      })
    );

    res.json({
      success: true,
      conversations: formattedConversations
    });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching conversations',
      error: error.message
    });
  }
};

/**
 * Get messages for a specific conversation
 * @route GET /api/messages/:conversationId
 */
export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user._id;
    const { limit = 50, before } = req.query;

    // Verify user is part of this conversation
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    if (!conversation.participants.includes(userId)) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to conversation'
      });
    }

    // Build query
    const query = {
      conversationId,
      deleted: false
    };

    if (before) {
      query.createdAt = { $lt: new Date(before) };
    }

    // Fetch messages
    const messages = await Message.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .populate('senderId', 'name');

    // Mark unread messages as read
    const unreadMessages = messages.filter(
      msg => !msg.read && msg.senderId._id.toString() !== userId.toString()
    );

    await Promise.all(unreadMessages.map(msg => msg.markAsRead()));

    // Reset unread count for this user
    if (unreadMessages.length > 0) {
      conversation.unreadCount.set(userId.toString(), 0);
      await conversation.save();
    }

    // Format messages
    const formattedMessages = messages.reverse().map(msg => ({
      id: msg._id,
      conversationId: msg.conversationId,
      senderId: msg.senderId._id,
      text: msg.text,
      timestamp: msg.createdAt,
      read: msg.read,
      reactions: msg.reactions || []
    }));

    res.json({
      success: true,
      messages: formattedMessages,
      hasMore: messages.length === parseInt(limit)
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching messages',
      error: error.message
    });
  }
};

/**
 * Send a new message
 * @route POST /api/messages
 */
export const sendMessage = async (req, res) => {
  try {
    const { recipientId, text, conversationId } = req.body;
    const senderId = req.user._id;

    // Validate input
    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message text is required'
      });
    }

    if (!recipientId && !conversationId) {
      return res.status(400).json({
        success: false,
        message: 'Recipient ID or Conversation ID is required'
      });
    }

    let conversation;

    // Get or create conversation
    if (conversationId) {
      conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        return res.status(404).json({
          success: false,
          message: 'Conversation not found'
        });
      }
    } else {
      // Verify recipient exists
      const recipient = await User.findById(recipientId);
      if (!recipient) {
        return res.status(404).json({
          success: false,
          message: 'Recipient not found'
        });
      }

      conversation = await Conversation.getOrCreate(senderId, recipientId);
    }

    // Create message
    const message = await Message.create({
      conversationId: conversation._id,
      senderId,
      text: text.trim()
    });

    // Update conversation
    conversation.lastMessage = message._id;
    conversation.lastMessageTime = message.createdAt;

    // Increment unread count for recipient
    const recipientId2 = conversation.participants.find(
      p => p.toString() !== senderId.toString()
    );
    const currentUnread = conversation.unreadCount.get(recipientId2.toString()) || 0;
    conversation.unreadCount.set(recipientId2.toString(), currentUnread + 1);

    await conversation.save();

    // Populate sender info
    await message.populate('senderId', 'name');

    // TODO: Emit Socket.IO event for real-time delivery
    // io.to(recipientId).emit('new-message', formattedMessage);

    res.status(201).json({
      success: true,
      message: {
        id: message._id,
        conversationId: message.conversationId,
        senderId: message.senderId._id,
        text: message.text,
        timestamp: message.createdAt,
        read: message.read,
        reactions: message.reactions || []
      }
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending message',
      error: error.message
    });
  }
};

/**
 * Delete a message
 * @route DELETE /api/messages/:messageId
 */
export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user._id;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Only sender can delete their message
    if (message.senderId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to delete this message'
      });
    }

    await message.softDelete();

    // TODO: Emit Socket.IO event
    // io.to(conversationId).emit('message-deleted', { messageId });

    res.json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting message',
      error: error.message
    });
  }
};

/**
 * Add reaction to a message
 * @route POST /api/messages/:messageId/react
 */
export const reactToMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { emoji } = req.body;
    const userId = req.user._id;

    if (!emoji) {
      return res.status(400).json({
        success: false,
        message: 'Emoji is required'
      });
    }

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Verify user is part of the conversation
    const conversation = await Conversation.findById(message.conversationId);
    if (!conversation.participants.includes(userId)) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    await message.addReaction(emoji);

    // TODO: Emit Socket.IO event
    // io.to(conversationId).emit('message-reaction', { messageId, emoji });

    res.json({
      success: true,
      message: 'Reaction added successfully',
      reactions: message.reactions
    });
  } catch (error) {
    console.error('Error adding reaction:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding reaction',
      error: error.message
    });
  }
};

/**
 * Mark conversation as read
 * @route PUT /api/messages/:conversationId/read
 */
export const markAsRead = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user._id;

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    if (!conversation.participants.includes(userId)) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    // Mark all unread messages as read
    await Message.updateMany(
      {
        conversationId,
        senderId: { $ne: userId },
        read: false
      },
      {
        read: true,
        readAt: new Date()
      }
    );

    // Reset unread count
    conversation.unreadCount.set(userId.toString(), 0);
    await conversation.save();

    res.json({
      success: true,
      message: 'Messages marked as read'
    });
  } catch (error) {
    console.error('Error marking as read:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking messages as read',
      error: error.message
    });
  }
};
