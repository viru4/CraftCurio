import jwt from 'jsonwebtoken';
import genToken from '../src/utils/token.js';

describe('genToken', () => {
  const ORIGINAL_SECRET = process.env.JWT_SECRET;

  afterEach(() => {
    process.env.JWT_SECRET = ORIGINAL_SECRET;
  });

  test('throws when JWT_SECRET is missing', () => {
    delete process.env.JWT_SECRET;
    expect(() => genToken('user-123')).toThrow('JWT_SECRET is not defined');
  });

  test('generates a signed token with the user id as subject', () => {
    process.env.JWT_SECRET = 'test-secret';
    const token = genToken('user-123');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    expect(decoded.sub).toBe('user-123');
    expect(decoded.exp).toBeDefined();
  });

  test('accepts custom payload objects', () => {
    process.env.JWT_SECRET = 'test-secret';
    const token = genToken({ sub: 'user-456', role: 'artisan' }, { expiresIn: '1h' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    expect(decoded.sub).toBe('user-456');
    expect(decoded.role).toBe('artisan');
  });
});
