// Backend Upload Service - Cloudinary Integration
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import path from 'path';

// Ensure environment variables are loaded before configuring Cloudinary
dotenv.config();

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

const IMAGE_FORMATS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'tiff'];
const DOCUMENT_FORMATS = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'csv', 'txt', 'rtf'];
const MEDIA_FORMATS = ['mp4', 'mov', 'avi', 'mkv', 'webm', 'mp3', 'wav', 'aac', 'flac'];
const ARCHIVE_FORMATS = ['zip', 'rar', '7z'];

const ALLOWED_FORMATS = [...new Set([
    ...IMAGE_FORMATS,
    ...DOCUMENT_FORMATS,
    ...MEDIA_FORMATS,
    ...ARCHIVE_FORMATS,
])];

const ALLOWED_FORMATS_BY_RESOURCE = {
    image: IMAGE_FORMATS,
    video: MEDIA_FORMATS,
    raw: [...DOCUMENT_FORMATS, ...ARCHIVE_FORMATS],
};

const getFileExtension = (filename = '') =>
    path.extname(filename).replace('.', '').toLowerCase();

const determineResourceType = (extension, mimetype = '') => {
    if (IMAGE_FORMATS.includes(extension) || mimetype.startsWith('image/')) {
        return 'image';
    }

    if (
        MEDIA_FORMATS.includes(extension) ||
        mimetype.startsWith('video/') ||
        mimetype.startsWith('audio/')
    ) {
        return 'video';
    }

    return 'raw';
};

const fileFilter = (req, file, cb) => {
    const extension = getFileExtension(file.originalname);
    const mimetype = file.mimetype || '';

    if (ALLOWED_FORMATS.includes(extension)) {
        return cb(null, true);
    }

    console.warn(
        `Rejected upload for unsupported format: ${extension || 'unknown'} (${mimetype})`
    );

    cb(
        new Error(
            `Unsupported file type. Allowed formats: ${ALLOWED_FORMATS.join(', ')}`
        )
    );
};

// Configure Cloudinary storage for multer
export const createCloudinaryStorage = (folder = 'craftcurio') => {
    return new CloudinaryStorage({
        cloudinary: cloudinary,
        params: async (req, file) => {
            const uploadFolder = req.body?.folder || folder;
            const extension = getFileExtension(file.originalname);
            const resourceType = determineResourceType(extension, file.mimetype);
            const baseParams = {
                folder: uploadFolder,
                allowed_formats: ALLOWED_FORMATS_BY_RESOURCE[resourceType],
                resource_type: resourceType,
                public_id: `${Date.now()}-${Math.round(Math.random() * 1e9)}`,
            };

            if (resourceType === 'image') {
                baseParams.transformation = [
                    { width: 2000, height: 2000, crop: 'limit' }, // Limit max size
                    { quality: 'auto' }, // Automatic quality optimization
                    { fetch_format: 'auto' }, // Automatic format selection
                ];
            }

            return baseParams;
        },
    });
};

// Create multer upload middleware for single file
export const uploadSingle = (fieldName = 'image', folder = 'craftcurio') => {
    const storage = createCloudinaryStorage(folder);

    return multer({
        storage: storage,
        limits: {
            fileSize: 10 * 1024 * 1024, // 10MB limit
        },
        fileFilter: fileFilter,
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
        fileFilter: fileFilter,
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
        fileFilter: fileFilter,
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
        if (!url || typeof url !== 'string') return null;
        
        // Cloudinary URL formats:
        // https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{public_id}.{format}
        // https://res.cloudinary.com/{cloud_name}/image/upload/{public_id}.{format}
        // https://res.cloudinary.com/{cloud_name}/{resource_type}/upload/v{version}/{public_id}.{format}
        
        // Try to match with version
        let matches = url.match(/\/upload\/v\d+\/(.+?)(?:\.\w+)?$/);
        if (matches) {
            return matches[1];
        }
        
        // Try to match without version
        matches = url.match(/\/upload\/(.+?)(?:\.\w+)?$/);
        if (matches) {
            return matches[1];
        }
        
        // If URL contains public_id directly (from multer-storage-cloudinary)
        if (url.includes('public_id')) {
            const publicIdMatch = url.match(/public_id['":]\s*['"]([^'"]+)['"]/);
            if (publicIdMatch) {
                return publicIdMatch[1];
            }
        }
        
        return null;
    } catch (error) {
        console.error('Error extracting public_id from URL:', error);
        return null;
    }
};

// Delete multiple images from Cloudinary
export const deleteImages = async (urls) => {
    try {
        if (!Array.isArray(urls) || urls.length === 0) return { deleted: 0, failed: 0 };
        
        const publicIds = urls
            .map(url => getPublicIdFromUrl(url))
            .filter(id => id !== null);
        
        if (publicIds.length === 0) {
            console.warn('No valid public IDs found in URLs');
            return { deleted: 0, failed: urls.length };
        }
        
        // Delete in batches (Cloudinary allows up to 100 per request)
        const batchSize = 100;
        let deleted = 0;
        let failed = 0;
        
        for (let i = 0; i < publicIds.length; i += batchSize) {
            const batch = publicIds.slice(i, i + batchSize);
            try {
                const result = await cloudinary.api.delete_resources(batch, {
                    resource_type: 'image',
                    type: 'upload'
                });
                deleted += result.deleted ? Object.keys(result.deleted).length : 0;
                failed += result.not_found ? Object.keys(result.not_found).length : 0;
            } catch (error) {
                console.error('Error deleting batch from Cloudinary:', error);
                failed += batch.length;
            }
        }
        
        return { deleted, failed };
    } catch (error) {
        console.error('Error deleting images from Cloudinary:', error);
        throw error;
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
    deleteImages,
    getPublicIdFromUrl,
    cloudinary,
};
