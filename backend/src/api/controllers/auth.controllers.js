import User from '../../models/User.js';
import bcrypt from 'bcryptjs';
import genToken from '../../utils/token.js';

const normalizeEmail = (email = '') => email.trim().toLowerCase();

const buildCookieOptions = () => ({
  httpOnly: true,
  sameSite: 'strict',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 7 * 24 * 60 * 60 * 1000
});

const sanitizeUser = (userDoc) => {
  if (!userDoc) return null;
  const { password, __v, ...rest } = userDoc.toObject ? userDoc.toObject() : userDoc;
  return rest;
};

export const signUp = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body || {};

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'Full name, email, and password are required.' });
    }

    if (typeof password !== 'string' || password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
    }

    const normalizedEmail = normalizeEmail(email);
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({ message: 'User already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: fullName.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: role || undefined
    });

    const token = genToken(user._id.toString());
    res.cookie('token', token, buildCookieOptions());

    return res.status(201).json({
      message: 'User registered successfully.',
      user: sanitizeUser(user),
      token
    });
  } catch (error) {
    console.error('signUp error:', error);
    return res.status(500).json({ message: 'An unexpected error occurred during sign up.' });
  }
};

export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const normalizedEmail = normalizeEmail(email);
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = genToken(user._id.toString());
    res.cookie('token', token, buildCookieOptions());

    return res.status(200).json({
      message: 'Signed in successfully.',
      user: sanitizeUser(user),
      token
    });
  } catch (error) {
    console.error('signIn error:', error);
    return res.status(500).json({ message: 'An unexpected error occurred during sign in.' });
  }
};