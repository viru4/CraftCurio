import { io } from 'socket.io-client';

/**
 * Socket.io Client - Real-time communication for auctions
 * Handles connection, events, and auction room management
 */

// Socket.io server URL
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:8000';

// Socket instance (singleton)
let socket = null;

/**
 * Initialize Socket.io connection
 * @returns {Socket} Socket instance
 */
export const initializeSocket = () => {
  if (socket && socket.connected) {
    return socket;
  }

  socket = io(SOCKET_URL, {
    transports: ['polling', 'websocket'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
    timeout: 20000,
  });

  // Connection event handlers
  socket.on('connect', () => {
    if (import.meta.env.DEV) {
      console.log('✅ Socket.io connected:', socket.id);
    }
  });

  socket.on('disconnect', (reason) => {
    if (import.meta.env.DEV) {
      console.log('❌ Socket.io disconnected:', reason);
    }
  });

  socket.on('connect_error', (error) => {
    if (import.meta.env.DEV) {
      console.error('🔴 Socket.io connection error:', error.message);
    }
  });

  socket.on('error', (data) => {
    if (import.meta.env.DEV) {
      console.error('🔴 Socket error:', data.message);
    }
  });

  return socket;
};

/**
 * Get the current socket instance
 * @returns {Socket|null} Socket instance or null
 */
export const getSocket = () => {
  return socket;
};

/**
 * Disconnect socket
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

/**
 * Check if socket is connected
 * @returns {Boolean} Connection status
 */
export const isSocketConnected = () => {
  return socket && socket.connected;
};

// ============================================================================
// AUCTION ROOM MANAGEMENT
// ============================================================================

/**
 * Join an auction room for real-time updates
 * @param {String} collectibleId - Auction collectible ID
 * @param {Function} onAuctionData - Callback for initial auction data
 */
export const joinAuction = (collectibleId, onAuctionData) => {
  if (!socket) {
    if (import.meta.env.DEV) {
      console.error('Socket not initialized. Call initializeSocket() first.');
    }
    return;
  }

  socket.emit('joinAuction', { collectibleId });

  // Listen for initial auction data
  if (onAuctionData) {
    socket.once('auctionData', onAuctionData);
  }
};

/**
 * Leave an auction room
 * @param {String} collectibleId - Auction collectible ID
 */
export const leaveAuction = (collectibleId) => {
  if (!socket) return;

  socket.emit('leaveAuction', { collectibleId });
};

/**
 * Watch multiple auctions at once
 * @param {Array<String>} collectibleIds - Array of auction IDs
 * @param {Function} onStatuses - Callback for auction statuses
 */
export const watchAuctions = (collectibleIds, onStatuses) => {
  if (!socket) {
    if (import.meta.env.DEV) {
      console.error('Socket not initialized.');
    }
    return;
  }

  socket.emit('watchAuctions', { collectibleIds });

  if (onStatuses) {
    socket.once('auctionStatuses', onStatuses);
  }
};

/**
 * Request current auction status
 * @param {String} collectibleId - Auction collectible ID
 * @param {Function} onStatus - Callback for auction status
 */
export const getAuctionStatus = (collectibleId, onStatus) => {
  if (!socket) return;

  socket.emit('getAuctionStatus', { collectibleId });

  if (onStatus) {
    socket.once('auctionStatus', onStatus);
  }
};

// ============================================================================
// EVENT LISTENERS
// ============================================================================

/**
 * Listen for new bids on an auction
 * @param {Function} callback - Callback function with bid data
 * @returns {Function} Cleanup function to remove listener
 */
export const onNewBid = (callback) => {
  if (!socket) return () => { };

  socket.on('newBid', callback);

  // Return cleanup function
  return () => {
    socket.off('newBid', callback);
  };
};

/**
 * Listen for countdown updates
 * @param {Function} callback - Callback function with time remaining
 * @returns {Function} Cleanup function
 */
export const onCountdownUpdate = (callback) => {
  if (!socket) return () => { };

  socket.on('countdownUpdate', callback);

  return () => {
    socket.off('countdownUpdate', callback);
  };
};

/**
 * Listen for auction ending soon alerts
 * @param {Function} callback - Callback function
 * @returns {Function} Cleanup function
 */
export const onAuctionEndingSoon = (callback) => {
  if (!socket) return () => { };

  socket.on('auctionEndingSoon', callback);

  return () => {
    socket.off('auctionEndingSoon', callback);
  };
};

/**
 * Listen for auction ended event
 * @param {Function} callback - Callback function with end data
 * @returns {Function} Cleanup function
 */
export const onAuctionEnded = (callback) => {
  if (!socket) return () => { };

  socket.on('auctionEnded', callback);

  return () => {
    socket.off('auctionEnded', callback);
  };
};

/**
 * Listen for auction cancelled event
 * @param {Function} callback - Callback function
 * @returns {Function} Cleanup function
 */
export const onAuctionCancelled = (callback) => {
  if (!socket) return () => { };

  socket.on('auctionCancelled', callback);

  return () => {
    socket.off('auctionCancelled', callback);
  };
};

/**
 * Listen for auction status changes
 * @param {Function} callback - Callback function
 * @returns {Function} Cleanup function
 */
export const onAuctionStatusChanged = (callback) => {
  if (!socket) return () => { };

  socket.on('auctionStatusChanged', callback);

  return () => {
    socket.off('auctionStatusChanged', callback);
  };
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Format time remaining for display
 * @param {Number} milliseconds - Time in milliseconds
 * @returns {Object} Formatted time { days, hours, minutes, seconds }
 */
export const formatTimeRemaining = (milliseconds) => {
  if (milliseconds <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  }

  const seconds = Math.floor((milliseconds / 1000) % 60);
  const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
  const hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);
  const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));

  return { days, hours, minutes, seconds, expired: false };
};

