/**
 * Upload API Utilities
 * Functions for handling file uploads to the backend
 */

const getApiBaseUrl = () => {
    const raw = import.meta.env.VITE_API_BASE_URL || '';
    const normalized = raw.replace(/\/+$/, '');
    if (normalized.endsWith('/api')) {
        return normalized;
    }
    // If empty, use relative path (works with Vite proxy in dev, or same origin in prod)
    if (!normalized) {
        return '/api';
    }
    return `${normalized}/api`;
};

const API_BASE_URL = getApiBaseUrl();

/**
 * Upload a single image file
 * @param {File} file - The file to upload
 * @param {string} folder - Optional folder name in Cloudinary (default: 'craftcurio')
 * @param {Function} onProgress - Optional progress callback (percent: number) => void
 * @returns {Promise<{url: string, publicId: string}>}
 */
export const uploadSingleImage = async (file, folder = 'craftcurio', onProgress = null) => {
    try {
        const formData = new FormData();
        formData.append('image', file);
        if (folder) {
            formData.append('folder', folder);
        }

        const token = localStorage.getItem('token');

        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            // Track upload progress
            if (onProgress) {
                xhr.upload.addEventListener('progress', (e) => {
                    if (e.lengthComputable) {
                        const percentComplete = (e.loaded / e.total) * 100;
                        onProgress(Math.round(percentComplete));
                    }
                });
            }

            xhr.addEventListener('load', () => {
                if (xhr.status === 200) {
                    const response = JSON.parse(xhr.responseText);
                    resolve({
                        url: response.url,
                        publicId: response.publicId
                    });
                } else {
                    const error = JSON.parse(xhr.responseText);
                    reject(new Error(error.message || 'Upload failed'));
                }
            });

            xhr.addEventListener('error', () => {
                reject(new Error('Network error during upload'));
            });

            xhr.open('POST', `${API_BASE_URL}/upload/single`);
            if (token) {
                xhr.setRequestHeader('Authorization', `Bearer ${token}`);
            }
            xhr.send(formData);
        });
    } catch (error) {
        if (import.meta.env.DEV) {
            console.error('Upload error:', error);
        }
        throw error;
    }
};

/**
 * Upload multiple image files
 * @param {File[]} files - Array of files to upload
 * @param {string} folder - Optional folder name in Cloudinary
 * @param {Function} onProgress - Optional progress callback
 * @returns {Promise<Array<{url: string, publicId: string}>>}
 */
export const uploadMultipleImages = async (files, folder = 'craftcurio', onProgress = null) => {
    try {
        const formData = new FormData();

        files.forEach((file) => {
            formData.append('images', file);
        });

        if (folder) {
            formData.append('folder', folder);
        }

        formData.append('maxCount', files.length.toString());

        const token = localStorage.getItem('token');

        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            // Track upload progress
            if (onProgress) {
                xhr.upload.addEventListener('progress', (e) => {
                    if (e.lengthComputable) {
                        const percentComplete = (e.loaded / e.total) * 100;
                        onProgress(Math.round(percentComplete));
                    }
                });
            }

            xhr.addEventListener('load', () => {
                if (xhr.status === 200) {
                    const response = JSON.parse(xhr.responseText);
                    resolve(response.files.map(file => ({
                        url: file.url,
                        publicId: file.publicId
                    })));
                } else {
                    const error = JSON.parse(xhr.responseText);
                    reject(new Error(error.message || 'Upload failed'));
                }
            });

            xhr.addEventListener('error', () => {
                reject(new Error('Network error during upload'));
            });

            xhr.open('POST', `${API_BASE_URL}/upload/multiple`);
            if (token) {
                xhr.setRequestHeader('Authorization', `Bearer ${token}`);
            }
            xhr.send(formData);
        });
    } catch (error) {
        if (import.meta.env.DEV) {
            console.error('Upload error:', error);
        }
        throw error;
    }
};

/**
 * Validate file before upload
 * @param {File} file 
 * @param {Object} options - Validation options
 * @returns {Object} - {valid: boolean, error: string|null}
 */
export const validateFile = (file, options = {}) => {
    const {
        maxSize = 10 * 1024 * 1024, // 10MB default
        allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
    } = options;

    if (!file) {
        return { valid: false, error: 'No file selected' };
    }

    if (file.size > maxSize) {
        return {
            valid: false,
            error: `File size exceeds ${(maxSize / (1024 * 1024)).toFixed(0)}MB limit`
        };
    }

    if (!allowedTypes.includes(file.type)) {
        return {
            valid: false,
            error: 'Invalid file type. Only images are allowed (JPEG, PNG, GIF, WebP, SVG)'
        };
    }

    return { valid: true, error: null };
};

export default {
    uploadSingleImage,
    uploadMultipleImages,
    validateFile
};
