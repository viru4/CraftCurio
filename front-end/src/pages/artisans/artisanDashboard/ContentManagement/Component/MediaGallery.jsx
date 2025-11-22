import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { useState } from 'react';

const MediaGallery = ({ 
  images = [], 
  onUpload, 
  onDelete,
  title = "Media Gallery",
  description = "Upload images and videos that showcase your workspace, process, and artistry."
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    const validFiles = files.filter(file => 
      file.type.startsWith('image/') || file.type.startsWith('video/')
    );

    if (validFiles.length > 0) {
      // Simulate upload progress
      setUploadProgress(0);
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setUploadProgress(null);
              onUpload(validFiles);
            }, 500);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    }
  };

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-[#1b130d] dark:text-[#f3ece7]">
          {title}
        </h2>
        <p className="text-sm sm:text-base text-[#9a6c4c] dark:text-[#9a6c4c] mt-1">
          {description}
        </p>
      </div>

      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative rounded-lg sm:rounded-xl border-2 border-dashed p-6 sm:p-8 transition-all ${
          isDragging
            ? 'border-[#ec6d13] bg-[#ec6d13]/5'
            : 'border-[#e7d9cf] dark:border-[#4a392b] bg-white dark:bg-[#221810]/50'
        }`}
      >
        <input
          type="file"
          id="media-upload"
          multiple
          accept="image/*,video/*"
          onChange={handleFileInput}
          className="hidden"
        />
        
        <label
          htmlFor="media-upload"
          className="flex flex-col items-center justify-center gap-3 sm:gap-4 cursor-pointer"
        >
          <div className="p-3 sm:p-4 rounded-full bg-[#f3ece7] dark:bg-[#3a3028]/50">
            <Upload className="h-6 w-6 sm:h-8 sm:w-8 text-[#ec6d13]" />
          </div>
          <div className="text-center">
            <p className="text-sm sm:text-base font-medium text-[#3a3028] dark:text-[#f3ece7]">
              Drag & drop files here or click to upload
            </p>
            <p className="text-xs sm:text-sm text-[#9a6c4c] dark:text-[#9a6c4c] mt-1">
              Supports: JPG, PNG, GIF, MP4, MOV (Max 10MB)
            </p>
          </div>
        </label>

        {/* Upload Progress */}
        {uploadProgress !== null && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/90 dark:bg-[#221810]/90 rounded-lg sm:rounded-xl">
            <div className="w-full max-w-xs px-4">
              <div className="text-center mb-3">
                <p className="text-sm font-medium text-[#3a3028] dark:text-[#f3ece7]">
                  Uploading... {uploadProgress}%
                </p>
              </div>
              <div className="w-full h-2 bg-[#e7d9cf] dark:bg-[#4a392b] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#ec6d13] transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Media Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="group relative aspect-square rounded-lg overflow-hidden bg-[#f3ece7] dark:bg-[#3a3028]/50"
            >
              {image.type?.startsWith('video/') ? (
                <video
                  src={image.url}
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={image.url}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              )}
              
              {/* Delete Button */}
              <button
                onClick={() => onDelete(index)}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Video Indicator */}
              {image.type?.startsWith('video/') && (
                <div className="absolute bottom-2 left-2 p-1 rounded bg-black/60 text-white">
                  <ImageIcon className="h-3 w-3" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && (
        <div className="text-center py-8 text-[#9a6c4c] dark:text-[#9a6c4c] text-sm">
          No media uploaded yet. Start by adding your first image or video.
        </div>
      )}
    </section>
  );
};

export default MediaGallery;
