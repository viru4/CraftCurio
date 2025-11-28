import User from '../../models/User.js';
import Artisan from '../../models/Artisan.js';
import Collector from '../../models/Collector.js';
import bcrypt from 'bcryptjs';
import { generateCollectorId } from '../../utils/collectorIdentifier.js';

const sanitizeUser = (userDoc) => {
  if (!userDoc) return null;
  const { password, __v, ...rest } = userDoc.toObject ? userDoc.toObject() : userDoc;
  return rest;
};

// Get all users with filtering and pagination
export const getAllUsers = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search = '', 
      role = '', 
      status = '' 
    } = req.query;

    // Build query
    let query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (role && role !== 'all') {
      query.role = role;
    }

    // Fetch users
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .lean();

    // Get additional profile data
    const usersWithProfiles = await Promise.all(
      users.map(async (user) => {
        let profile = null;
        let isVerified = false;
        let isSuspended = false;

        if (user.role === 'artisan') {
          profile = await Artisan.findOne({ userId: user._id }).lean();
          isVerified = profile?.verified || false;
          isSuspended = profile?.suspended || false;
        } else if (user.role === 'collector') {
          profile = await Collector.findOne({ userId: user._id }).lean();
          isVerified = profile?.verified || false;
          isSuspended = profile?.suspended || false;
        }

        return {
          ...user,
          isVerified,
          isSuspended,
          isActive: !isSuspended,
          avatar: user.profileImage || `https://i.pravatar.cc/150?u=${user._id}`
        };
      })
    );

    // Apply status filter
    let filteredUsers = usersWithProfiles;
    if (status && status !== 'all') {
      if (status === 'active') {
        filteredUsers = filteredUsers.filter(u => u.isActive);
      } else if (status === 'suspended') {
        filteredUsers = filteredUsers.filter(u => u.isSuspended);
      } else if (status === 'pending') {
        filteredUsers = filteredUsers.filter(u => !u.isVerified);
      }
    }

    // Pagination
    const total = filteredUsers.length;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const paginatedUsers = filteredUsers.slice(skip, skip + parseInt(limit));

    return res.status(200).json({
      users: paginatedUsers,
      totalUsers: total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    console.error('getAllUsers error:', error);
    return res.status(500).json({ message: 'Failed to fetch users' });
  }
};

// Get single user by ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findById(id).select('-password').lean();
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let profile = null;
    let isVerified = false;
    let isSuspended = false;

    if (user.role === 'artisan') {
      profile = await Artisan.findOne({ userId: user._id }).lean();
      isVerified = profile?.verified || false;
      isSuspended = profile?.suspended || false;
    } else if (user.role === 'collector') {
      profile = await Collector.findOne({ userId: user._id }).lean();
      isVerified = profile?.verified || false;
      isSuspended = profile?.suspended || false;
    }

    const userWithProfile = {
      ...user,
      isVerified,
      isSuspended,
      isActive: !isSuspended,
      avatar: user.profileImage || `https://i.pravatar.cc/150?u=${user._id}`
    };

    return res.status(200).json({ user: userWithProfile });
  } catch (error) {
    console.error('getUserById error:', error);
    return res.status(500).json({ message: 'Failed to fetch user' });
  }
};

// Create new user (admin)
export const createUser = async (req, res) => {
  try {
    const { name, email, password, role = 'buyer', isActive = true } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role
    });

    // Create role-specific profile
    if (role === 'artisan') {
      const artisanCount = await Artisan.countDocuments();
      const artisanId = `artisan${artisanCount + 1}`;
      
      await Artisan.create({
        id: artisanId,
        userId: user._id,
        name: name.trim(),
        craftSpecialization: 'Not specified',
        verified: false,
        suspended: !isActive
      });
    } else if (role === 'collector') {
      const collectorId = await generateCollectorId();

      await Collector.create({
        id: collectorId,
        userId: user._id,
        name: name.trim(),
        interests: [],
        verified: false,
        suspended: !isActive
      });
    }

    return res.status(201).json({
      message: 'User created successfully',
      user: sanitizeUser(user)
    });
  } catch (error) {
    console.error('createUser error:', error);
    return res.status(500).json({ message: 'Failed to create user' });
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, isActive, isVerified, isSuspended } = req.body;

    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update basic user info
    if (name) user.name = name.trim();
    if (email) user.email = email.trim().toLowerCase();
    if (role) user.role = role;

    await user.save();

    // Update role-specific profile
    if (user.role === 'artisan') {
      const updateData = {};
      if (isVerified !== undefined) updateData.verified = isVerified;
      if (isSuspended !== undefined) updateData.suspended = isSuspended;
      
      await Artisan.findOneAndUpdate(
        { userId: user._id },
        updateData,
        { new: true }
      );
    } else if (user.role === 'collector') {
      const updateData = {};
      if (isVerified !== undefined) updateData.verified = isVerified;
      if (isSuspended !== undefined) updateData.suspended = isSuspended;
      
      await Collector.findOneAndUpdate(
        { userId: user._id },
        updateData,
        { new: true }
      );
    }

    return res.status(200).json({
      message: 'User updated successfully',
      user: sanitizeUser(user)
    });
  } catch (error) {
    console.error('updateUser error:', error);
    return res.status(500).json({ message: 'Failed to update user' });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Collect image URLs to delete from Cloudinary
    const imageUrls = [];
    if (user.profileImage) {
      imageUrls.push(user.profileImage);
    }

    // Delete role-specific profile and collect associated images
    if (user.role === 'artisan') {
      const artisan = await Artisan.findOne({ userId: user._id });
      if (artisan) {
        if (artisan.profilePhotoUrl) {
          imageUrls.push(artisan.profilePhotoUrl);
        }
        if (artisan.story?.photos && Array.isArray(artisan.story.photos)) {
          imageUrls.push(...artisan.story.photos);
        }
        await Artisan.findOneAndDelete({ userId: user._id });
      }
    } else if (user.role === 'collector') {
      const collector = await Collector.findOne({ userId: user._id });
      if (collector) {
        if (collector.profilePhotoUrl) {
          imageUrls.push(collector.profilePhotoUrl);
        }
        await Collector.findOneAndDelete({ userId: user._id });
      }
    }

    // Delete images from Cloudinary (non-blocking)
    if (imageUrls.length > 0) {
      try {
        const { deleteImages } = await import('../../services/uploadService.js');
        await deleteImages(imageUrls);
      } catch (error) {
        console.error('Error deleting images from Cloudinary:', error);
        // Continue with deletion even if image cleanup fails
      }
    }

    // Delete user
    await User.findByIdAndDelete(id);

    return res.status(200).json({
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('deleteUser error:', error);
    return res.status(500).json({ message: 'Failed to delete user' });
  }
};
