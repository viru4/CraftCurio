import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, X } from 'lucide-react';
import { API_ENDPOINTS } from '@/utils/api';
import ArtisanSidebar from '../components/ArtisanSidebar';
import ConversationsList from './components/ConversationsList';
import ChatArea from './components/ChatArea';
import {
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
} from '@/utils/socket';

/**
 * Message Component (Main Container)
 * Manages messaging state and renders conversations list + chat area
 * Handles real-time updates, message sending, and responsive layout
 */
const Message = () => {
  const { user, isArtisan, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // UI State
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  // Helper function to ensure conversation has user property
  const normalizeConversation = useCallback((conv) => {
    // If conversation already has user property, return as is
    if (conv.user) return conv;
    
    // If conversation has participants, extract the other user
    if (conv.participants && Array.isArray(conv.participants) && conv.participants.length > 0) {
      const otherUser = conv.participants.find(p => p._id !== user?._id) || conv.participants[0];
      return {
        ...conv,
        user: {
          _id: otherUser._id,
          id: otherUser._id,
          name: otherUser.name,
          email: otherUser.email,
          role: otherUser.role,
          profilePhotoUrl: otherUser.profilePhotoUrl,
          online: false
        }
      };
    }
    
    // If we can't normalize, return as is (will be filtered out later)
    return conv;
  }, [user]);

  // Auth check
  useEffect(() => {
    if (authLoading) return;
    if (!user || !isArtisan) {
      navigate('/');
    }
  }, [user, isArtisan, navigate, authLoading]);

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
            // New conversation - fetch it or add placeholder if we have details
            // For now, just re-fetch all conversations to be safe
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

      const cleanupMessageDeleted = onMessageDeleted(({ messageId, conversationId }) => {
        setMessagesData(prev => ({
          ...prev,
          [conversationId]: (prev[conversationId] || []).filter(msg => msg.id !== messageId)
        }));
      });

      const cleanupMessageReaction = onMessageReaction(({ messageId, emoji, reactions }) => {
        setMessagesData(prev => {
          const updatedData = { ...prev };
          Object.keys(updatedData).forEach(convId => {
            updatedData[convId] = updatedData[convId].map(msg =>
              msg.id === messageId ? { ...msg, reactions } : msg
            );
          });
          return updatedData;
        });
      });

      return () => {
        cleanupNewMessage();
        cleanupTyping();
        cleanupOnline();
        cleanupOffline();
        cleanupMessageDeleted();
        cleanupMessageReaction();
        disconnectChatSocket();
        socketInitialized.current = false;
      };
    }
  }, [user, activeConversationId]);

  // Handle new conversation from navigation state
  useEffect(() => {
    if (location.state?.recipientId && !loading) {
      const { recipientId, recipientName, recipientImage } = location.state;

      // Normalize all existing conversations first
      const normalizedExisting = conversations.map(normalizeConversation);

      // Check if conversation already exists
      const existingConv = normalizedExisting.find(c => {
        // Check in user object if it exists
        if (c.user) {
          return c.user._id === recipientId || c.user.id === recipientId;
        }
        return false;
      });

      if (existingConv) {
        setActiveConversationId(existingConv.id);
        // Update conversations with normalized versions
        setConversations(normalizedExisting);
      } else {
        // Create temporary conversation object
        const tempConv = {
          id: 'new',
          user: {
            _id: recipientId,
            id: recipientId,
            name: recipientName,
            profilePhotoUrl: recipientImage,
            online: false
          },
          participants: [{
            _id: recipientId,
            name: recipientName,
            profilePhotoUrl: recipientImage
          }],
          lastMessage: '',
          lastMessageTime: new Date(),
          unreadCount: 0
        };
        setConversations([tempConv, ...normalizedExisting]);
        setActiveConversationId('new');
      }

      // Clear state to prevent reopening on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state, loading, conversations, normalizeConversation]);

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
      const response = await fetch(`${API_ENDPOINTS.messages}/conversations`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to fetch conversations');

      const data = await response.json();
      console.log('Fetched conversations from API:', data.conversations);
      
      // Normalize all conversations to ensure they have user property
      const normalizedConversations = (data.conversations || []).map(normalizeConversation);
      setConversations(normalizedConversations);
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

  // Get active conversation with enhanced online status
  const activeConversation = useMemo(() => {
    const conv = conversations.find(c => c.id === activeConversationId);
    if (!conv) {
      console.log('No conversation found for ID:', activeConversationId);
      return null;
    }
    
    console.log('Active conversation found:', conv);
    
    // Ensure user object exists
    if (!conv.user) {
      console.error('Conversation missing user object:', conv);
      // Return null to prevent errors - ChatArea will handle this
      return null;
    }
    
    // Enhance conversation with real-time online status
    return {
      ...conv,
      user: {
        ...conv.user,
        online: onlineUsers.has(conv.user.id || conv.user._id)
      }
    };
  }, [conversations, activeConversationId, onlineUsers]);

  // Get messages for active conversation
  const activeMessages = messagesData[activeConversationId] || [];

  // Handle conversation selection
  const handleSelectConversation = useCallback((conversationId) => {
    setActiveConversationId(conversationId);

    // Mark messages as read locally
    setConversations(prev => prev.map(conv =>
      conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
    ));

    // API call to mark as read would go here
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
      // Find recipient in existing conversation (not current user)
      const recipient = activeConversation.participants.find(p => p._id !== user._id);
      recipientId = recipient?._id;
    }

    try {
      const response = await fetch(`${API_ENDPOINTS.messages}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          recipientId,
          text,
          conversationId: activeConversationId !== 'new' ? activeConversationId : undefined
        })
      });

      if (!response.ok) throw new Error('Failed to send message');

      const data = await response.json();
      const newMessage = data.message;

      // If this was a new conversation, update ID
      if (activeConversationId === 'new') {
        const newConvId = data.conversationId;
        setActiveConversationId(newConvId);
        setConversations(prev => prev.map(c => c.id === 'new' ? { ...c, id: newConvId } : c));
        // Update messages data key
        setMessagesData(prev => {
          const { new: newMsgs, ...rest } = prev;
          return { ...rest, [newConvId]: [...(newMsgs || []), newMessage] };
        });
      } else {
        // Optimistic update (or wait for socket)
        // Socket listener will handle appending, but for immediate feedback:
        setMessagesData(prev => ({
          ...prev,
          [conversationId]: [...(prev[conversationId] || []), newMessage]
        }));
      }

      // Update conversation list
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
    // Optimistic update
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
      // Revert if failed (could implement better rollback)
      fetchMessages(activeConversationId);
    }
  };

  // Handle React to Message
  const handleReactToMessage = async (messageId, reaction) => {
    // Optimistic update
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
    <div className="flex min-h-screen bg-stone-50 dark:bg-stone-900">
      {/* Artisan Sidebar */}
      <ArtisanSidebar user={user} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
          >
            <Menu className="h-6 w-6 text-stone-600 dark:text-stone-400" />
          </button>
          <h1 className="text-lg font-bold text-stone-900 dark:text-stone-100">Messages</h1>
          <button
            onClick={() => setConversationsOpen(!conversationsOpen)}
            className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors md:hidden"
          >
            {conversationsOpen ? (
              <X className="h-6 w-6 text-stone-600 dark:text-stone-400" />
            ) : (
              <Menu className="h-6 w-6 text-stone-600 dark:text-stone-400" />
            )}
          </button>
        </div>

        {/* Messages Layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Conversations Sidebar */}
          <div
            className={`${conversationsOpen ? 'flex' : 'hidden'
              } md:flex flex-col w-full md:w-80 lg:w-96 border-r border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 absolute md:relative inset-0 md:inset-auto z-20 md:z-0`}
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
            <ChatArea
              conversation={activeConversation}
              messages={activeMessages}
              currentUserId={user?._id}
              onSendMessage={handleSendMessage}
              onDeleteMessage={handleDeleteMessage}
              onReactToMessage={handleReactToMessage}
              onTyping={handleTyping}
              isTyping={typingUsers[activeConversationId] && Object.values(typingUsers[activeConversationId]).some(v => v)}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Message;
