import { z } from 'zod';

/**
 * Validation Middleware - Validates request data using Zod schemas
 * Provides comprehensive validation for collectible listings, auctions, and bids
 */

/**
 * Schema for creating a direct sale collectible
 */
const directSaleSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().positive('Price must be positive'),
  category: z.string().min(1, 'Category is required'),
  image: z.string().url('Invalid image URL'),
  images: z.array(z.string().url()).optional(),
  saleType: z.literal('direct'),
  owner: z.string().optional(), // ObjectId as string
  tags: z.array(z.string()).optional(),
  specifications: z.object({
    material: z.string().optional(),
    condition: z.string().optional(),
    yearMade: z.string().optional(),
    origin: z.string().optional(),
  }).optional(),
  promoted: z.boolean().optional(),
  status: z.enum(['pending', 'approved', 'rejected', 'active', 'inactive', 'sold']).optional()
});

/**
 * Schema for creating an auction collectible
 */
const auctionSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().positive('Starting price must be positive'),
  category: z.string().min(1, 'Category is required'),
  image: z.string().url('Invalid image URL'),
  images: z.array(z.string().url()).optional(),
  saleType: z.literal('auction'),
  owner: z.string().optional(), // ObjectId as string
  tags: z.array(z.string()).optional(),
  specifications: z.object({
    material: z.string().optional(),
    condition: z.string().optional(),
    yearMade: z.string().optional(),
    origin: z.string().optional(),
  }).optional(),
  promoted: z.boolean().optional(),
  status: z.enum(['pending', 'approved', 'rejected', 'active', 'inactive', 'sold']).optional(),
  auction: z.object({
    startTime: z.string().datetime().or(z.date()),
    endTime: z.string().datetime().or(z.date()),
    reservePrice: z.number().nonnegative().optional(),
    minimumBidIncrement: z.number().positive().default(10),
    buyNowPrice: z.number().positive().optional(),
    auctionStatus: z.enum(['scheduled', 'live', 'ended', 'cancelled', 'sold']).default('scheduled')
  }).refine(
    (data) => {
      const start = new Date(data.startTime);
      const end = new Date(data.endTime);
      return end > start;
    },
    { message: 'End time must be after start time' }
  ).refine(
    (data) => {
      const start = new Date(data.startTime);
      return start > new Date();
    },
    { message: 'Start time must be in the future' }
  )
});

/**
 * Combined schema for creating any collectible (direct or auction)
 */
const createCollectibleSchema = z.discriminatedUnion('saleType', [
  directSaleSchema,
  auctionSchema
]);

/**
 * Schema for placing a bid
 */
const placeBidSchema = z.object({
  bidAmount: z.number().positive('Bid amount must be positive'),
  bidderId: z.string().min(1, 'Bidder ID is required'),
  bidderName: z.string().min(1, 'Bidder name is required'),
  bidderEmail: z.string().email('Valid email is required')
});

/**
 * Schema for buy-now action
 */
const buyNowSchema = z.object({
  buyerId: z.string().min(1, 'Buyer ID is required'),
  buyerName: z.string().min(1, 'Buyer name is required'),
  buyerEmail: z.string().email('Valid email is required')
});

/**
 * Schema for updating a collectible
 */
const updateCollectibleSchema = z.object({
  title: z.string().min(3).max(200).optional(),
  description: z.string().min(10).optional(),
  price: z.number().positive().optional(),
  category: z.string().optional(),
  image: z.string().url().optional(),
  images: z.array(z.string().url()).optional(),
  status: z.enum(['pending', 'approved', 'rejected', 'active', 'inactive', 'sold']).optional(),
  promoted: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  specifications: z.object({
    material: z.string().optional(),
    condition: z.string().optional(),
    yearMade: z.string().optional(),
    origin: z.string().optional(),
  }).optional(),
  auction: z.object({
    reservePrice: z.number().nonnegative().optional(),
    buyNowPrice: z.number().positive().optional(),
    auctionStatus: z.enum(['scheduled', 'live', 'ended', 'cancelled', 'sold']).optional()
  }).optional()
}).strict();

/**
 * Middleware factory to validate request body against a schema
 */
export const validateBody = (schema) => {
  return (req, res, next) => {
    try {
      const validated = schema.parse(req.body);
      req.validatedBody = validated;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation failed',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
      }
      return res.status(500).json({ error: 'Validation error' });
    }
  };
};

/**
 * Middleware to validate query parameters
 */
export const validateQuery = (schema) => {
  return (req, res, next) => {
    try {
      const validated = schema.parse(req.query);
      req.validatedQuery = validated;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Invalid query parameters',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
      }
      return res.status(500).json({ error: 'Validation error' });
    }
  };
};

/**
 * Middleware to validate MongoDB ObjectId
 */
export const validateObjectId = (paramName = 'id') => {
  return (req, res, next) => {
    const id = req.params[paramName];
    
    // MongoDB ObjectId is 24 hex characters
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    
    if (!id) {
      return res.status(400).json({ error: `${paramName} is required` });
    }
    
    // Allow custom IDs (like "coll-001") or MongoDB ObjectIds
    if (!objectIdRegex.test(id) && !id.match(/^[a-zA-Z0-9-_]+$/)) {
      return res.status(400).json({ error: `Invalid ${paramName} format` });
    }
    
    next();
  };
};

/**
 * Middleware to check ownership of a resource
 */
export const validateOwnership = (model, ownerField = 'owner') => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params.id;
      const userId = req.user?._id || req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const resource = await model.findById(resourceId);
      
      if (!resource) {
        return res.status(404).json({ error: 'Resource not found' });
      }

      const ownerId = resource[ownerField]?.toString();
      
      if (ownerId !== userId.toString() && req.user?.role !== 'admin') {
        return res.status(403).json({ 
          error: 'Access denied',
          message: 'You do not have permission to modify this resource' 
        });
      }

      req.resource = resource;
      next();
    } catch (error) {
      return res.status(500).json({ error: 'Validation error', message: error.message });
    }
  };
};

// Export schemas for use in controllers
export const schemas = {
  createCollectible: createCollectibleSchema,
  updateCollectible: updateCollectibleSchema,
  placeBid: placeBidSchema,
  buyNow: buyNowSchema,
  directSale: directSaleSchema,
  auction: auctionSchema
};

export default {
  validateBody,
  validateQuery,
  validateObjectId,
  validateOwnership,
  schemas
};
