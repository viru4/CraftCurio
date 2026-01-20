/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';

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
  const [quickReplies, setQuickReplies] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  // Initialize chat with greeting
  const initializeChat = useCallback(async () => {
    if (messages.length > 0) return; // Already initialized

    try {
      const response = await axios.get(`${API_URL}/api/chatbot/greeting`);
      
      if (response.data.success) {
        setSessionId(response.data.data.sessionId);
        setMessages([{
          role: 'assistant',
          message: response.data.data.message,
          timestamp: new Date().toISOString()
        }]);
        setQuickReplies(response.data.data.quickReplies || []);
      }
    } catch (error) {
      console.error('Failed to initialize chat:', error);
      setMessages([{
        role: 'assistant',
        message: "Hi! 👋 I'm your CraftCurio assistant. How can I help you today?",
        timestamp: new Date().toISOString()
      }]);
    }
  }, [messages.length, API_URL]);

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
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await axios.post(
        `${API_URL}/api/chatbot/message`,
        {
          message: messageText,
          sessionId: sessionId
        },
        { headers }
      );

      if (response.data.success) {
        const assistantMessage = {
          role: 'assistant',
          message: response.data.data.message,
          timestamp: response.data.data.timestamp,
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
      console.error('Failed to send message:', error);
      
      let errorMessage = "I'm having trouble connecting. Please try again.";
      
      if (error.response?.status === 429) {
        errorMessage = "You're sending messages too quickly. Please wait a moment.";
      } else if (error.response?.status === 503) {
        errorMessage = "The chatbot service is currently unavailable. Please try again later.";
      }

      setMessages(prev => [...prev, {
        role: 'assistant',
        message: errorMessage,
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, API_URL]);

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
    if (!sessionId) return;

    try {
      await axios.delete(`${API_URL}/api/chatbot/history/${sessionId}`);
      setMessages([]);
      setSessionId(null);
      initializeChat();
    } catch (error) {
      console.error('Failed to clear history:', error);
    }
  }, [sessionId, API_URL, initializeChat]);

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
