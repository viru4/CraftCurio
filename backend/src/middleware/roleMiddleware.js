/**
 * Middleware to check if user has required role(s)
 * @param {string|string[]} allowedRoles - Single role or array of allowed roles
 */
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        message: 'Authentication required' 
      });
    }

    const userRole = req.user.role;
    
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ 
        message: `Access denied. Required role: ${allowedRoles.join(' or ')}` 
      });
    }

    next();
  };
};

/**
 * Middleware to check if user is a buyer
 */
export const requireBuyer = requireRole('buyer');

/**
 * Middleware to check if user is an artisan
 */
export const requireArtisan = requireRole('artisan');

/**
 * Middleware to check if user is a collector
 */
export const requireCollector = requireRole('collector');

/**
 * Middleware to check if user is an artisan or collector (sellers)
 */
export const requireSeller = requireRole('artisan', 'collector');

/**
 * Middleware to check if user is an admin
 */
export const requireAdmin = requireRole('admin');
