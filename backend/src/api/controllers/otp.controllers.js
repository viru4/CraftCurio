import OTP from '../../models/OTP.js';
import User from '../../models/User.js';
import { sendOTPEmail } from '../../services/emailService.js';
import bcrypt from 'bcryptjs';
import genToken from '../../utils/token.js';
import Artisan from '../../models/Artisan.js';
import Collector from '../../models/Collector.js';

const normalizeEmail = (email = '') => email.trim().toLowerCase();

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

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

/**
 * Send OTP for Sign In
 */
export const sendOTPForSignIn = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }

    const normalizedEmail = normalizeEmail(email);

    // Check if user exists
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({ message: 'User not found. Please sign up first.' });
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Delete any existing OTPs for this email and purpose
    await OTP.deleteMany({ email: normalizedEmail, purpose: 'signin' });

    // Save new OTP
    await OTP.create({
      email: normalizedEmail,
      otp,
      purpose: 'signin',
      expiresAt
    });

    // Send OTP email (always succeeds - OTP is logged to console)
    const emailResult = await sendOTPEmail(normalizedEmail, otp, 'signin');
    
    // Determine response message based on email result
    let responseMessage = 'OTP sent to your email. Please check your inbox.';
    if (emailResult.message?.includes('console') || emailResult.message?.includes('failed')) {
      responseMessage = 'OTP generated. Please check the backend console for your OTP code.';
    }

    return res.status(200).json({
      message: responseMessage,
      email: normalizedEmail,
      // In development, include OTP in response for testing (remove in production)
      ...(process.env.NODE_ENV === 'development' && { 
        otp: otp, 
        note: 'OTP included in response for development only' 
      })
    });
  } catch (error) {
    console.error('sendOTPForSignIn error:', error);
    return res.status(500).json({ message: 'An unexpected error occurred.' });
  }
};

/**
 * Verify OTP for Sign In
 */
export const verifyOTPForSignIn = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required.' });
    }

    const normalizedEmail = normalizeEmail(email);

    // Find OTP record
    const otpRecord = await OTP.findOne({
      email: normalizedEmail,
      purpose: 'signin',
      verified: false
    }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return res.status(404).json({ message: 'OTP not found. Please request a new OTP.' });
    }

    // Check if OTP is expired
    if (new Date() > otpRecord.expiresAt) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    // Check attempts
    if (otpRecord.attempts >= 5) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(429).json({ message: 'Too many attempts. Please request a new OTP.' });
    }

    // Verify OTP
    if (otpRecord.otp !== otp) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      return res.status(400).json({ 
        message: `Invalid OTP. ${5 - otpRecord.attempts} attempts remaining.` 
      });
    }

    // OTP is valid - mark as verified and delete
    otpRecord.verified = true;
    await otpRecord.save();
    await OTP.deleteOne({ _id: otpRecord._id });

    // Get user and generate token
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const token = genToken(user._id.toString());
    res.cookie('token', token, buildCookieOptions());

    return res.status(200).json({
      message: 'Signed in successfully.',
      user: sanitizeUser(user),
      token
    });
  } catch (error) {
    console.error('verifyOTPForSignIn error:', error);
    return res.status(500).json({ message: 'An unexpected error occurred.' });
  }
};

/**
 * Send OTP for Sign Up
 */
