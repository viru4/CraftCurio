import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader } from 'lucide-react';
import PropTypes from 'prop-types';

/**
 * Reusable Image Upload Component
 * Supports single and multiple file uploads with preview and progress
 */
const ImageUpload = ({
    onUploadComplete,
    onUploadError,
    multiple = false,
    maxFiles = 5,
    currentImages = [],
    onRemoveImage = null,
    label = 'Upload Images',
    folder = 'craftcurio',
    showPreview = true,
    className = ''
}) => {
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [previews, setPreviews] = useState(currentImages);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);

    // Handle file selection
    const handleFileSelect = async (files) => {
        if (!files || files.length === 0) return;

        // Validate file count
        if (multiple && previews.length + files.length > maxFiles) {
            onUploadError?.(new Error(`Maximum ${maxFiles} files allowed`));
            return;
        }

        // Validate each file
        const { validateFile } = await import('../../utils/uploadApi.js');
        const validFiles = [];

        for (const file of files) {
            const validation = validateFile(file);
            if (validation.valid) {
                validFiles.push(file);
            } else {
                onUploadError?.(new Error(validation.error));
                return;
            }
        }

        if (validFiles.length === 0) return;

        // Create local previews
        const newPreviews = validFiles.map(file => URL.createObjectURL(file));
        setPreviews(prev => [...prev, ...newPreviews]);

        // Upload files
        setUploading(true);
        setUploadProgress(0);

        try {
            const { uploadSingleImage, uploadMultipleImages } = await import('../../utils/uploadApi.js');

            let uploadedUrls = [];

            if (multiple) {
                const results = await uploadMultipleImages(
                    Array.from(validFiles),
                    folder,
                    (progress) => setUploadProgress(progress)
                );
                uploadedUrls = results.map(r => r.url);
            } else {
                const result = await uploadSingleImage(
                    validFiles[0],
                    folder,
                    (progress) => setUploadProgress(progress)
                );
                uploadedUrls = [result.url];
            }

            // Replace preview URLs with actual uploaded URLs
            setPreviews(prev => {
                const localPreviews = prev.filter(p => !p.startsWith('blob:'));
                return [...localPreviews, ...uploadedUrls];
            });

            // Cleanup blob URLs
            newPreviews.forEach(url => URL.revokeObjectURL(url));

            // Notify parent component
            if (multiple) {
                onUploadComplete(uploadedUrls);
            } else {
                onUploadComplete(uploadedUrls[0]);
            }

            setUploadProgress(100);
            setTimeout(() => setUploadProgress(0), 1000);
        } catch (error) {
            console.error('Upload failed:', error);
            onUploadError?.(error);

            // Remove failed previews
            newPreviews.forEach(url => URL.revokeObjectURL(url));
            setPreviews(prev => prev.filter(p => !newPreviews.includes(p)));
        } finally {
            setUploading(false);
        }
    };

    // Handle file input change
    const handleInputChange = (e) => {
        const files = Array.from(e.target.files);
        handleFileSelect(files);
        e.target.value = ''; // Reset input
    };

    // Handle drag and drop
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const files = Array.from(e.dataTransfer.files);
        handleFileSelect(files);
    };

    // Handle remove image
    const handleRemove = (index) => {
        const imageUrl = previews[index];

        // Revoke blob URL if it's a local preview
        if (imageUrl.startsWith('blob:')) {
            URL.revokeObjectURL(imageUrl);
        }

        const newPreviews = previews.filter((_, i) => i !== index);
        setPreviews(newPreviews);

        if (onRemoveImage) {
            onRemoveImage(index, imageUrl);
        }
    };

    // Trigger file input click
    const handleClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Upload Area */}
            <div
                className={`
          relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
          transition-all duration-200
          ${dragActive ? 'border-orange-500 bg-orange-50' : 'border-gray-300 hover:border-orange-400'}
          ${uploading ? 'opacity-50 pointer-events-none' : ''}
        `}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={handleClick}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple={multiple}
                    onChange={handleInputChange}
                    className="hidden"
                    disabled={uploading}
                />

                <div className="flex flex-col items-center">
                    {uploading ? (
                        <>
                            <Loader className="h-12 w-12 text-orange-500 animate-spin mb-4" />
                            <p className="text-gray-700 font-medium">Uploading...</p>
                            <p className="text-gray-500 text-sm mt-1">{uploadProgress}%</p>
                        </>
                    ) : (
                        <>
                            <Upload className="h-12 w-12 text-gray-400 mb-4" />
                            <p className="text-gray-700 font-medium mb-1">{label}</p>
                            <p className="text-gray-500 text-sm">
                                Click to browse or drag and drop
                            </p>
                            <p className="text-gray-400 text-xs mt-2">
                                PNG, JPG, GIF, WebP up to 10MB
                                {multiple && ` (Max ${maxFiles} files)`}
                            </p>
                        </>
                    )}
                </div>

                {/* Progress bar */}
                {uploading && uploadProgress > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 rounded-b-xl overflow-hidden">
                        <div
                            className="h-full bg-orange-500 transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                        />
                    </div>
                )}
            </div>

            {/* Image Previews */}
            {showPreview && previews.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {previews.map((url, index) => (
                        <div key={index} className="relative group aspect-square">
                            <img
                                src={url}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-full object-cover rounded-lg border border-gray-200"
                                onError={(e) => {
                                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3C/svg%3E';
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => handleRemove(index)}
                                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full 
                           opacity-0 group-hover:opacity-100 transition-opacity
                           hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                                aria-label="Remove image"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

ImageUpload.propTypes = {
    onUploadComplete: PropTypes.func.isRequired,
    onUploadError: PropTypes.func,
    multiple: PropTypes.bool,
    maxFiles: PropTypes.number,
    currentImages: PropTypes.arrayOf(PropTypes.string),
    onRemoveImage: PropTypes.func,
    label: PropTypes.string,
    folder: PropTypes.string,
    showPreview: PropTypes.bool,
    className: PropTypes.string
};

export default ImageUpload;
