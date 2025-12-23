import User from '../../models/User.js';

/**
 * Get all saved addresses for the authenticated user
 * @route GET /api/addresses
 */
export const getSavedAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('savedAddresses');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      addresses: user.savedAddresses || []
    });
  } catch (error) {
    console.error('Get saved addresses error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch addresses',
      error: error.message
    });
  }
};

/**
 * Add a new address
 * @route POST /api/addresses
 */
export const addAddress = async (req, res) => {
  try {
    const { fullName, address, city, state, zipCode, country, isDefault } = req.body;

    // Validate required fields
    if (!fullName || !address || !city || !state || !zipCode || !country) {
      return res.status(400).json({
        success: false,
        message: 'All address fields are required'
      });
    }

    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // If setting as default, unset all other defaults
    if (isDefault) {
      user.savedAddresses.forEach(addr => {
        addr.isDefault = false;
      });
    }

    // Add new address
    user.savedAddresses.push({
      fullName,
      address,
      city,
      state,
      zipCode,
      country,
      isDefault: isDefault || user.savedAddresses.length === 0, // First address is default
      addedAt: new Date()
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: 'Address added successfully',
      addresses: user.savedAddresses
    });
  } catch (error) {
    console.error('Add address error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add address',
      error: error.message
    });
  }
};

/**
 * Update an existing address
 * @route PUT /api/addresses/:addressId
 */
export const updateAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const { fullName, address, city, state, zipCode, country, isDefault } = req.body;

    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const addressIndex = user.savedAddresses.findIndex(
      addr => addr._id.toString() === addressId
    );

    if (addressIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    // If setting as default, unset all other defaults
    if (isDefault) {
      user.savedAddresses.forEach((addr, idx) => {
        addr.isDefault = idx === addressIndex;
      });
    }

    // Update address
    user.savedAddresses[addressIndex] = {
      ...user.savedAddresses[addressIndex].toObject(),
      fullName: fullName || user.savedAddresses[addressIndex].fullName,
      address: address || user.savedAddresses[addressIndex].address,
      city: city || user.savedAddresses[addressIndex].city,
      state: state || user.savedAddresses[addressIndex].state,
      zipCode: zipCode || user.savedAddresses[addressIndex].zipCode,
      country: country || user.savedAddresses[addressIndex].country,
      isDefault: isDefault !== undefined ? isDefault : user.savedAddresses[addressIndex].isDefault
    };

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Address updated successfully',
      addresses: user.savedAddresses
    });
  } catch (error) {
    console.error('Update address error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update address',
      error: error.message
    });
  }
};

/**
 * Delete an address
 * @route DELETE /api/addresses/:addressId
 */
export const deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;

    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const addressIndex = user.savedAddresses.findIndex(
      addr => addr._id.toString() === addressId
    );

    if (addressIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    // Check if deleting default address
    const wasDefault = user.savedAddresses[addressIndex].isDefault;

    // Remove address
    user.savedAddresses.splice(addressIndex, 1);

    // If deleted default and there are remaining addresses, make first one default
    if (wasDefault && user.savedAddresses.length > 0) {
      user.savedAddresses[0].isDefault = true;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Address deleted successfully',
      addresses: user.savedAddresses
    });
  } catch (error) {
    console.error('Delete address error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete address',
      error: error.message
    });
  }
};

/**
 * Set an address as default
 * @route PATCH /api/addresses/:addressId/default
 */
export const setDefaultAddress = async (req, res) => {
  try {
    const { addressId } = req.params;

    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const addressIndex = user.savedAddresses.findIndex(
      addr => addr._id.toString() === addressId
    );

    if (addressIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    // Unset all defaults and set the selected one
    user.savedAddresses.forEach((addr, idx) => {
      addr.isDefault = idx === addressIndex;
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Default address updated successfully',
      addresses: user.savedAddresses
    });
  } catch (error) {
    console.error('Set default address error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to set default address',
      error: error.message
    });
  }
};
