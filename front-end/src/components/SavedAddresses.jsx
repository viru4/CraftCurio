import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getSavedAddresses, addAddress, deleteAddress, setDefaultAddress } from '../utils/api';
import { Plus, Trash2, MapPin, Check } from 'lucide-react';

/**
 * SavedAddresses - Component to display and manage saved addresses
 * Can be used in checkout, profile, or order pages
 */
const SavedAddresses = ({ 
  onSelectAddress, 
  showAddForm = false,
  selectedAddressId = null,
  className = ''
}) => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(showAddForm);
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    isDefault: false
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const response = await getSavedAddresses();
      setAddresses(response.addresses || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching addresses:', err);
      setError('Failed to load addresses');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    
    // Validate
    const requiredFields = ['fullName', 'address', 'city', 'state', 'zipCode', 'country'];
    const isValid = requiredFields.every(field => formData[field].trim() !== '');
    
    if (!isValid) {
      alert('Please fill in all fields');
      return;
    }

    try {
      setIsSaving(true);
      await addAddress(formData);
      await fetchAddresses();
      
      // Reset form
      setFormData({
        fullName: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        isDefault: false
      });
      setShowForm(false);
      setError(null);
    } catch (err) {
      console.error('Error adding address:', err);
      setError(err.response?.data?.message || 'Failed to add address');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    
    try {
      await deleteAddress(addressId);
      await fetchAddresses();
      setError(null);
    } catch (err) {
      console.error('Error deleting address:', err);
      alert('Failed to delete address');
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      await setDefaultAddress(addressId);
      await fetchAddresses();
      setError(null);
    } catch (err) {
      console.error('Error setting default:', err);
      alert('Failed to set default address');
    }
  };

  const handleSelectAddress = (address) => {
    if (onSelectAddress) {
      onSelectAddress(address);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Saved Addresses
        </h3>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 text-sm text-orange-600 hover:text-orange-700 font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add New Address
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Add Address Form */}
      {showForm && (
        <form onSubmit={handleAddAddress} className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-200">
          <h4 className="font-semibold text-gray-900">Add New Address</h4>
          
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
            required
          />
          
          <input
            type="text"
            name="address"
            placeholder="Street Address"
            value={formData.address}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
            required
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleInputChange}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              required
            />
            <input
              type="text"
              name="state"
              placeholder="State"
              value={formData.state}
              onChange={handleInputChange}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              name="zipCode"
              placeholder="ZIP Code"
              value={formData.zipCode}
              onChange={handleInputChange}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              required
            />
            <input
              type="text"
              name="country"
              placeholder="Country"
              value={formData.country}
              onChange={handleInputChange}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              required
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              name="isDefault"
              checked={formData.isDefault}
              onChange={handleInputChange}
              className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
            />
            Set as default address
          </label>
          
          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 font-medium text-sm"
            >
              {isSaving ? 'Saving...' : 'Save Address'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setFormData({
                  fullName: '',
                  address: '',
                  city: '',
                  state: '',
                  zipCode: '',
                  country: '',
                  isDefault: false
                });
              }}
              disabled={isSaving}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Addresses Grid */}
      {addresses.length === 0 && !showForm ? (
        <div className="text-center py-8 text-gray-500">
          <MapPin className="w-12 h-12 mx-auto mb-2 text-gray-400" />
          <p>No saved addresses yet</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-3 text-orange-600 hover:text-orange-700 font-medium text-sm"
          >
            Add your first address
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {addresses.map((addr) => (
            <div
              key={addr._id}
              onClick={() => handleSelectAddress(addr)}
              className={`relative bg-white border-2 rounded-lg p-4 transition-all cursor-pointer group hover:shadow-md ${
                selectedAddressId === addr._id 
                  ? 'border-orange-500 bg-orange-50' 
                  : 'border-gray-200 hover:border-orange-300'
              }`}
            >
              {/* Selection indicator */}
              {selectedAddressId === addr._id && (
                <div className="absolute top-2 right-2 bg-orange-600 text-white rounded-full p-1">
                  <Check className="w-4 h-4" />
                </div>
              )}

              {/* Address content */}
              <div className={selectedAddressId === addr._id ? 'pr-8' : 'pr-16'}>
                <p className="font-semibold text-gray-900 text-sm">{addr.fullName}</p>
                <p className="text-xs text-gray-600 mt-1">{addr.address}</p>
                <p className="text-xs text-gray-600">
                  {addr.city}, {addr.state} {addr.zipCode}
                </p>
                <p className="text-xs text-gray-600">{addr.country}</p>
                
                {addr.isDefault && (
                  <span className="inline-block mt-2 px-2 py-0.5 bg-orange-100 text-orange-800 text-xs font-medium rounded">
                    Default
                  </span>
                )}
              </div>

              {/* Action buttons */}
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {!addr.isDefault && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSetDefault(addr._id);
                    }}
                    className="p-1.5 bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-blue-600 rounded transition-colors"
                    title="Set as default"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteAddress(addr._id);
                  }}
                  className="p-1.5 bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600 rounded transition-colors"
                  title="Delete address"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

SavedAddresses.propTypes = {
  onSelectAddress: PropTypes.func,
  showAddForm: PropTypes.bool,
  selectedAddressId: PropTypes.string,
  className: PropTypes.string
};

export default SavedAddresses;