export const sendOTPForSignUp = async (req, res) => {
  try {
    const { email, fullName, password, role } = req.body;

    if (!email || !fullName || !password) {
      return res.status(400).json({ message: 'Email, full name, and password are required.' });
    }

    if (typeof password !== 'string' || password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
    }

    const normalizedEmail = normalizeEmail(email);

    // Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists. Please sign in instead.' });
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Delete any existing OTPs for this email and purpose
    await OTP.deleteMany({ email: normalizedEmail, purpose: 'signup' });

    // Save new OTP with signup data in a temporary field (we'll store it in session or use it during verification)
    // For simplicity, we'll store the signup data temporarily
    await OTP.create({
      email: normalizedEmail,
      otp,
      purpose: 'signup',
      expiresAt,
      // Store signup data temporarily (we'll retrieve it during verification)
      signupData: JSON.stringify({ fullName, password, role: role || 'buyer' })
    });

    // Send OTP email (always succeeds - OTP is logged to console)
    const emailResult = await sendOTPEmail(normalizedEmail, otp, 'signup');
    
    // Determine response message based on email result
    let responseMessage = 'OTP sent to your email. Please check your inbox.';
    if (emailResult.message?.includes('console') || emailResult.message?.includes('failed')) {
      responseMessage = 'OTP generated. Please check the backend console for your OTP code.';
    }

    return res.status(200).json({
      message: responseMessage,
      email: normalizedEmail,
      // In development, include OTP in response for testing (remove in production)
      ...(process.env.NODE_ENV === 'development' && { 
        otp: otp, 
        note: 'OTP included in response for development only' 
      })
    });
  } catch (error) {
    console.error('sendOTPForSignUp error:', error);
    return res.status(500).json({ message: 'An unexpected error occurred.' });
  }
};

/**
 * Verify OTP for Sign Up
 */
export const verifyOTPForSignUp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required.' });
    }

    const normalizedEmail = normalizeEmail(email);

    // Find OTP record
    const otpRecord = await OTP.findOne({
      email: normalizedEmail,
      purpose: 'signup',
      verified: false
    }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return res.status(404).json({ message: 'OTP not found. Please request a new OTP.' });
    }

    // Check if OTP is expired
    if (new Date() > otpRecord.expiresAt) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    // Check attempts
    if (otpRecord.attempts >= 5) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(429).json({ message: 'Too many attempts. Please request a new OTP.' });
    }

    // Verify OTP
    if (otpRecord.otp !== otp) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      return res.status(400).json({ 
        message: `Invalid OTP. ${5 - otpRecord.attempts} attempts remaining.` 
      });
    }

    // OTP is valid - retrieve signup data
    let signupData;
    try {
      signupData = JSON.parse(otpRecord.signupData || '{}');
    } catch (e) {
      // If signupData is not stored, get from request body
      const { fullName, password, role } = req.body;
      if (!fullName || !password) {
        await OTP.deleteOne({ _id: otpRecord._id });
        return res.status(400).json({ message: 'Signup data missing. Please start the signup process again.' });
      }
      signupData = { fullName, password, role: role || 'buyer' };
    }

    // Mark OTP as verified and delete
    otpRecord.verified = true;
    await otpRecord.save();
    await OTP.deleteOne({ _id: otpRecord._id });

    // Validate role
    const validRoles = ['buyer', 'artisan', 'collector', 'admin'];
    const userRole = signupData.role && validRoles.includes(signupData.role) ? signupData.role : 'buyer';

    // Create user
    const hashedPassword = await bcrypt.hash(signupData.password, 10);

    const user = await User.create({
      name: signupData.fullName.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: userRole
    });

    // Create role-specific profile
    if (userRole === 'artisan') {
      const artisanCount = await Artisan.countDocuments();
      const artisanId = `artisan${artisanCount + 1}`;
      
      await Artisan.create({
        id: artisanId,
        userId: user._id,
        name: signupData.fullName.trim(),
        craftSpecialization: 'Not specified',
        verified: false
      });
    } else if (userRole === 'collector') {
      const collectorCount = await Collector.countDocuments();
      const collectorId = `collector${collectorCount + 1}`;
      
      await Collector.create({
        id: collectorId,
        userId: user._id,
        name: signupData.fullName.trim(),
        interests: []
      });
    }

    const token = genToken(user._id.toString());
    res.cookie('token', token, buildCookieOptions());

    return res.status(201).json({
      message: 'User registered successfully.',
      user: sanitizeUser(user),
      token
    });
  } catch (error) {
    console.error('verifyOTPForSignUp error:', error);
    if (error.code === 11000) {
      return res.status(409).json({ message: 'User already exists.' });
    }
    return res.status(500).json({ message: 'An unexpected error occurred during sign up.' });
  }
};