/**
 * Format time remaining as string
 * @param {Number} milliseconds - Time in milliseconds
 * @returns {String} Formatted string (e.g., "2d 5h 30m" or "45m 20s")
 */
export const formatTimeRemainingString = (milliseconds) => {
  const { days, hours, minutes, seconds, expired } = formatTimeRemaining(milliseconds);

  if (expired) return 'Expired';

  const parts = [];

  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0 && days === 0) parts.push(`${seconds}s`);

  return parts.join(' ') || '0s';
};

/**
 * Check if auction is ending soon (less than 5 minutes)
 * @param {Number} milliseconds - Time in milliseconds
 * @returns {Boolean} Is ending soon
 */
export const isAuctionEndingSoon = (milliseconds) => {
  return milliseconds > 0 && milliseconds < 5 * 60 * 1000; // 5 minutes
};

/**
 * Hook for auto-initializing socket on component mount
 * @returns {Object} Socket utilities
 */
export const useSocketAutoInit = () => {
  if (typeof window !== 'undefined' && !socket) {
    initializeSocket();
  }

  return {
    socket: getSocket(),
    isConnected: isSocketConnected(),
    disconnect: disconnectSocket,
  };
};

// ============================================================================
// CHAT MANAGEMENT
// ============================================================================

let chatSocket = null;

/**
 * Initialize Chat Socket connection
 * @param {String} token - User auth token
 * @returns {Socket} Chat socket instance
 */
export const initializeChatSocket = (token) => {
  if (chatSocket && chatSocket.connected) {
    return chatSocket;
  }

  chatSocket = io(`${SOCKET_URL}/chat`, {
    auth: { token },
    transports: ['polling', 'websocket'],
    reconnection: true,
  });

  chatSocket.on('connect', () => {
    if (import.meta.env.DEV) {
      console.log('✅ Chat Socket connected');
    }
  });

  chatSocket.on('connect_error', (err) => {
    if (import.meta.env.DEV) {
      console.error('🔴 Chat Socket connection error:', err.message);
    }
  });

  return chatSocket;
};

/**
 * Disconnect chat socket
 */
export const disconnectChatSocket = () => {
  if (chatSocket) {
    chatSocket.disconnect();
    chatSocket = null;
  }
};

/**
 * Emit typing status
 * @param {String} conversationId 
 * @param {String} recipientId 
 * @param {Boolean} isTyping 
 */
export const emitTyping = (conversationId, recipientId, isTyping) => {
  if (!chatSocket) return;

  const event = isTyping ? 'typing' : 'stopTyping';
  chatSocket.emit(event, { conversationId, recipientId });
};

/**
 * Listen for new messages
 * @param {Function} callback 
 * @returns {Function} Cleanup
 */
export const onNewMessage = (callback) => {
  if (!chatSocket) return () => { };

  chatSocket.on('newMessage', callback);
  return () => chatSocket.off('newMessage', callback);
};

/**
 * Listen for typing status
 * @param {Function} callback 
 * @returns {Function} Cleanup
 */
export const onTyping = (callback) => {
  if (!chatSocket) return () => { };

  chatSocket.on('typing', callback);
  return () => chatSocket.off('typing', callback);
};

/**
 * Listen for messages read event
 * @param {Function} callback 
 * @returns {Function} Cleanup
 */
export const onMessagesRead = (callback) => {
  if (!chatSocket) return () => { };

  chatSocket.on('messagesRead', callback);
  return () => chatSocket.off('messagesRead', callback);
};

/**
 * Listen for user online status
 * @param {Function} callback 
 * @returns {Function} Cleanup
 */
export const onUserOnline = (callback) => {
  if (!chatSocket) return () => { };

  chatSocket.on('userOnline', callback);
  return () => chatSocket.off('userOnline', callback);
};

/**
 * Listen for user offline status
 * @param {Function} callback 
 * @returns {Function} Cleanup
 */
export const onUserOffline = (callback) => {
  if (!chatSocket) return () => { };

  chatSocket.on('userOffline', callback);
  return () => chatSocket.off('userOffline', callback);
};

/**
 * Listen for message deleted event
 * @param {Function} callback 
 * @returns {Function} Cleanup
 */
export const onMessageDeleted = (callback) => {
  if (!chatSocket) return () => { };

  chatSocket.on('messageDeleted', callback);
  return () => chatSocket.off('messageDeleted', callback);
};

/**
 * Listen for message reaction event
 * @param {Function} callback 
 * @returns {Function} Cleanup
 */
export const onMessageReaction = (callback) => {
  if (!chatSocket) return () => { };

  chatSocket.on('messageReaction', callback);
  return () => chatSocket.off('messageReaction', callback);
};

export default {
  initializeSocket,
  getSocket,
  disconnectSocket,
  isSocketConnected,
  joinAuction,
  leaveAuction,
  watchAuctions,
  getAuctionStatus,
  onNewBid,
  onCountdownUpdate,
  onAuctionEndingSoon,
  onAuctionEnded,
  onAuctionCancelled,
  onAuctionStatusChanged,
  formatTimeRemaining,
  formatTimeRemainingString,
  isAuctionEndingSoon,
  // Chat exports
  initializeChatSocket,
  disconnectChatSocket,
  emitTyping,
  onNewMessage,
  onTyping,
  onMessagesRead,
  onUserOnline,
  onUserOffline,
  onMessageDeleted,
  onMessageReaction
};

