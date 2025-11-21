import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, X } from 'lucide-react';
import { API_ENDPOINTS } from '@/config/api';
import ArtisanSidebar from '../components/ArtisanSidebar';
import ConversationsList from './components/ConversationsList';
import ChatArea from './components/ChatArea';

/**
 * Message Component (Main Container)
 * Manages messaging state and renders conversations list + chat area
 * Handles real-time updates, message sending, and responsive layout
 */
const Message = () => {
  const { user, isArtisan, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  // UI State
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [conversationsOpen, setConversationsOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Data State
  const [conversations, setConversations] = useState([]);
  const [messagesData, setMessagesData] = useState({});

  // Auth check
  useEffect(() => {
    if (authLoading) return;
    if (!user || !isArtisan) {
      navigate('/');
    }
  }, [user, isArtisan, navigate, authLoading]);

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
      setConversations(data.conversations || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages for a conversation
  const fetchMessages = async (conversationId) => {
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
    
    // Fetch messages if not already loaded
    if (!messagesData[conversationId]) {
      fetchMessages(conversationId);
    }
    
    // Mark messages as read
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
    ));
  }, [messagesData]);

  // Handle sending message
  const handleSendMessage = useCallback(async (text) => {
    if (!activeConversationId || !text.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.messages, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          conversationId: activeConversationId,
          text: text.trim()
        })
      });

      if (!response.ok) throw new Error('Failed to send message');

      const data = await response.json();
      const newMessage = data.message;

      // Add message to messages data
      setMessagesData(prev => ({
        ...prev,
        [activeConversationId]: [...(prev[activeConversationId] || []), newMessage],
      }));

      // Update conversation last message
      setConversations(prev => prev.map(conv => 
        conv.id === activeConversationId 
          ? { ...conv, lastMessage: text.trim(), lastMessageTime: new Date() }
          : conv
      ));
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    }
  }, [activeConversationId]);

  // Handle deleting message
  const handleDeleteMessage = useCallback(async (messageId) => {
    if (!activeConversationId) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_ENDPOINTS.messages}/${messageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to delete message');

      setMessagesData(prev => ({
        ...prev,
        [activeConversationId]: prev[activeConversationId].filter(msg => msg.id !== messageId),
      }));
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Failed to delete message. Please try again.');
    }
  }, [activeConversationId]);

  // Handle message reaction
  const handleReactToMessage = useCallback(async (messageId, emoji) => {
    if (!activeConversationId) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_ENDPOINTS.messages}/${messageId}/react`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ emoji })
      });

      if (!response.ok) throw new Error('Failed to add reaction');

      setMessagesData(prev => ({
        ...prev,
        [activeConversationId]: prev[activeConversationId].map(msg => 
          msg.id === messageId 
            ? { ...msg, reactions: [...(msg.reactions || []), emoji] }
            : msg
        ),
      }));
    } catch (error) {
      console.error('Error adding reaction:', error);
    }
  }, [activeConversationId]);

  // Handle typing indicator
  const handleTyping = useCallback((isTyping) => {
    if (!activeConversationId) return;
    // TODO: Send typing status to backend via WebSocket
    console.log('Typing:', isTyping);
  }, [activeConversationId]);

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
            className={`${
              conversationsOpen ? 'flex' : 'hidden'
            } md:flex flex-col w-full md:w-80 lg:w-96 border-r border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 absolute md:relative inset-0 md:inset-auto z-20 md:z-0`}
          >
            <ConversationsList
              conversations={conversations}
              activeConversation={activeConversationId}
              onSelectConversation={handleSelectConversation}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
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
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Message;
