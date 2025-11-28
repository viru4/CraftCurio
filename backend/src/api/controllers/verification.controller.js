import Verification from '../../models/Verification.js';
import Artisan from '../../models/Artisan.js';

// Submit verification request (Artisan)
export const submitVerification = async (req, res) => {
  try {
    const userId = req.user.id;
    const { fullName, idType, idNumber, idDocumentUrl, craftProofUrl, businessRegistrationUrl, additionalInfo } = req.body;

    // Check if user already has a pending or approved verification
    const existingVerification = await Verification.findOne({
      userId,
      status: { $in: ['pending', 'approved'] }
    });

    if (existingVerification) {
      return res.status(400).json({
        success: false,
        message: 'You already have a verification request in progress or approved'
      });
    }

    // Get artisan ID
    const artisan = await Artisan.findOne({ userId });
    if (!artisan) {
      return res.status(404).json({
        success: false,
        message: 'Artisan profile not found. Please create your profile first.'
      });
    }

    // Create verification request
    const verification = new Verification({
      artisanId: artisan.id,
      userId,
      fullName,
      idType,
      idNumber,
      idDocumentUrl,
      craftProofUrl,
      businessRegistrationUrl,
      additionalInfo
    });

    await verification.save();

    res.status(201).json({
      success: true,
      message: 'Verification request submitted successfully',
      data: verification
    });
  } catch (error) {
    console.error('Submit verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit verification request',
      error: error.message
    });
  }
};

// Get user's verification request (Artisan)
export const getMyVerification = async (req, res) => {
  try {
    const userId = req.user.id;

    const verification = await Verification.findOne({ userId })
      .sort({ createdAt: -1 }); // Get most recent

    if (!verification) {
      return res.status(404).json({
        success: false,
        message: 'No verification request found'
      });
    }

    res.status(200).json({
      success: true,
      data: verification
    });
  } catch (error) {
    console.error('Get verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch verification request',
      error: error.message
    });
  }
};

// Get all verification requests (Admin)
export const getAllVerifications = async (req, res) => {
  try {
    const { status, page = 1, limit = 10, search, userId } = req.query;

    const query = {};
    if (status && status !== 'all') {
      query.status = status;
    }
    if (userId) {
      query.userId = userId;
    }
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { idNumber: { $regex: search, $options: 'i' } },
        { artisanId: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const verifications = await Verification.find(query)
      .populate('userId', 'username email')
      .populate('reviewedBy', 'username email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Verification.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        verifications,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get all verifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch verification requests',
      error: error.message
    });
  }
};

// Get specific verification request (Admin)
export const getVerificationById = async (req, res) => {
  try {
    const { id } = req.params;

    const verification = await Verification.findById(id)
      .populate('userId', 'username email phone')
      .populate('reviewedBy', 'username email')
      .populate({
        path: 'artisanId',
        select: 'name craftSpecialization location briefBio'
      });

    if (!verification) {
      return res.status(404).json({
        success: false,
        message: 'Verification request not found'
      });
    }

    res.status(200).json({
      success: true,
      data: verification
    });
  } catch (error) {
    console.error('Get verification by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch verification request',
      error: error.message
    });
  }
};

// Approve verification request (Admin)
export const approveVerification = async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.user.id;
    const { comments } = req.body;

    const verification = await Verification.findById(id);
    if (!verification) {
      return res.status(404).json({
        success: false,
        message: 'Verification request not found'
      });
    }

    if (verification.status === 'approved') {
      return res.status(400).json({
        success: false,
        message: 'This verification request is already approved'
      });
    }

    // Update verification status
    verification.status = 'approved';
    verification.adminComments = comments || 'Verification approved';
    verification.reviewedBy = adminId;
    verification.reviewedAt = new Date();
    await verification.save();

    // Update artisan's verified status
    await Artisan.findOneAndUpdate(
      { id: verification.artisanId },
      { verified: true },
      { new: true }
    );

    // IMPORTANT: Change user role to artisan
    const User = (await import('../../models/User.js')).default;
    await User.findByIdAndUpdate(
      verification.userId,
      { role: 'artisan' },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Verification approved successfully. User role changed to artisan.',
      data: verification
    });
  } catch (error) {
    console.error('Approve verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve verification',
      error: error.message
    });
  }
};

// Reject verification request (Admin)
export const rejectVerification = async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.user.id;
    const { comments } = req.body;

    if (!comments) {
      return res.status(400).json({
        success: false,
        message: 'Please provide comments for rejection'
      });
    }

    const verification = await Verification.findById(id);
    if (!verification) {
      return res.status(404).json({
        success: false,
        message: 'Verification request not found'
      });
    }

    // Update verification status
    verification.status = 'rejected';
    verification.adminComments = comments;
    verification.reviewedBy = adminId;
    verification.reviewedAt = new Date();
    await verification.save();

    res.status(200).json({
      success: true,
      message: 'Verification rejected',
      data: verification
    });
  } catch (error) {
    console.error('Reject verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject verification',
      error: error.message
    });
  }
};
