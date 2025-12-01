import { Send, Smile, Trash2, ThumbsUp, Check, CheckCheck } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import EmojiPicker from './EmojiPicker';

/**
 * ChatArea Component
 * Displays the active conversation with messages in speech bubbles
 * Includes message input, emoji picker, and message actions
 */
const ChatArea = ({ 
  conversation, 
  messages, 
  currentUserId,
  onSendMessage, 
  onDeleteMessage,
  onReactToMessage,
  onTyping,
  isTyping = false
}) => {
  const [messageText, setMessageText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Smooth scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle typing indicator
  const handleTyping = () => {
    onTyping(true);
    
    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      onTyping(false);
    }, 2000);
  };

  // Handle message text change
  const handleMessageChange = (e) => {
    setMessageText(e.target.value);
    handleTyping();
    autoResizeTextarea();
  };

  // Auto-resize textarea based on content
  const autoResizeTextarea = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  };

  // Send message
  const handleSendMessage = () => {
    const trimmedMessage = messageText.trim();
    if (!trimmedMessage) return;

    onSendMessage(trimmedMessage);
    setMessageText('');
    onTyping(false);
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  // Handle Enter key (Shift+Enter for new line)
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Add emoji to message
  const handleEmojiSelect = (emoji) => {
    setMessageText(prev => prev + emoji);
    setShowEmojiPicker(false);
    textareaRef.current?.focus();
  };

  // Format message timestamp
  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // Group messages by date
  const groupMessagesByDate = (messages) => {
    const groups = {};
    
    messages.forEach(message => {
      const date = new Date(message.timestamp).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    
    return groups;
  };

  const messageGroups = groupMessagesByDate(messages);

  if (!conversation) {
    return (
      <div className="flex items-center justify-center h-full bg-stone-50 dark:bg-stone-900">
        <div className="text-center">
          <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-stone-200 dark:bg-stone-700 flex items-center justify-center">
            <Send className="h-8 w-8 text-stone-400 dark:text-stone-500" />
          </div>
          <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-2">
            Select a conversation
          </h3>
          <p className="text-sm text-stone-500 dark:text-stone-400">
            Choose a conversation from the list to start messaging
          </p>
        </div>
      </div>
    );
  }

  // Safety check for conversation.user
  if (!conversation.user) {
    console.error('Conversation missing user object:', conversation);
    return (
      <div className="flex items-center justify-center h-full bg-stone-50 dark:bg-stone-900">
        <div className="text-center">
          <p className="text-sm text-red-500">Error: Invalid conversation data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-stone-900">
      {/* Chat Header */}
      <div className="flex items-center gap-3 p-3 sm:p-4 border-b border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900">
        <div className="relative">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#ec6d13] to-[#d87a5b] flex items-center justify-center text-white font-semibold">
            {conversation.user.name.charAt(0).toUpperCase()}
          </div>
          {conversation.user.online && (
            <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white dark:border-stone-900 rounded-full" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-sm sm:text-base font-semibold text-stone-900 dark:text-stone-100 truncate">
            {conversation.user.name}
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            {conversation.user.online ? 'Online' : 'Offline'}
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-6 scrollbar-thin">
        {Object.entries(messageGroups).map(([date, dateMessages]) => (
          <div key={date}>
            {/* Date Divider */}
            <div className="flex items-center justify-center my-4">
              <span className="px-3 py-1 text-xs font-medium text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-800 rounded-full">
                {date}
              </span>
            </div>

            {/* Messages */}
            <div className="space-y-3">
              {dateMessages.map((message) => {
                const isOwnMessage = message.senderId === currentUserId;
                
                return (
                  <div
                    key={message.id}
                    className={`flex items-end gap-2 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    {/* Avatar for received messages */}
                    {!isOwnMessage && (
                      <div className="h-7 w-7 rounded-full bg-gradient-to-br from-[#ec6d13] to-[#d87a5b] flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                        {conversation.user.name.charAt(0).toUpperCase()}
                      </div>
                    )}

                    {/* Message Bubble */}
                    <div className={`group relative max-w-[75%] sm:max-w-[60%] ${isOwnMessage ? 'items-end' : 'items-start'}`}>
                      <div
                        className={`px-3 sm:px-4 py-2 rounded-2xl ${
                          isOwnMessage
                            ? 'bg-[#ec6d13] text-white rounded-br-sm'
                            : 'bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 rounded-bl-sm'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap break-words">
                          {message.text}
                        </p>
                        
                        {/* Message Reactions */}
                        {message.reactions && message.reactions.length > 0 && (
                          <div className="flex items-center gap-1 mt-1 -mb-1">
                            {message.reactions.map((reaction, idx) => (
                              <span key={idx} className="text-xs">
                                {reaction}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Message Meta (Time + Read Status) */}
                      <div className={`flex items-center gap-1 mt-1 text-xs text-stone-500 dark:text-stone-400 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                        <span>{formatMessageTime(message.timestamp)}</span>
                        {isOwnMessage && (
                          <span>
                            {message.read ? (
                              <CheckCheck className="h-3 w-3 text-blue-500" />
                            ) : (
                              <Check className="h-3 w-3" />
                            )}
                          </span>
                        )}
                      </div>

                      {/* Message Actions (show on hover) */}
                      <div className={`absolute top-0 ${isOwnMessage ? 'left-0 -translate-x-full' : 'right-0 translate-x-full'} opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 px-2`}>
                        <button
                          onClick={() => onReactToMessage(message.id, '👍')}
                          className="p-1 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-full transition-colors"
                          title="React"
                        >
                          <ThumbsUp className="h-3 w-3 text-stone-600 dark:text-stone-400" />
                        </button>
                        {isOwnMessage && (
                          <button
                            onClick={() => onDeleteMessage(message.id)}
                            className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-3 w-3 text-red-600 dark:text-red-400" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex items-end gap-2">
            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-[#ec6d13] to-[#d87a5b] flex items-center justify-center text-white text-xs font-semibold">
              {conversation.user.name.charAt(0).toUpperCase()}
            </div>
            <div className="px-4 py-2 bg-stone-100 dark:bg-stone-800 rounded-2xl rounded-bl-sm">
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 bg-stone-400 dark:bg-stone-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="h-2 w-2 bg-stone-400 dark:bg-stone-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="h-2 w-2 bg-stone-400 dark:bg-stone-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-3 sm:p-4 border-t border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900">
        <div className="flex items-end gap-2">
          {/* Emoji Picker Button */}
          <div className="relative">
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
              title="Add emoji"
            >
              <Smile className="h-5 w-5 text-stone-600 dark:text-stone-400" />
            </button>
            
            {showEmojiPicker && (
              <div className="absolute bottom-full left-0 mb-2">
                <EmojiPicker 
                  onSelect={handleEmojiSelect}
                  onClose={() => setShowEmojiPicker(false)}
                />
              </div>
            )}
          </div>

          {/* Text Input */}
          <textarea
            ref={textareaRef}
            value={messageText}
            onChange={handleMessageChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={1}
            className="flex-1 px-3 sm:px-4 py-2 text-sm border border-stone-300 dark:border-stone-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec6d13]/50 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 resize-none overflow-y-auto scrollbar-thin"
            style={{ maxHeight: '120px' }}
          />

          {/* Send Button */}
          <button
            onClick={handleSendMessage}
            disabled={!messageText.trim()}
            className="p-2 sm:p-2.5 bg-[#ec6d13] hover:bg-[#d87a5b] disabled:bg-stone-300 dark:disabled:bg-stone-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            title="Send message"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
        
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
};

export default ChatArea;
