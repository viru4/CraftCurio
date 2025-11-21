import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';

/**
 * EmojiPicker Component
 * Simple emoji picker for quick reactions and message emojis
 */
const EmojiPicker = ({ onSelect, onClose }) => {
  const pickerRef = useRef(null);

  // Common emojis organized by category
  const emojiCategories = {
    'Smileys': ['😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚'],
    'Gestures': ['👍', '👎', '👏', '🙌', '👐', '🤝', '🙏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '👇', '☝️', '✋'],
    'Hearts': ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝'],
    'Objects': ['🎉', '🎊', '🎈', '🎁', '🎀', '🏆', '🥇', '🥈', '🥉', '⭐', '🌟', '✨', '💫', '🔥', '💯', '✅', '❌', '⚠️'],
  };

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={pickerRef}
      className="w-64 sm:w-80 max-h-96 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg shadow-xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-stone-200 dark:border-stone-700">
        <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
          Pick an emoji
        </h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-stone-100 dark:hover:bg-stone-700 rounded transition-colors"
        >
          <X className="h-4 w-4 text-stone-600 dark:text-stone-400" />
        </button>
      </div>

      {/* Emoji Grid */}
      <div className="p-3 overflow-y-auto max-h-80 scrollbar-thin">
        {Object.entries(emojiCategories).map(([category, emojis]) => (
          <div key={category} className="mb-4 last:mb-0">
            <h4 className="text-xs font-medium text-stone-600 dark:text-stone-400 mb-2">
              {category}
            </h4>
            <div className="grid grid-cols-8 gap-1">
              {emojis.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => onSelect(emoji)}
                  className="p-2 text-xl hover:bg-stone-100 dark:hover:bg-stone-700 rounded transition-colors"
                  title={emoji}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmojiPicker;
