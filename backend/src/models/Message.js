import mongoose from 'mongoose';

/**
 * Message Schema
 * Represents individual messages in a conversation
 */
const messageSchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true,
    index: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: true,
    trim: true,
    maxlength: 5000
  },
  read: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  },
  reactions: [{
    type: String,
    maxlength: 10
  }],
  deleted: {
    type: Boolean,
    default: false
  },
  deletedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
messageSchema.index({ conversationId: 1, createdAt: -1 });
messageSchema.index({ senderId: 1 });

// Method to mark message as read
messageSchema.methods.markAsRead = async function() {
  if (!this.read) {
    this.read = true;
    this.readAt = new Date();
    await this.save();
  }
  return this;
};

// Method to soft delete message
messageSchema.methods.softDelete = async function() {
  this.deleted = true;
  this.deletedAt = new Date();
  await this.save();
  return this;
};

// Method to add reaction
messageSchema.methods.addReaction = async function(emoji) {
  if (!this.reactions) {
    this.reactions = [];
  }
  this.reactions.push(emoji);
  await this.save();
  return this;
};

export default mongoose.model('Message', messageSchema);
