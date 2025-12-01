import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { Menu, X } from 'lucide-react';
import { API_ENDPOINTS } from '../../../utils/api';
import ConversationsList from '../../artisans/artisanDashboard/messaging/components/ConversationsList';
import ChatArea from '../../artisans/artisanDashboard/messaging/components/ChatArea';
import {
    initializeChatSocket,
    disconnectChatSocket,
    emitTyping,
    onNewMessage,
    onTyping,
    onMessagesRead,
    onUserOnline,
    onUserOffline
} from '../../../utils/socket';

/**
 * UserMessages Component
 * Messaging interface for Buyers/Collectors within their profile
 */
const UserMessages = () => {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // UI State
    const [conversationsOpen, setConversationsOpen] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeConversationId, setActiveConversationId] = useState(null);
    const [loading, setLoading] = useState(true);

    // Data State
    const [conversations, setConversations] = useState([]);
    const [messagesData, setMessagesData] = useState({});
    const [onlineUsers, setOnlineUsers] = useState(new Set());
    const [typingUsers, setTypingUsers] = useState({});

    // Refs for socket cleanup
    const socketInitialized = useRef(false);

    // Initialize Socket
    useEffect(() => {
        if (user && !socketInitialized.current) {
            const token = localStorage.getItem('token');
            initializeChatSocket(token);
            socketInitialized.current = true;

            // Socket Event Listeners
            const cleanupNewMessage = onNewMessage((message) => {
                setMessagesData(prev => {
                    const conversationId = message.conversationId;
                    const currentMessages = prev[conversationId] || [];
                    // Avoid duplicates
                    if (currentMessages.some(m => m._id === message._id)) return prev;
                    return {
                        ...prev,
                        [conversationId]: [...currentMessages, message]
                    };
                });

                // Update conversations list (last message, unread count)
                setConversations(prev => {
                    const convIndex = prev.findIndex(c => c.id === message.conversationId);
                    if (convIndex === -1) {
                        fetchConversations();
                        return prev;
                    }

                    const updatedConvs = [...prev];
                    const conv = updatedConvs[convIndex];
                    updatedConvs[convIndex] = {
                        ...conv,
                        lastMessage: message.text || (message.attachments?.length ? 'Attachment' : ''),
                        lastMessageTime: message.createdAt,
                        unreadCount: activeConversationId === message.conversationId ? 0 : (conv.unreadCount || 0) + 1
                    };

                    // Move to top
                    updatedConvs.sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));
                    return updatedConvs;
                });
            });

            const cleanupTyping = onTyping(({ conversationId, userId, isTyping }) => {
                setTypingUsers(prev => ({
                    ...prev,
                    [conversationId]: {
                        ...prev[conversationId],
                        [userId]: isTyping
                    }
                }));
            });

            const cleanupOnline = onUserOnline(({ userId }) => {
                setOnlineUsers(prev => new Set(prev).add(userId));
            });

            const cleanupOffline = onUserOffline(({ userId }) => {
                setOnlineUsers(prev => {
                    const next = new Set(prev);
                    next.delete(userId);
                    return next;
                });
            });

            return () => {
                cleanupNewMessage();
                cleanupTyping();
                cleanupOnline();
                cleanupOffline();
                disconnectChatSocket();
                socketInitialized.current = false;
            };
        }
    }, [user, activeConversationId]);

    // Fetch conversations on mount
    useEffect(() => {
        if (user) {
            fetchConversations();
        }
    }, [user]);

    // Fetch conversations from API
    const fetchConversations = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            
            // Read recipient info from URL query parameters
            const searchParams = new URLSearchParams(location.search);
            const recipientId = searchParams.get('recipientId');
            const recipientName = searchParams.get('recipientName');
            const recipientImage = searchParams.get('recipientImage');
            
            console.log('🔍 URL params:', { recipientId, recipientName, recipientImage });
            console.log('🔍 User info:', { userId: user?._id, userName: user?.name });
            
            const response = await fetch(`${API_ENDPOINTS.messages}/conversations`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error('Failed to fetch conversations');

            const data = await response.json();
            let fetchedConversations = data.conversations || [];

            // Handle new conversation from URL parameters
            if (recipientId && recipientName) {
                console.log('📩 Creating new conversation with:', { recipientId, recipientName, recipientImage });

                // Check if conversation already exists
                const existingConv = fetchedConversations.find(c =>
                    c.participants.some(p => p._id === recipientId || p.id === recipientId)
                );

                if (existingConv) {
                    console.log('✅ Found existing conversation:', existingConv.id);
                    setActiveConversationId(existingConv.id);
                } else {
                    console.log('🆕 Creating new temporary conversation');
                    // Create temporary conversation object with user property for ChatArea
                    const newConv = {
                        id: 'new',
                        user: {
                            _id: recipientId,
                            id: recipientId,
                            name: recipientName,
                            profileImage: recipientImage,
                            online: false
                        },
                        participants: [
                            {
                                _id: recipientId,
                                id: recipientId,
                                name: recipientName,
                                profileImage: recipientImage
                            },
                            {
                                _id: user._id,
                                id: user._id,
                                name: user.name,
                                profileImage: user.profileImage
                            }
                        ],
                        lastMessage: '',
                        lastMessageTime: new Date().toISOString(),
                        unreadCount: 0
                    };
                    console.log('📝 New conversation object:', newConv);
                    fetchedConversations = [newConv, ...fetchedConversations];
                    setActiveConversationId('new');
                }
            }

            setConversations(fetchedConversations);
            console.log('💬 Total conversations:', fetchedConversations.length);
        } catch (error) {
            console.error('Error fetching conversations:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch messages for a conversation
    const fetchMessages = async (conversationId) => {
        if (conversationId === 'new') {
            setMessagesData(prev => ({ ...prev, new: [] }));
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_ENDPOINTS.messages}/${conversationId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error('Failed to fetch messages');

            const data = await response.json();
            setMessagesData(prev => ({
                ...prev,
                [conversationId]: data.messages || []
            }));
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    // Fetch messages when active conversation changes
    useEffect(() => {
        if (activeConversationId) {
            fetchMessages(activeConversationId);
        }
    }, [activeConversationId]);

    // Close conversations sidebar on mobile when a conversation is selected
    useEffect(() => {
        if (activeConversationId && window.innerWidth < 768) {
            setConversationsOpen(false);
        }
    }, [activeConversationId]);

    // Get active conversation
    const activeConversation = conversations.find(c => c.id === activeConversationId);

    // Get messages for active conversation
    const activeMessages = messagesData[activeConversationId] || [];

    // Handle conversation selection
    const handleSelectConversation = useCallback((conversationId) => {
        setActiveConversationId(conversationId);

        // Mark messages as read locally
        setConversations(prev => prev.map(conv =>
            conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
        ));
    }, []);

    // Handle Send Message
    const handleSendMessage = async (text, attachments = []) => {
        if (!text.trim() && attachments.length === 0) return;

        const token = localStorage.getItem('token');
        let recipientId;
        let conversationId = activeConversationId;

        if (activeConversationId === 'new') {
            recipientId = activeConversation.participants[0]._id;
        } else {
            const recipient = activeConversation.participants.find(p => p._id !== user._id);
            recipientId = recipient?._id;
        }

        try {
            const response = await fetch(API_ENDPOINTS.messages, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    recipientId,
                    text,
                    attachments
                })
            });

            if (!response.ok) throw new Error('Failed to send message');

            const data = await response.json();
            const newMessage = data.message;

            if (activeConversationId === 'new') {
                const newConvId = data.conversationId || newMessage.conversationId;
                setActiveConversationId(newConvId);
                setConversations(prev => prev.map(c => c.id === 'new' ? { ...c, id: newConvId } : c));
                setMessagesData(prev => {
                    const { new: newMsgs, ...rest } = prev;
                    return { ...rest, [newConvId]: [...(newMsgs || []), newMessage] };
                });
            } else {
                setMessagesData(prev => ({
                    ...prev,
                    [conversationId]: [...(prev[conversationId] || []), newMessage]
                }));
            }

            setConversations(prev => {
                const updated = prev.map(c => {
                    if (c.id === conversationId || (conversationId === 'new' && c.id === 'new')) {
                        return {
                            ...c,
                            lastMessage: text || 'Attachment',
                            lastMessageTime: new Date().toISOString()
                        };
                    }
                    return c;
                });
                return updated.sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));
            });

        } catch (error) {
            console.error('Error sending message:', error);
            alert('Failed to send message');
        }
    };

    // Handle Delete Message
    const handleDeleteMessage = async (messageId) => {
        setMessagesData(prev => ({
            ...prev,
            [activeConversationId]: prev[activeConversationId].filter(m => m._id !== messageId)
        }));

        try {
            const token = localStorage.getItem('token');
            await fetch(`${API_ENDPOINTS.messages}/${messageId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        } catch (error) {
            console.error('Error deleting message:', error);
            fetchMessages(activeConversationId);
        }
    };

    // Handle React to Message
    const handleReactToMessage = async (messageId, reaction) => {
        setMessagesData(prev => ({
            ...prev,
            [activeConversationId]: prev[activeConversationId].map(m =>
                m._id === messageId
                    ? { ...m, reactions: { ...m.reactions, [user._id]: reaction } }
                    : m
            )
        }));

        try {
            const token = localStorage.getItem('token');
            await fetch(`${API_ENDPOINTS.messages}/${messageId}/react`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ reaction })
            });
        } catch (error) {
            console.error('Error reacting to message:', error);
        }
    };

    // Handle Typing
    const handleTyping = (isTyping) => {
        if (!activeConversation || activeConversation.id === 'new') return;

        const recipient = activeConversation.participants.find(p => p._id !== user._id);
        if (recipient) {
            emitTyping(activeConversation.id, recipient._id, isTyping);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] bg-white rounded-lg shadow-sm border border-stone-200 overflow-hidden">
            <div className="flex-1 flex overflow-hidden">
                {/* Conversations Sidebar */}
                <div
                    className={`${conversationsOpen ? 'flex' : 'hidden'
                        } md:flex flex-col w-full md:w-80 border-r border-stone-200 bg-white absolute md:relative inset-0 md:inset-auto z-20 md:z-0`}
                >
                    <ConversationsList
                        conversations={conversations}
                        activeConversation={activeConversationId}
                        onSelectConversation={handleSelectConversation}
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        onlineUsers={onlineUsers}
                        typingUsers={typingUsers}
                    />
                </div>

                {/* Chat Area */}
                <div className={`flex-1 ${conversationsOpen ? 'hidden md:flex' : 'flex'} flex-col`}>
                    {activeConversationId ? (
                        <ChatArea
                            conversation={activeConversation}
                            messages={activeMessages}
                            currentUserId={user?._id}
                            onSendMessage={handleSendMessage}
                            onDeleteMessage={handleDeleteMessage}
                            onReactToMessage={handleReactToMessage}
                            onTyping={handleTyping}
                            isTyping={typingUsers[activeConversationId] && Object.values(typingUsers[activeConversationId]).some(v => v)}
                            onBack={() => setConversationsOpen(true)} // Add back button for mobile
                        />
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-stone-500">
                            Select a conversation to start messaging
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserMessages;
