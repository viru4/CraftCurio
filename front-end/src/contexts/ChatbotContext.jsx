/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback } from 'react';
import api from '@/utils/api';

const ChatbotContext = createContext(null);

const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error('useChatbot must be used within ChatbotProvider');
  }
  return context;
};

const ChatbotProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [quickReplies, setQuickReplies] = useState([
    '🔍 Search Products',
    '🏷️ Browse Auctions',
    '📦 Track My Order',
    '💳 Payment Help',
    '❓ How to Bid',
    '👤 Account Help'
  ]);

  // Initialize chat with greeting
  const initializeChat = useCallback(async () => {
    if (messages.length > 0) return; // Already initialized

    try {
      const response = await api.get('/chatbot/greeting');
      
      if (response.data && response.data.success) {
        setSessionId(response.data.data.sessionId);
        setMessages([{
          role: 'assistant',
          message: response.data.data.message,
          timestamp: new Date().toISOString()
        }]);
        setQuickReplies(response.data.data.quickReplies || []);
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Failed to initialize chat:', error);
      }
      // Fallback greeting if API fails
      setMessages([{
        role: 'assistant',
        message: "Hi! 👋 I'm your CraftCurio assistant. How can I help you today?",
        timestamp: new Date().toISOString()
      }]);
    }
  }, [messages.length]);

  // Send message to chatbot
  const sendMessage = useCallback(async (messageText) => {
    if (!messageText.trim()) return;

    // Add user message to chat
    const userMessage = {
      role: 'user',
      message: messageText,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await api.post('/chatbot/message', {
        message: messageText,
        sessionId: sessionId
      });

      if (response.data && response.data.success) {
        const assistantMessage = {
          role: 'assistant',
          message: response.data.data.message,
          timestamp: response.data.data.timestamp || new Date().toISOString(),
          suggestedActions: response.data.data.suggestedActions,
          products: response.data.data.products
        };

        setMessages(prev => [...prev, assistantMessage]);
        setSessionId(response.data.data.sessionId);
        
        if (response.data.data.quickReplies) {
          setQuickReplies(response.data.data.quickReplies);
        }
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Failed to send message:', error);
        console.error('Error details:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        });
      }
      
      let errorMessage = "I'm having trouble connecting. Please try again.";
      
      if (error.response?.status === 429) {
        errorMessage = "You're sending messages too quickly. Please wait a moment.";
      } else if (error.response?.status === 503) {
        errorMessage = "The chatbot service is currently unavailable. Please try again later.";
      } else if (error.response?.status === 401) {
        errorMessage = "Please refresh the page and try again.";
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }

      setMessages(prev => [...prev, {
        role: 'assistant',
        message: errorMessage,
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  // Send quick reply
  const sendQuickReply = useCallback((reply) => {
    sendMessage(reply);
  }, [sendMessage]);

  // Open chat window
  const openChat = useCallback(() => {
    setIsOpen(true);
    if (messages.length === 0) {
      initializeChat();
    }
  }, [messages.length, initializeChat]);

  // Close chat window
  const closeChat = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Toggle chat window
  const toggleChat = useCallback(() => {
    if (isOpen) {
      closeChat();
    } else {
      openChat();
    }
  }, [isOpen, openChat, closeChat]);

  // Clear chat history
  const clearHistory = useCallback(async () => {
    if (!sessionId) {
      // If no session, just clear local messages
      setMessages([]);
      setSessionId(null);
      initializeChat();
      return;
    }

    try {
      await api.delete(`/chatbot/history/${sessionId}`);
      setMessages([]);
      setSessionId(null);
      initializeChat();
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Failed to clear history:', error);
      }
      // Clear locally even if API call fails
      setMessages([]);
      setSessionId(null);
      initializeChat();
    }
  }, [sessionId, initializeChat]);

  const value = {
    isOpen,
    messages,
    isLoading,
    quickReplies,
    sendMessage,
    sendQuickReply,
    openChat,
    closeChat,
    toggleChat,
    clearHistory
  };

  return (
    <ChatbotContext.Provider value={value}>
      {children}
    </ChatbotContext.Provider>
  );
};

export { ChatbotProvider, useChatbot };
