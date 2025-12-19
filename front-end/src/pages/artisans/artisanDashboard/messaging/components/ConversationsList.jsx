import { Search, MessageCircle } from 'lucide-react';
import { useMemo } from 'react';

/**
 * ConversationsList Component
 * Displays list of conversations with search functionality
 * Shows user avatar, name, last message preview, and timestamp
 */
const ConversationsList = ({ 
  conversations, 
  activeConversation, 
  onSelectConversation, 
  searchQuery, 
  onSearchChange,
  onlineUsers = new Set(),
  typingUsers = {}
}) => {
  
  // Filter conversations based on search query
  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    
    const query = searchQuery.toLowerCase();
    return conversations.filter(conv => 
      conv?.user?.name?.toLowerCase().includes(query) ||
      conv?.lastMessage?.toLowerCase().includes(query)
    );
  }, [conversations, searchQuery]);

  // Format timestamp to show relative time
  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffMs = now - messageTime;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDate(messageTime);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Search Bar */}
      <div className="p-3 sm:p-4 border-b border-stone-200 dark:border-stone-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search conversations..."
            className="w-full pl-10 pr-4 py-2 text-sm border border-stone-300 dark:border-stone-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec6d13]/50 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <MessageCircle className="h-12 w-12 text-stone-300 dark:text-stone-600 mb-3" />
            <p className="text-sm text-stone-500 dark:text-stone-400">
              {searchQuery ? 'No conversations found' : 'No messages yet'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-stone-200 dark:divide-stone-700">
            {filteredConversations
              .filter(conversation => conversation && conversation.user) // Filter out invalid conversations
              .map((conversation) => {
              const isOnline = onlineUsers.has(conversation.user?.id || conversation.user?._id);
              const isTyping = typingUsers[conversation.id] && Object.values(typingUsers[conversation.id]).some(v => v);
              
              return (
                <button
                  key={conversation.id}
                  onClick={() => onSelectConversation(conversation.id)}
                  className={`w-full p-3 sm:p-4 flex items-start gap-3 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors ${
                    activeConversation === conversation.id 
                      ? 'bg-[#ec6d13]/10 dark:bg-[#ec6d13]/20' 
                      : ''
                  }`}
                >
                  {/* User Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gradient-to-br from-[#ec6d13] to-[#d87a5b] flex items-center justify-center text-white font-semibold">
                      {conversation.user.name.charAt(0).toUpperCase()}
                    </div>
                    {isOnline && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white dark:border-stone-900 rounded-full" />
                    )}
                  </div>

                  {/* Conversation Info */}
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-baseline justify-between gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100 truncate">
                        {conversation.user.name}
                      </h3>
                      <span className="text-xs text-stone-500 dark:text-stone-400 flex-shrink-0">
                        {formatTimestamp(conversation.lastMessageTime)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs text-stone-600 dark:text-stone-400 truncate">
                        {isTyping ? (
                          <span className="italic text-[#ec6d13]">typing...</span>
                        ) : (
                          conversation.lastMessage || 'No messages yet'
                        )}
                      </p>
                      {conversation.unreadCount > 0 && (
                        <span className="flex-shrink-0 h-5 w-5 rounded-full bg-[#ec6d13] text-white text-xs flex items-center justify-center font-semibold">
                          {conversation.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationsList;
