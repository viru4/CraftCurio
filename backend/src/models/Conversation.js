import mongoose from 'mongoose';

/**
 * Conversation Schema
 * Represents a conversation between two users
 */
const conversationSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  lastMessageTime: {
    type: Date,
    default: Date.now
  },
  // Track unread count per participant
  unreadCount: {
    type: Map,
    of: Number,
    default: {}
  }
}, {
  timestamps: true
});

// Index for faster queries
conversationSchema.index({ participants: 1 });
conversationSchema.index({ lastMessageTime: -1 });

// Method to get conversation between two users
conversationSchema.statics.findBetweenUsers = async function(userId1, userId2) {
  return this.findOne({
    participants: { $all: [userId1, userId2] }
  });
};

// Method to get or create conversation
conversationSchema.statics.getOrCreate = async function(userId1, userId2) {
  let conversation = await this.findBetweenUsers(userId1, userId2);
  
  if (!conversation) {
    conversation = await this.create({
      participants: [userId1, userId2],
      unreadCount: {
        [userId1]: 0,
        [userId2]: 0
      }
    });
  }
  
  return conversation;
};

export default mongoose.model('Conversation', conversationSchema);
