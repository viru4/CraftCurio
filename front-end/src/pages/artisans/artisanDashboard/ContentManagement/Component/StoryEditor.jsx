import { Bold, Italic, Underline, List, ListOrdered, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import { useState } from 'react';

const StoryEditor = ({ content, onChange, lastSaved }) => {
  const [editorContent, setEditorContent] = useState(content || '');

  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setEditorContent(newContent);
    onChange(newContent);
  };

  const toolbarButtons = [
    { icon: Bold, action: 'bold', label: 'Bold' },
    { icon: Italic, action: 'italic', label: 'Italic' },
    { icon: Underline, action: 'underline', label: 'Underline' },
    { divider: true },
    { icon: List, action: 'bulletList', label: 'Bullet List' },
    { icon: ListOrdered, action: 'numberedList', label: 'Numbered List' },
    { divider: true },
    { icon: LinkIcon, action: 'link', label: 'Insert Link' },
    { icon: ImageIcon, action: 'image', label: 'Insert Image' }
  ];

  return (
    <section className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex-1">
          <h2 className="text-lg sm:text-xl font-bold text-[#1b130d] dark:text-[#f3ece7]">
            Craft Your Artisan Story
          </h2>
          <p className="text-sm sm:text-base text-[#9a6c4c] dark:text-[#9a6c4c] mt-1">
            Share your journey, your process, and the passion behind your creations.
          </p>
        </div>
        {lastSaved && (
          <span className="text-xs text-[#9a6c4c] dark:text-[#9a6c4c] whitespace-nowrap">
            Last saved: {lastSaved}
          </span>
        )}
      </div>

      <div className="rounded-lg sm:rounded-xl border border-[#e7d9cf] dark:border-[#4a392b] bg-white dark:bg-[#221810]/50 overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-1 sm:gap-2 border-b border-[#e7d9cf] dark:border-[#4a392b] p-2 overflow-x-auto scrollbar-thin">
          {toolbarButtons.map((button, index) => {
            if (button.divider) {
              return (
                <div
                  key={`divider-${index}`}
                  className="h-6 w-px bg-[#e7d9cf] dark:bg-[#4a392b] mx-1"
                />
              );
            }

            const Icon = button.icon;
            return (
              <button
                key={button.action}
                type="button"
                title={button.label}
                className="p-1.5 sm:p-2 rounded hover:bg-[#f3ece7] dark:hover:bg-[#3a3028]/50 transition-colors"
              >
                <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-[#3a3028] dark:text-[#f3ece7]" />
              </button>
            );
          })}
        </div>

        {/* Text Area */}
        <textarea
          value={editorContent}
          onChange={handleContentChange}
          placeholder="From a small workshop nestled in the heart of the city, my journey began..."
          className="w-full p-3 sm:p-4 text-sm sm:text-base text-[#3a3028] dark:text-[#f3ece7] bg-transparent leading-relaxed min-h-[200px] sm:min-h-[250px] resize-none focus:outline-none placeholder:text-[#9a6c4c]"
        />
      </div>
    </section>
  );
};

export default StoryEditor;
