import User from '../../models/User.js';
import Artisan from '../../models/Artisan.js';
import bcrypt from 'bcryptjs';
import genToken from '../../utils/token.js';
import Collector from '../../models/Collector.js';
import { generateCollectorId } from '../../utils/collectorIdentifier.js';

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

    // Validate role
    const validRoles = ['buyer', 'artisan', 'collector'];
    const userRole = role && validRoles.includes(role) ? role : 'buyer';

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
      role: userRole
    });

    // Create role-specific profile
    let artisan, collector;
    if (userRole === 'artisan') {
      // Generate unique artisan ID
      const artisanCount = await Artisan.countDocuments();
      const artisanId = `artisan${artisanCount + 1}`;
      
      artisan = await Artisan.create({
        id: artisanId,
        userId: user._id,
        name: fullName.trim(),
        craftSpecialization: 'Not specified',
        verified: false
      });
    } else if (userRole === 'collector') {
      const collectorId = await generateCollectorId();

      collector = await Collector.create({
        id: collectorId,
        userId: user._id,
        name: fullName.trim(),
        interests: []
      });
    }

    const token = genToken(user._id.toString());
    res.cookie('token', token, buildCookieOptions());

    const userData = sanitizeUser(user);
    
    // Add role-specific IDs to user data
    if (artisan) {
      userData.artisanId = artisan._id;
      userData.artisanProfileId = artisan.id;
    } else if (collector) {
      userData.collectorId = collector._id;
      userData.collectorProfileId = collector.id;
    }

    return res.status(201).json({
      message: 'User registered successfully.',
      user: userData,
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

    // Fetch role-specific profile ID
    const userData = sanitizeUser(user);
    
    if (user.role === 'artisan') {
      const artisan = await Artisan.findOne({ userId: user._id });
      if (artisan) {
        userData.artisanId = artisan._id;
        userData.artisanProfileId = artisan.id; // Custom ID like "artisan1"
      }
    } else if (user.role === 'collector') {
      const collector = await Collector.findOne({ userId: user._id });
      if (collector) {
        userData.collectorId = collector._id;
        userData.collectorProfileId = collector.id; // Custom ID like "collector1"
      }
    }

    return res.status(200).json({
      message: 'Signed in successfully.',
      user: userData,
      token
    });
  } catch (error) {
    console.error('signIn error:', error);
    return res.status(500).json({ message: 'An unexpected error occurred during sign in.' });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie('token', buildCookieOptions());
    return res.status(200).json({ message: 'Logged out successfully.' });
  } catch (error) {
    console.error('logout error:', error);
    return res.status(500).json({ message: 'An unexpected error occurred during logout.' });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    // Get fresh user data from database
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get synced profile image
    const syncedProfileImage = await getSyncedProfileImage(user);
    if (syncedProfileImage && syncedProfileImage !== user.profileImage) {
      user.profileImage = syncedProfileImage;
    }

    const userData = sanitizeUser(user);
    
    // Fetch role-specific profile ID
    if (user.role === 'artisan') {
      const artisan = await Artisan.findOne({ userId: user._id });
      if (artisan) {
        userData.artisanId = artisan._id;
        userData.artisanProfileId = artisan.id; // Custom ID like "artisan1"
        // Include artisan profile photo if user doesn't have one
        if (!userData.profileImage && artisan.profilePhotoUrl) {
          userData.profileImage = artisan.profilePhotoUrl;
        }
      }
    } else if (user.role === 'collector') {
      const collector = await Collector.findOne({ userId: user._id });
      if (collector) {
        userData.collectorId = collector._id;
        userData.collectorProfileId = collector.id; // Custom ID like "collector1"
        // Include collector profile photo if user doesn't have one
        if (!userData.profileImage && collector.profilePhotoUrl) {
          userData.profileImage = collector.profilePhotoUrl;
        }
      }
    }

    return res.status(200).json({
      user: userData
    });
  } catch (error) {
    console.error('getCurrentUser error:', error);
    return res.status(500).json({ message: 'An unexpected error occurred.' });
  }
};

// Get user profile
// Helper function to get synced profile image
const getSyncedProfileImage = async (user) => {
  try {
    // If user has profileImage, use it (it's the source of truth)
    if (user.profileImage) {
      return user.profileImage;
    }

    // Otherwise, check role-specific profiles
    if (user.role === 'artisan') {
      const Artisan = (await import('../../models/Artisan.js')).default;
      const artisan = await Artisan.findOne({ userId: user._id }).select('profilePhotoUrl').lean();
      if (artisan?.profilePhotoUrl) {
        // Sync it back to User for consistency
        await User.findByIdAndUpdate(user._id, { profileImage: artisan.profilePhotoUrl });
        return artisan.profilePhotoUrl;
      }
    } else if (user.role === 'collector') {
      const Collector = (await import('../../models/Collector.js')).default;
      const collector = await Collector.findOne({ userId: user._id }).select('profilePhotoUrl').lean();
      if (collector?.profilePhotoUrl) {
        // Sync it back to User for consistency
        await User.findByIdAndUpdate(user._id, { profileImage: collector.profilePhotoUrl });
        return collector.profilePhotoUrl;
      }
    }

    return null;
  } catch (error) {
    console.error('Error getting synced profile image:', error);
    return user.profileImage || null;
  }
};

export const getProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get synced profile image
    const syncedProfileImage = await getSyncedProfileImage(user);
    if (syncedProfileImage && syncedProfileImage !== user.profileImage) {
      user.profileImage = syncedProfileImage;
    }

    return res.status(200).json({
      user: sanitizeUser(user)
    });
  } catch (error) {
    console.error('getProfile error:', error);
    return res.status(500).json({ message: 'Failed to fetch profile' });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const { name, phone, address, profileImage } = req.body;

    const updateData = {};
    if (name) updateData.name = name.trim();
    if (phone !== undefined) updateData.phone = phone;
    if (address) updateData.address = address;
    if (profileImage !== undefined) updateData.profileImage = profileImage;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Sync profile image to Artisan/Collector if user has that role
    if (profileImage !== undefined) {
      try {
        // Import models
        const Artisan = (await import('../../models/Artisan.js')).default;
        const Collector = (await import('../../models/Collector.js')).default;

        // Update Artisan profile photo if user is an artisan
        if (user.role === 'artisan') {
          await Artisan.findOneAndUpdate(
            { userId: user._id },
            { profilePhotoUrl: profileImage },
            { new: true }
          );
        }

        // Update Collector profile photo if user is a collector
        if (user.role === 'collector') {
          await Collector.findOneAndUpdate(
            { userId: user._id },
            { profilePhotoUrl: profileImage },
            { new: true }
          );
        }
      } catch (syncError) {
        console.error('Error syncing profile image to role-specific profile:', syncError);
        // Don't fail the request if sync fails, just log it
      }
    }

    return res.status(200).json({
      message: 'Profile updated successfully',
      user: sanitizeUser(user)
    });
  } catch (error) {
    console.error('updateProfile error:', error);
    return res.status(500).json({ message: 'Failed to update profile' });
  }
};

// Change password
export const changePassword = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long' });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Hash and update new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('changePassword error:', error);
    return res.status(500).json({ message: 'Failed to change password' });
  }
};