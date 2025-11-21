import { Eye, Upload } from 'lucide-react';

const ContentHeader = ({ onPreview, onPublish, lastSaved }) => {
  return (
    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 pb-4 sm:pb-6">
      <div className="flex-1 min-w-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1b130d] dark:text-[#f3ece7] tracking-tight">
          Story & Content Management
        </h1>
        <p className="text-sm sm:text-base text-[#9a6c4c] dark:text-[#9a6c4c] mt-1">
          Craft and manage the narratives behind your brand and products.
        </p>
      </div>
      <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
        <button
          onClick={onPreview}
          className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-lg border border-[#e7d9cf] dark:border-[#4a392b] px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-[#3a3028] dark:text-[#f3ece7] hover:bg-[#f3ece7] dark:hover:bg-[#3a3028]/50 transition-colors"
        >
          <Eye className="h-4 w-4" />
          <span className="hidden xs:inline">Preview</span>
        </button>
        <button
          onClick={onPublish}
          className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-lg bg-[#ec6d13] px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white shadow-sm hover:bg-[#d55a0a] transition-colors"
        >
          <Upload className="h-4 w-4" />
          <span>Publish</span>
        </button>
      </div>
    </header>
  );
};

export default ContentHeader;
