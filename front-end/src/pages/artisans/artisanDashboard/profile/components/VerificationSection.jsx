import React, { useState } from 'react';
import { Award, Shield, CheckCircle, Plus, Trash2, Upload, FileText, X, Image, ExternalLink } from 'lucide-react';

const VerificationSection = ({ profileData, onInputChange }) => {
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
        imageUrl: newAward.imageUrl.trim()
      };
      const updatedAwards = [...awards, awardData];
      onInputChange('awards', updatedAwards);
      setNewAward({ name: '', imageUrl: '' });
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
        imageUrl: newCertification.imageUrl.trim()
      };
      const updatedCertifications = [...certifications, certData];
      onInputChange('certifications', updatedCertifications);
      setNewCertification({ name: '', imageUrl: '' });
    }
  };

  // Handle removing a certification
  const handleRemoveCertification = (index) => {
    const updatedCertifications = certifications.filter((_, i) => i !== index);
    onInputChange('certifications', updatedCertifications);
  };

  // Handle verification toggle
  const handleVerificationToggle = () => {
    onInputChange('verified', !verified);
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
        <div className="bg-white border border-stone-200 rounded-lg p-4 sm:p-6">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className={`
              flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center
              ${verified ? 'bg-green-100' : 'bg-orange-100'}
            `}>
              {verified ? (
                <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
              ) : (
                <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
              )}
            </div>
            
            <div className="flex-1 space-y-3 sm:space-y-4">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-stone-900 mb-1 sm:mb-2">
                  {verified ? 'Verified Artisan' : 'Verification Pending'}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {verified 
                    ? 'Your profile has been verified. This badge shows customers that you are a trusted artisan on CraftCurio.'
                    : 'Complete your profile and submit verification documents to get your verified badge. This helps build trust with customers.'
                  }
                </p>
              </div>

              {/* Verification Toggle (for demo purposes) */}
              <div className="flex items-center gap-2 sm:gap-3 pt-2">
                <button
                  onClick={handleVerificationToggle}
                  className={`
                    relative inline-flex h-6 w-11 sm:h-7 sm:w-14 items-center rounded-full transition-colors
                    ${verified ? 'bg-green-500' : 'bg-stone-300'}
                  `}
                >
                  <span
                    className={`
                      inline-block h-4 w-4 sm:h-5 sm:w-5 transform rounded-full bg-white transition-transform
                      ${verified ? 'translate-x-6 sm:translate-x-8' : 'translate-x-1'}
                    `}
                  />
                </button>
                <span className="text-xs sm:text-sm font-medium text-stone-700">
                  {verified ? 'Verified' : 'Not Verified'}
                </span>
              </div>

              {!verified && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 sm:p-4 mt-3 sm:mt-4">
                  <h4 className="text-xs sm:text-sm font-semibold text-orange-900 mb-2">
                    Verification Requirements:
                  </h4>
                  <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-orange-800">
                    <li className="flex items-start gap-2">
                      <span className="text-orange-500 mt-0.5">•</span>
                      <span>Complete all profile information</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-500 mt-0.5">•</span>
                      <span>Upload valid government ID</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-500 mt-0.5">•</span>
                      <span>Provide proof of craft expertise</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-500 mt-0.5">•</span>
                      <span>Submit at least 3 product listings</span>
                    </li>
                  </ul>
                  <button className="mt-3 sm:mt-4 w-full sm:w-auto px-4 py-2 bg-orange-600 text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-orange-700 transition-colors flex items-center justify-center gap-2">
                    <Upload className="w-3 h-3 sm:w-4 sm:h-4" />
                    Submit Verification Documents
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
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
              <div className="flex items-center gap-2">
                <Image className="w-4 h-4 text-stone-400 flex-shrink-0" />
                <input
                  type="url"
                  value={newAward.imageUrl}
                  onChange={(e) => setNewAward(prev => ({ ...prev, imageUrl: e.target.value }))}
                  placeholder="Photo URL (optional - link to award certificate/photo)"
                  className="flex-1 px-3 py-2 text-xs sm:text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#ec6d13] focus:border-transparent"
                />
              </div>
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
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-stone-400 flex-shrink-0" />
                <input
                  type="url"
                  value={newCertification.imageUrl}
                  onChange={(e) => setNewCertification(prev => ({ ...prev, imageUrl: e.target.value }))}
                  placeholder="Document URL (optional - link to certificate/document)"
                  className="flex-1 px-3 py-2 text-xs sm:text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#ec6d13] focus:border-transparent"
                />
              </div>
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
