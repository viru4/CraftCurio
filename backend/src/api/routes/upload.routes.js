import express from 'express';
import { uploadSingle, uploadMultiple } from '../../services/uploadService.js';
import { authenticate } from '../../middleware/authMiddleware.js';

const router = express.Router();

/**
 * Upload Routes
 * Handles file uploads to Cloudinary
 */

/**
 * Upload single image
 * POST /api/upload/single
 * @access Private - Authenticated users only
 */
router.post('/single', authenticate, (req, res, next) => {
    const folder = req.body.folder || 'craftcurio';

    uploadSingle('image', folder)(req, res, (err) => {
        if (err) {
            console.error('Upload error:', err);
            return res.status(400).json({
                error: 'File upload failed',
                message: err.message
            });
        }

        if (!req.file) {
            return res.status(400).json({
                error: 'No file uploaded',
                message: 'Please select a file to upload'
            });
        }

        // Return the Cloudinary URL
        res.status(200).json({
            message: 'File uploaded successfully',
            url: req.file.path,
            publicId: req.file.filename,
            originalName: req.file.originalname,
            size: req.file.size,
            format: req.file.format
        });
    });
});

/**
 * Upload multiple images
 * POST /api/upload/multiple
 * @access Private - Authenticated users only
 */
router.post('/multiple', authenticate, (req, res, next) => {
    const folder = req.body.folder || 'craftcurio';
    const maxCount = parseInt(req.body.maxCount) || 10;

    uploadMultiple('images', maxCount, folder)(req, res, (err) => {
        if (err) {
            console.error('Upload error:', err);
            return res.status(400).json({
                error: 'File upload failed',
                message: err.message
            });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                error: 'No files uploaded',
                message: 'Please select at least one file to upload'
            });
        }

        // Return array of Cloudinary URLs
        const uploadedFiles = req.files.map(file => ({
            url: file.path,
            publicId: file.filename,
            originalName: file.originalname,
            size: file.size,
            format: file.format
        }));

        res.status(200).json({
            message: `${req.files.length} file(s) uploaded successfully`,
            count: req.files.length,
            files: uploadedFiles
        });
    });
});

/**
 * Health check for upload service
 * GET /api/upload/health
 * @access Public
 */
router.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        message: 'Upload service is running',
        cloudinary: {
            configured: !!(process.env.CLOUDINARY_CLOUD_NAME &&
                process.env.CLOUDINARY_API_KEY &&
                process.env.CLOUDINARY_API_SECRET)
        }
    });
});

export default router;
