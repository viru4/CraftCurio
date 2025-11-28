// Backend Upload Service - Cloudinary Integration
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import path from 'path';

/**
 * Upload Service - Handles file uploads to Cloudinary
 * Provides multer middleware configured with Cloudinary storage
 */

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Validate Cloudinary configuration
export const validateCloudinaryConfig = () => {
    const { cloud_name, api_key, api_secret } = cloudinary.config();

    if (!cloud_name || !api_key || !api_secret) {
        throw new Error(
            'Cloudinary configuration is incomplete. Please check your environment variables:\n' +
            '- CLOUDINARY_CLOUD_NAME\n' +
            '- CLOUDINARY_API_KEY\n' +
            '- CLOUDINARY_API_SECRET'
        );
    }

    console.log('✅ Cloudinary configured successfully:', cloud_name);
    return true;
};

// Configure Cloudinary storage for multer
export const createCloudinaryStorage = (folder = 'craftcurio') => {
    return new CloudinaryStorage({
        cloudinary: cloudinary,
        params: async (req, file) => {
            // Determine folder based on upload type or use default
            const uploadFolder = req.body.folder || folder;

            return {
                folder: uploadFolder,
                allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
                transformation: [
                    { width: 2000, height: 2000, crop: 'limit' }, // Limit max size
                    { quality: 'auto' }, // Automatic quality optimization
                    { fetch_format: 'auto' }, // Automatic format selection
                ],
                public_id: `${Date.now()}-${Math.round(Math.random() * 1E9)}`,
            };
        },
    });
};

// File filter to allow only images
const imageFileFilter = (req, file, cb) => {
    // Accept images only
    const allowedTypes = /jpeg|jpg|png|gif|webp|svg/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp, svg)'));
    }
};

// Create multer upload middleware for single file
export const uploadSingle = (fieldName = 'image', folder = 'craftcurio') => {
    const storage = createCloudinaryStorage(folder);

    return multer({
        storage: storage,
        limits: {
            fileSize: 10 * 1024 * 1024, // 10MB limit
        },
        fileFilter: imageFileFilter,
    }).single(fieldName);
};

// Create multer upload middleware for multiple files
export const uploadMultiple = (fieldName = 'images', maxCount = 10, folder = 'craftcurio') => {
    const storage = createCloudinaryStorage(folder);

    return multer({
        storage: storage,
        limits: {
            fileSize: 10 * 1024 * 1024, // 10MB per file
        },
        fileFilter: imageFileFilter,
    }).array(fieldName, maxCount);
};

// Create multer upload middleware for multiple fields
export const uploadFields = (fields, folder = 'craftcurio') => {
    const storage = createCloudinaryStorage(folder);

    return multer({
        storage: storage,
        limits: {
            fileSize: 10 * 1024 * 1024, // 10MB per file
        },
        fileFilter: imageFileFilter,
    }).fields(fields);
};

// Delete image from Cloudinary
export const deleteImage = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
        throw error;
    }
};

// Extract public_id from Cloudinary URL
export const getPublicIdFromUrl = (url) => {
    try {
        // Cloudinary URL format: https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{public_id}.{format}
        const matches = url.match(/\/v\d+\/(.+)\.\w+$/);
        return matches ? matches[1] : null;
    } catch (error) {
        console.error('Error extracting public_id from URL:', error);
        return null;
    }
};

// Export cloudinary instance for direct usage if needed
export { cloudinary };

export default {
    validateCloudinaryConfig,
    uploadSingle,
    uploadMultiple,
    uploadFields,
    deleteImage,
    getPublicIdFromUrl,
    cloudinary,
};
