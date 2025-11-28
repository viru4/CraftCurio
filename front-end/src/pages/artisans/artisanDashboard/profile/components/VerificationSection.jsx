import { Award, Shield, CheckCircle, Plus, Trash2, Upload, FileText, X, Image, ExternalLink, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/utils/api';
import ImageUpload from '@/components/common/ImageUpload';

// Verification Form Component
const VerificationForm = ({ verified, onVerificationUpdate }) => {
  const [verificationData, setVerificationData] = useState({
    fullName: '',
    idType: 'passport',
    idNumber: '',
    idDocument: null,
    idDocumentUrl: '',
    craftProof: null,
    craftProofUrl: '',
    businessRegistration: null,
    businessRegistrationUrl: '',
    additionalInfo: ''
  });
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadingFields, setUploadingFields] = useState({});
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [existingRequest, setExistingRequest] = useState(null);

  // Fetch existing verification request on mount and periodically
  useEffect(() => {
    const fetchVerificationStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/api/verification/my-request`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setExistingRequest(data.data);
            const newStatus = data.data.status;

            // If status changed to approved, refresh profile data
            if (newStatus === 'approved' && verificationStatus !== 'approved') {
              if (onVerificationUpdate) {
                onVerificationUpdate();
              }
            }

            setVerificationStatus(newStatus);
          }
        }
      } catch (error) {
        console.error('Error fetching verification status:', error);
      }
    };

    fetchVerificationStatus();

    // Poll every 30 seconds to check for status updates
    const interval = setInterval(fetchVerificationStatus, 30000);

    return () => clearInterval(interval);
  }, [verificationStatus, onVerificationUpdate]);

  const handleFileChange = async (field, file) => {
    if (!file) return;

    try {
      setUploadingFields(prev => ({ ...prev, [field]: true }));
      setUploadProgress(prev => ({ ...prev, [field]: 0 }));

      // Upload to Cloudinary
      const { uploadSingleImage } = await import('../../../../../utils/uploadApi.js');
      const result = await uploadSingleImage(file, 'verification', (percent) => {
        setUploadProgress(prev => ({ ...prev, [field]: percent }));
      });

      // Update form data with uploaded URL
      setVerificationData(prev => ({
        ...prev,
        [field]: file,
        [`${field}Url`]: result.url
      }));
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file. Please try again.');
    } finally {
      setUploadingFields(prev => ({ ...prev, [field]: false }));
      setUploadProgress(prev => ({ ...prev, [field]: 0 }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');

      // In production, upload files to cloud storage first
      // For now, we'll send the data
      const formData = {
        fullName: verificationData.fullName,
        idType: verificationData.idType,
        idNumber: verificationData.idNumber,
        idDocumentUrl: verificationData.idDocumentUrl,
        craftProofUrl: verificationData.craftProofUrl,
        businessRegistrationUrl: verificationData.businessRegistrationUrl,
        additionalInfo: verificationData.additionalInfo
      };

      const response = await fetch(`${API_BASE_URL}/api/verification/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.success) {
        setVerificationStatus('pending');
        setExistingRequest(result.data);
        alert('Verification request submitted successfully! We will review your application and get back to you soon.');
      } else {
        throw new Error(result.message || 'Failed to submit verification request');
      }
    } catch (error) {
      console.error('Error submitting verification:', error);
      alert(error.message || 'Failed to submit verification request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Helper to render file upload section with progress
  const renderFileUpload = (label, field, icon, description, required = true) => (
    <div>
      <label className="block text-sm font-medium text-stone-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {description && (
        <p className="text-xs text-stone-500 mb-2">
          {description}
        </p>
      )}

      {uploadingFields[field] ? (
        <div className="mt-1 flex flex-col justify-center px-6 pt-5 pb-6 border-2 border-stone-300 border-dashed rounded-lg bg-stone-50">
          <div className="w-full max-w-xs mx-auto space-y-2">
            <div className="flex justify-between text-xs text-stone-600 font-medium">
              <span>Uploading...</span>
              <span>{uploadProgress[field]}%</span>
            </div>
            <div className="w-full bg-stone-200 rounded-full h-2.5">
              <div
                className="bg-[#ec6d13] h-2.5 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${uploadProgress[field]}%` }}
              ></div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-stone-300 border-dashed rounded-lg hover:border-[#ec6d13] transition-colors">
          <div className="space-y-1 text-center">
            {icon}
            <div className="flex text-sm text-stone-600">
              <label className="relative cursor-pointer bg-white rounded-md font-medium text-[#ec6d13] hover:text-[#d65d0f]">
                <span>Upload a file</span>
                <input
                  type="file"
                  required={required && !verificationData[field]}
                  accept="image/*,.pdf"
                  onChange={(e) => handleFileChange(field, e.target.files[0])}
                  className="sr-only"
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-stone-500">PNG, JPG, PDF up to 10MB</p>
          </div>
        </div>
      )}

      {verificationData[`${field}Url`] && !uploadingFields[field] && (
        <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
          <CheckCircle className="w-4 h-4" />
          <span>File uploaded successfully</span>
          <a
            href={verificationData[`${field}Url`]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#ec6d13] hover:underline ml-2"
          >
            View
          </a>
        </div>
      )}
    </div>
  );

  if (verificationStatus === 'pending' || (existingRequest && existingRequest.status === 'pending')) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-yellow-800 mb-2">Verification Under Review</h3>
        <p className="text-sm text-yellow-600">
          Your verification request is currently being reviewed by our team. This process typically takes 2-3 business days.
        </p>
      </div>
    );
  }

  if (verified || verificationStatus === 'approved') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <Shield className="w-12 h-12 text-green-500 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-green-800 mb-2">You are a Verified Artisan!</h3>
        <p className="text-sm text-green-600">
          Congratulations! Your profile has been verified. You now have the verified badge on your profile.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white border border-stone-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-6 h-6 text-[#ec6d13]" />
          <h3 className="text-lg font-bold text-stone-900">Apply for Verification</h3>
        </div>

        <p className="text-sm text-stone-600 mb-6">
          Complete this form to get your verified badge. This helps build trust with customers and shows that you're a legitimate artisan.
        </p>

        <div className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Full Legal Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={verificationData.fullName}
              onChange={(e) => setVerificationData(prev => ({ ...prev, fullName: e.target.value }))}
              className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#ec6d13] focus:border-transparent"
              placeholder="As shown on your ID"
            />
          </div>

          {/* ID Type */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Government ID Type <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={verificationData.idType}
              onChange={(e) => setVerificationData(prev => ({ ...prev, idType: e.target.value }))}
              className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#ec6d13] focus:border-transparent"
            >
              <option value="passport">Passport</option>
              <option value="drivers_license">Driver's License</option>
              <option value="national_id">National ID Card</option>
              <option value="aadhaar">Aadhaar Card</option>
            </select>
          </div>

          {/* ID Number */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              ID Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={verificationData.idNumber}
              onChange={(e) => setVerificationData(prev => ({ ...prev, idNumber: e.target.value }))}
              className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#ec6d13] focus:border-transparent"
              placeholder="Enter your ID number"
            />
          </div>

          {/* ID Document Upload */}
          {
            renderFileUpload(
              "Government ID Document",
              "idDocument",
              <Upload className="mx-auto h-12 w-12 text-stone-400" />,
              null
            )
          }

          {/* Craft Proof Upload */}
          {
            renderFileUpload(
              "Proof of Craft Expertise",
              "craftProof",
              <FileText className="mx-auto h-12 w-12 text-stone-400" />,
              "Upload certificates, awards, workshop photos, or portfolio images"
            )
          }

          {/* Business Registration (Optional) */}
          {
            renderFileUpload(
              "Business Registration (Optional)",
              "businessRegistration",
              <FileText className="mx-auto h-12 w-12 text-stone-400" />,
              "GST certificate, business license, or registration document if applicable",
              false
            )
          }

          {/* Additional Information */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Additional Information
            </label>
            <textarea
              value={verificationData.additionalInfo}
              onChange={(e) => setVerificationData(prev => ({ ...prev, additionalInfo: e.target.value }))}
              rows={4}
              className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#ec6d13] focus:border-transparent resize-none"
              placeholder="Tell us more about your craft, experience, or anything else that helps verify your expertise..."
            />
          </div>
        </div >

        {/* Submit Button */}
        < div className="mt-6 flex items-center justify-between pt-6 border-t border-stone-200" >
          <p className="text-xs text-stone-500">
            Your information will be reviewed within 2-3 business days
          </p>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-[#ec6d13] text-white rounded-lg font-medium hover:bg-[#d65d0f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <Shield className="w-5 h-5" />
                <span>Submit Verification Request</span>
              </>
            )}
          </button>
        </div >
      </div >
    </form >
  );
};

const VerificationSection = ({ profileData, onInputChange, onVerificationUpdate }) => {
  const [newAward, setNewAward] = useState({ name: '', imageUrl: '' });
  const [newCertification, setNewCertification] = useState({ name: '', imageUrl: '' });
  const [activeSection, setActiveSection] = useState('verification');

  // Get data from profileData
  const verified = profileData.verified || false;
  const awards = profileData.awards || [];
  const certifications = profileData.certifications || [];

  // Handle adding a new award
  const handleAddAward = () => {
    if (newAward.name.trim()) {
      const awardData = {
        name: newAward.name.trim(),
        imageUrl: newAward.imageUrl || ''
      };
      const updatedAwards = [...awards, awardData];
      onInputChange('awards', updatedAwards);
      setNewAward({ name: '', imageUrl: '' });
    }
  };

  const handleAwardImageUpload = (uploadedUrls) => {
    if (uploadedUrls && uploadedUrls.length > 0) {
      setNewAward(prev => ({ ...prev, imageUrl: uploadedUrls[0] }));
    }
  };

  // Handle removing an award
  const handleRemoveAward = (index) => {
    const updatedAwards = awards.filter((_, i) => i !== index);
    onInputChange('awards', updatedAwards);
  };

  // Handle adding a new certification
  const handleAddCertification = () => {
    if (newCertification.name.trim()) {
      const certData = {
        name: newCertification.name.trim(),
        imageUrl: newCertification.imageUrl || ''
      };
      const updatedCertifications = [...certifications, certData];
      onInputChange('certifications', updatedCertifications);
      setNewCertification({ name: '', imageUrl: '' });
    }
  };

  const handleCertImageUpload = (uploadedUrls) => {
    if (uploadedUrls && uploadedUrls.length > 0) {
      setNewCertification(prev => ({ ...prev, imageUrl: uploadedUrls[0] }));
    }
  };

  // Handle removing a certification
  const handleRemoveCertification = (index) => {
    const updatedCertifications = certifications.filter((_, i) => i !== index);
    onInputChange('certifications', updatedCertifications);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 sm:gap-3 border-b border-stone-200 pb-3">
        <button
          onClick={() => setActiveSection('verification')}
          className={`
            flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg transition-all text-xs sm:text-sm font-medium
            ${activeSection === 'verification'
              ? 'bg-[#ec6d13] text-white shadow-md'
              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }
          `}
        >
          <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
          <span>Verification Status</span>
        </button>
        <button
          onClick={() => setActiveSection('awards')}
          className={`
            flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg transition-all text-xs sm:text-sm font-medium
            ${activeSection === 'awards'
              ? 'bg-[#ec6d13] text-white shadow-md'
              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }
          `}
        >
          <Award className="w-3 h-3 sm:w-4 sm:h-4" />
          <span>Awards ({awards.length})</span>
        </button>
        <button
          onClick={() => setActiveSection('certifications')}
          className={`
            flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg transition-all text-xs sm:text-sm font-medium
            ${activeSection === 'certifications'
              ? 'bg-[#ec6d13] text-white shadow-md'
              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }
          `}
        >
          <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
          <span>Certifications ({certifications.length})</span>
        </button>
      </div>

      {/* Verification Status Section */}
      {activeSection === 'verification' && (
        <VerificationForm
          verified={verified}
          profileData={profileData}
          onInputChange={onInputChange}
          onVerificationUpdate={onVerificationUpdate}
        />
      )}

      {/* Awards Section */}
      {activeSection === 'awards' && (
        <div className="space-y-4">
          {/* Add New Award */}
          <div className="bg-white border border-stone-200 rounded-lg p-3 sm:p-4">
            <label className="block text-xs sm:text-sm font-semibold text-stone-900 mb-2 sm:mb-3">
              Add New Award
            </label>
            <div className="space-y-3">
              <input
                type="text"
                value={newAward.name}
                onChange={(e) => setNewAward(prev => ({ ...prev, name: e.target.value }))}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleAddAward()}
                placeholder="Award name (e.g., Best Artisan Award 2023)"
                className="w-full px-3 py-2 text-xs sm:text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#ec6d13] focus:border-transparent"
              />
              <ImageUpload
                onUploadComplete={handleAwardImageUpload}
                multiple={false}
                maxFiles={1}
                label="Upload Award Certificate (Optional)"
                folder="verification/awards"
                showPreview={true}
                currentImages={newAward.imageUrl ? [newAward.imageUrl] : []}
                onRemoveImage={() => setNewAward(prev => ({ ...prev, imageUrl: '' }))}
              />
              <button
                onClick={handleAddAward}
                disabled={!newAward.name.trim()}
                className="w-full sm:w-auto px-4 py-2 bg-[#ec6d13] text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-[#d55a0a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                Add Award
              </button>
            </div>
          </div>

          {/* Awards List */}
          {awards.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              {awards.map((award, index) => {
                const awardName = typeof award === 'string' ? award : award.name;
                const awardImage = typeof award === 'object' ? award.imageUrl : null;

                return (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-lg overflow-hidden group hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row gap-3 p-3 sm:p-4">
                      {/* Award Image/Icon */}
                      <div className="flex-shrink-0">
                        {awardImage ? (
                          <div className="relative w-full sm:w-20 h-32 sm:h-20 rounded-lg overflow-hidden bg-white border border-amber-300">
                            <img
                              src={awardImage}
                              alt={awardName}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center"><svg class="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div>';
                              }}
                            />
                            {awardImage && (
                              <a
                                href={awardImage}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="absolute top-1 right-1 p-1 bg-white/90 rounded-md shadow-sm hover:bg-white transition-colors"
                              >
                                <ExternalLink className="w-3 h-3 text-amber-700" />
                              </a>
                            )}
                          </div>
                        ) : (
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-100 rounded-full flex items-center justify-center">
                            <Award className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
                          </div>
                        )}
                      </div>

                      {/* Award Details */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-semibold text-stone-900 break-words mb-1">
                          {awardName}
                        </p>
                        {awardImage && (
                          <p className="text-xs text-amber-700 flex items-center gap-1">
                            <Image className="w-3 h-3" />
                            <span className="truncate">Certificate attached</span>
                          </p>
                        )}
                      </div>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleRemoveAward(index)}
                        className="flex-shrink-0 self-start text-stone-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-stone-50 border-2 border-dashed border-stone-300 rounded-lg p-6 sm:p-8 text-center">
              <Award className="w-8 h-8 sm:w-12 sm:h-12 text-stone-400 mx-auto mb-2 sm:mb-3" />
              <p className="text-xs sm:text-sm text-stone-600 font-medium mb-1">No awards yet</p>
              <p className="text-xs text-stone-500">Add your achievements and awards to showcase your expertise</p>
            </div>
          )}
        </div>
      )}

      {/* Certifications Section */}
      {activeSection === 'certifications' && (
        <div className="space-y-4">
          {/* Add New Certification */}
          <div className="bg-white border border-stone-200 rounded-lg p-3 sm:p-4">
            <label className="block text-xs sm:text-sm font-semibold text-stone-900 mb-2 sm:mb-3">
              Add New Certification
            </label>
            <div className="space-y-3">
              <input
                type="text"
                value={newCertification.name}
                onChange={(e) => setNewCertification(prev => ({ ...prev, name: e.target.value }))}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleAddCertification()}
                placeholder="Certification name (e.g., Master Craftsman Certificate)"
                className="w-full px-3 py-2 text-xs sm:text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#ec6d13] focus:border-transparent"
              />
              <ImageUpload
                onUploadComplete={handleCertImageUpload}
                multiple={false}
                maxFiles={1}
                label="Upload Certification Document (Optional)"
                folder="verification/certifications"
                showPreview={true}
                currentImages={newCertification.imageUrl ? [newCertification.imageUrl] : []}
                onRemoveImage={() => setNewCertification(prev => ({ ...prev, imageUrl: '' }))}
              />
              <button
                onClick={handleAddCertification}
                disabled={!newCertification.name.trim()}
                className="w-full sm:w-auto px-4 py-2 bg-[#ec6d13] text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-[#d55a0a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                Add Certification
              </button>
            </div>
          </div>

          {/* Certifications List */}
          {certifications.length > 0 ? (
            <div className="grid grid-cols-1 gap-3">
              {certifications.map((cert, index) => {
                const certName = typeof cert === 'string' ? cert : cert.name;
                const certImage = typeof cert === 'object' ? cert.imageUrl : null;

                return (
                  <div
                    key={index}
                    className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg overflow-hidden group hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row gap-3 p-3 sm:p-4">
                      {/* Certification Image/Icon */}
                      <div className="flex-shrink-0">
                        {certImage ? (
                          <div className="relative w-full sm:w-24 h-32 sm:h-24 rounded-lg overflow-hidden bg-white border border-blue-300">
                            <img
                              src={certImage}
                              alt={certName}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center"><svg class="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg></div>';
                              }}
                            />
                            {certImage && (
                              <a
                                href={certImage}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="absolute top-1 right-1 p-1 bg-white/90 rounded-md shadow-sm hover:bg-white transition-colors"
                              >
                                <ExternalLink className="w-3 h-3 text-blue-700" />
                              </a>
                            )}
                          </div>
                        ) : (
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                          </div>
                        )}
                      </div>

                      {/* Certification Details */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-semibold text-stone-900 break-words mb-1">
                          {certName}
                        </p>
                        {certImage && (
                          <p className="text-xs text-blue-700 flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            <span className="truncate">Document attached</span>
                          </p>
                        )}
                      </div>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleRemoveCertification(index)}
                        className="flex-shrink-0 self-start text-stone-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-stone-50 border-2 border-dashed border-stone-300 rounded-lg p-6 sm:p-8 text-center">
              <FileText className="w-8 h-8 sm:w-12 sm:h-12 text-stone-400 mx-auto mb-2 sm:mb-3" />
              <p className="text-xs sm:text-sm text-stone-600 font-medium mb-1">No certifications yet</p>
              <p className="text-xs text-stone-500">Add your professional certifications and qualifications</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VerificationSection;
