import jwt from 'jsonwebtoken';

/**
 * Generate a signed JWT for the provided user id.
 *
 * @param {string|object} userId - The id to embed in the token payload.
 * @param {object} [options] - Optional overrides for jwt.sign.
 * @returns {string} A signed JWT.
 * @throws {Error} When the secret is missing or signing fails.
 */
const genToken = (userId, options = {}) => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }

  const payload = typeof userId === 'object' ? userId : { sub: userId };

  return jwt.sign(payload, secret, {
    expiresIn: '7d',
    ...options
  });
};

export default genToken;