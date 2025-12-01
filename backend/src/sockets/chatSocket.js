import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Store the chat namespace instance
let chatNamespaceInstance = null;

/**
 * Get the chat namespace instance
 * @returns {Namespace|null}
 */
export const getChatNamespace = () => {
    return chatNamespaceInstance;
};

/**
 * Initialize Chat Socket Handlers
 * @param {Server} io - Socket.io server instance
 */
export const initializeChatSockets = (io) => {
    const chatNamespace = io.of('/chat');
    chatNamespaceInstance = chatNamespace;

    // Middleware for authentication
    chatNamespace.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;

            if (!token) {
                return next(new Error('Authentication error: Token required'));
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userId = decoded.sub || decoded.id;
            const user = await User.findById(userId).select('-password');

            if (!user) {
                return next(new Error('Authentication error: User not found'));
            }

            socket.user = user;
            next();
        } catch (error) {
            next(new Error('Authentication error: Invalid token'));
        }
    });

    chatNamespace.on('connection', (socket) => {
        console.log(`✅ User connected to chat: ${socket.user.name} (${socket.user._id})`);

        // Join user's personal room for direct messages
        socket.join(socket.user._id.toString());

        // Broadcast online status
        onlineUsers.add(socket.user._id.toString());
        socket.broadcast.emit('userOnline', { userId: socket.user._id });

        // Handle typing events
        socket.on('typing', ({ conversationId, recipientId }) => {
            socket.to(recipientId).emit('typing', {
                conversationId,
                userId: socket.user._id,
                isTyping: true
            });
        });

        socket.on('stopTyping', ({ conversationId, recipientId }) => {
            socket.to(recipientId).emit('typing', {
                conversationId,
                userId: socket.user._id,
                isTyping: false
            });
        });

        // Handle disconnection
        socket.on('disconnect', () => {
            console.log(`❌ User disconnected from chat: ${socket.user.name}`);
            onlineUsers.delete(socket.user._id.toString());
            socket.broadcast.emit('userOffline', { userId: socket.user._id });
        });
    });

    return chatNamespace;
};

/**
 * Check if a user is online in chat
 * @param {string} userId 
 * @returns {boolean}
 */
export const isUserOnline = (userId) => {
    // This is a simplified check. In a real scaled app, you'd use Redis.
    // For this single instance, we can check if the user has joined their room.
    // However, accessing io instance here is tricky without passing it.
    // A better approach for single instance: maintain a local Set of online user IDs.
    return onlineUsers.has(userId.toString());
};

const onlineUsers = new Set();
