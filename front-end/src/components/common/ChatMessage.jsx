import React from 'react';
import { formatDistanceToNow } from 'date-fns';

const ChatMessage = ({ message, isUser }) => {
  const { message: text, timestamp, suggestedActions, products } = message;

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[80%] ${isUser ? 'order-2' : 'order-1'}`}>
        {/* Message Bubble */}
        <div
          className={`rounded-lg px-4 py-3 ${
            isUser
              ? 'bg-blue-600 text-white rounded-br-none'
              : 'bg-gray-100 text-gray-900 rounded-bl-none'
          }`}
        >
          <p className="text-sm whitespace-pre-wrap break-words">{text}</p>
        </div>

        {/* Timestamp */}
        <div
          className={`text-xs text-gray-500 mt-1 px-1 ${
            isUser ? 'text-right' : 'text-left'
          }`}
        >
          {timestamp && formatDistanceToNow(new Date(timestamp), { addSuffix: true })}
        </div>

        {/* Suggested Actions (only for assistant messages) */}
        {!isUser && suggestedActions && suggestedActions.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {suggestedActions.map((action, idx) => (
              <button
                key={idx}
                className="text-xs bg-white border border-gray-300 text-gray-700 px-3 py-1 rounded-full hover:bg-gray-50 transition-colors"
                onClick={() => {
                  // Handle action click - you can expand this
                  console.log('Action clicked:', action);
                }}
              >
                {action}
              </button>
            ))}
          </div>
        )}

        {/* Product Cards (only for assistant messages with products) */}
        {!isUser && products && products.length > 0 && (
          <div className="mt-3 space-y-2">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => {
                  // Navigate to product page
                  window.location.href = `/products/${product._id}`;
                }}
              >
                <div className="flex gap-3">
                  {product.images?.[0] && (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-gray-900 truncate">
                      {product.name}
                    </h4>
                    <p className="text-xs text-gray-600 line-clamp-2 mt-1">
                      {product.description}
                    </p>
                    <p className="text-sm font-bold text-blue-600 mt-1">
                      ₹{product.price}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Avatar */}
      <div
        className={`flex-shrink-0 ${
          isUser ? 'order-1 ml-2' : 'order-2 mr-2'
        }`}
      >
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold ${
            isUser ? 'bg-blue-600' : 'bg-gray-600'
          }`}
        >
          {isUser ? 'U' : '🤖'}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
