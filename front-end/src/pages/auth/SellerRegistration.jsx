import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/layout'
import { Upload, FileText, Building, CheckCircle } from 'lucide-react'
import { API_BASE_URL } from '@/utils/api'

export default function SellerRegistration() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    businessName: '',
    email: '',
    phone: '',
    businessType: 'individual',
    taxId: '',
    idType: 'passport',
    idNumber: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    website: '',
    portfolio: '',
    additionalInfo: '',
    agreeTerms: false
  })

  // File upload states
  const [idDocumentUrl, setIdDocumentUrl] = useState('')
  const [craftProofUrl, setCraftProofUrl] = useState('')
  const [businessRegistrationUrl, setBusinessRegistrationUrl] = useState('')
  const [uploadingId, setUploadingId] = useState(false)
  const [uploadingCraft, setUploadingCraft] = useState(false)
  const [uploadingBusiness, setUploadingBusiness] = useState(false)
  const [uploadProgress, setUploadProgress] = useState({
    id: 0,
    craft: 0,
    business: 0
  })

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleFileUpload = async (file, type) => {
    if (!file) return

    try {
      // Set loading state
      if (type === 'id') setUploadingId(true)
      else if (type === 'craft') setUploadingCraft(true)
      else setUploadingBusiness(true)

      // Upload to Cloudinary
      const { uploadSingleImage } = await import('@/utils/uploadApi.js')
      const result = await uploadSingleImage(file, 'verification', (percent) => {
        setUploadProgress(prev => ({ ...prev, [type]: percent }))
      })

      // Update state with URL
      if (type === 'id') setIdDocumentUrl(result.url)
      else if (type === 'craft') setCraftProofUrl(result.url)
      else setBusinessRegistrationUrl(result.url)

    } catch (error) {
      console.error('Error uploading file:', error)
      alert('Failed to upload file. Please try again.')
    } finally {
      if (type === 'id') setUploadingId(false)
      else if (type === 'craft') setUploadingCraft(false)
      else setUploadingBusiness(false)
    }
  }

  async function onSubmit(e) {
    e.preventDefault()

    if (!formData.agreeTerms) {
      alert('Please agree to the terms and conditions')
      return
    }

    if (!idDocumentUrl || !craftProofUrl) {
      alert('Please upload required documents (Government ID and Craft Proof)')
      return
    }

    setLoading(true)

    try {
      const token = localStorage.getItem('token')

      // Submit seller registration as verification request
      const submitData = {
        fullName: formData.fullName,
        idType: formData.idType,
        idNumber: formData.idNumber,
        idDocumentUrl,
        craftProofUrl,
        businessRegistrationUrl,
        additionalInfo: `Business: ${formData.businessName}\nBusiness Type: ${formData.businessType}\nTax ID: ${formData.taxId}\nAddress: ${formData.addressLine1}, ${formData.addressLine2 ? formData.addressLine2 + ', ' : ''}${formData.city}, ${formData.state} ${formData.postalCode}, ${formData.country}\nWebsite: ${formData.website || 'N/A'}\nPortfolio: ${formData.portfolio || 'N/A'}\n\nAdditional Info:\n${formData.additionalInfo}`
      }

      const response = await fetch(`${API_BASE_URL}/api/verification/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(submitData)
      })

      const result = await response.json()

      if (result.success) {
        setSubmitted(true)
      } else {
        throw new Error(result.message || 'Failed to submit registration')
      }
    } catch (error) {
      console.error('Error submitting registration:', error)
      alert(error.message || 'Failed to submit registration. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
      <Navbar />
      <main className="flex-1 pt-16 md:pt-20">
        <section className="py-12 px-4 md:px-10 lg:px-20 bg-white">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)] mb-2">Become a Seller / Artisan</h1>
            <p className="text-[var(--text-secondary)] mb-8">Provide your details for verification. We require identity and craft proof to keep our marketplace trustworthy.</p>

            {!submitted ? (
              <form noValidate onSubmit={onSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="bg-stone-50 border border-stone-200 rounded-lg p-6">
                  <h2 className="text-xl font-bold text-stone-900 mb-4">Personal Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Field label="Full Legal Name">
                      <Input name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="As shown on your ID" required />
                    </Field>
                    <Field label="Business / Shop Name">
                      <Input name="businessName" value={formData.businessName} onChange={handleInputChange} placeholder="CraftCurio Studio" required />
                    </Field>
                    <Field label="Email">
                      <Input name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="you@example.com" required />
                    </Field>
                    <Field label="Phone">
                      <Input name="phone" type="tel" value={formData.phone} onChange={handleInputChange} placeholder="+1 555 000 0000" required />
                    </Field>
                  </div>
                </div>

                {/* Business Details */}
                <div className="bg-stone-50 border border-stone-200 rounded-lg p-6">
                  <h2 className="text-xl font-bold text-stone-900 mb-4">Business Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Field label="Business Type">
                      <select name="businessType" value={formData.businessType} onChange={handleInputChange} className="w-full h-10 rounded-md border px-3 text-sm">
                        <option value="individual">Individual</option>
                        <option value="company">Company</option>
                      </select>
                    </Field>
                    <Field label="Tax ID / GST / VAT">
                      <Input name="taxId" value={formData.taxId} onChange={handleInputChange} placeholder="ABCD123456" required />
                    </Field>
                  </div>
                </div>

                {/* Identification */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h2 className="text-xl font-bold text-blue-900 mb-4">Identity Verification</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Field label="Government ID Type">
                      <select name="idType" value={formData.idType} onChange={handleInputChange} className="w-full h-10 rounded-md border px-3 text-sm">
                        <option value="passport">Passport</option>
                        <option value="drivers_license">Driver's License</option>
                        <option value="national_id">National ID Card</option>
                        <option value="aadhaar">Aadhaar Card</option>
                      </select>
                    </Field>
                    <Field label="ID Number">
                      <Input name="idNumber" value={formData.idNumber} onChange={handleInputChange} placeholder="Enter your ID number" required />
                    </Field>
                  </div>

                  {/* ID Document Upload */}
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-blue-900 mb-2">
                      Government ID Document <span className="text-red-500">*</span>
                    </label>
                    {uploadingId ? (
                      <div className="mt-1 flex flex-col justify-center px-6 pt-5 pb-6 border-2 border-blue-300 border-dashed rounded-lg bg-blue-50">
                        <div className="w-full max-w-xs mx-auto space-y-2">
                          <div className="flex justify-between text-xs text-blue-600 font-medium">
                            <span>Uploading...</span>
                            <span>{uploadProgress.id}%</span>
                          </div>
                          <div className="w-full bg-blue-200 rounded-full h-2.5">
                            <div
                              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out"
                              style={{ width: `${uploadProgress.id}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <label className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-blue-300 border-dashed rounded-lg hover:border-blue-400 transition-colors cursor-pointer">
                        <div className="space-y-1 text-center">
                          <Upload className="mx-auto h-12 w-12 text-blue-400" />
                          <div className="flex text-sm text-blue-600 justify-center">
                            <span className="font-medium text-blue-600 hover:text-blue-500">
                              Upload a file
                            </span>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-blue-500">PNG, JPG, PDF up to 10MB</p>
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => handleFileUpload(e.target.files[0], 'id')}
                            className="sr-only"
                          />
                        </div>
                      </label>
                    )}
                    {idDocumentUrl && <p className="mt-2 text-sm text-green-600">✓ File uploaded successfully</p>}
                  </div>

                  {/* Craft Proof Upload */}
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-blue-900 mb-2">
                      Proof of Craft Expertise <span className="text-red-500">*</span>
                    </label>
                    <p className="text-xs text-blue-700 mb-2">
                      Upload certificates, awards, workshop photos, or portfolio images
                    </p>
                    {uploadingCraft ? (
                      <div className="mt-1 flex flex-col justify-center px-6 pt-5 pb-6 border-2 border-blue-300 border-dashed rounded-lg bg-blue-50">
                        <div className="w-full max-w-xs mx-auto space-y-2">
                          <div className="flex justify-between text-xs text-blue-600 font-medium">
                            <span>Uploading...</span>
                            <span>{uploadProgress.craft}%</span>
                          </div>
                          <div className="w-full bg-blue-200 rounded-full h-2.5">
                            <div
                              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out"
                              style={{ width: `${uploadProgress.craft}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <label className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-blue-300 border-dashed rounded-lg hover:border-blue-400 transition-colors cursor-pointer">
                        <div className="space-y-1 text-center">
                          <FileText className="mx-auto h-12 w-12 text-blue-400" />
                          <div className="flex text-sm text-blue-600 justify-center">
                            <span className="font-medium text-blue-600 hover:text-blue-500">
                              Upload a file
                            </span>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-blue-500">PNG, JPG, PDF up to 10MB</p>
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => handleFileUpload(e.target.files[0], 'craft')}
                            className="sr-only"
                          />
                        </div>
                      </label>
                    )}
                    {craftProofUrl && <p className="mt-2 text-sm text-green-600">✓ File uploaded successfully</p>}
                  </div>

                  {/* Business Registration (Optional) */}
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-blue-900 mb-2">
                      Business Registration (Optional)
                    </label>
                    <p className="text-xs text-blue-700 mb-2">
                      GST certificate, business license, or registration document if applicable
                    </p>
                    {uploadingBusiness ? (
                      <div className="mt-1 flex flex-col justify-center px-6 pt-5 pb-6 border-2 border-blue-300 border-dashed rounded-lg bg-blue-50">
                        <div className="w-full max-w-xs mx-auto space-y-2">
                          <div className="flex justify-between text-xs text-blue-600 font-medium">
                            <span>Uploading...</span>
                            <span>{uploadProgress.business}%</span>
                          </div>
                          <div className="w-full bg-blue-200 rounded-full h-2.5">
                            <div
                              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out"
                              style={{ width: `${uploadProgress.business}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <label className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-blue-300 border-dashed rounded-lg hover:border-blue-400 transition-colors cursor-pointer">
                        <div className="space-y-1 text-center">
                          <Building className="mx-auto h-12 w-12 text-blue-400" />
                          <div className="flex text-sm text-blue-600 justify-center">
                            <span className="font-medium text-blue-600 hover:text-blue-500">
                              Upload a file
                            </span>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-blue-500">PNG, JPG, PDF up to 10MB</p>
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => handleFileUpload(e.target.files[0], 'business')}
                            className="sr-only"
                          />
                        </div>
                      </label>
                    )}
                    {businessRegistrationUrl && <p className="mt-2 text-sm text-green-600">✓ File uploaded successfully</p>}
                  </div>
                </div>

                {/* Address Information */}
                <div className="bg-stone-50 border border-stone-200 rounded-lg p-6">
                  <h2 className="text-xl font-bold text-stone-900 mb-4">Address Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Field label="Address Line 1">
                      <Input name="addressLine1" value={formData.addressLine1} onChange={handleInputChange} placeholder="123 Artisan St" required />
                    </Field>
                    <Field label="Address Line 2">
                      <Input name="addressLine2" value={formData.addressLine2} onChange={handleInputChange} placeholder="Suite, unit, etc. (optional)" />
                    </Field>
                    <Field label="City">
                      <Input name="city" value={formData.city} onChange={handleInputChange} required />
                    </Field>
                    <Field label="State / Province">
                      <Input name="state" value={formData.state} onChange={handleInputChange} required />
                    </Field>
                    <Field label="Postal / ZIP">
                      <Input name="postalCode" value={formData.postalCode} onChange={handleInputChange} required />
                    </Field>
                    <Field label="Country">
                      <Input name="country" value={formData.country} onChange={handleInputChange} required />
                    </Field>
                  </div>
                </div>

                {/* Portfolio Links */}
                <div className="bg-stone-50 border border-stone-200 rounded-lg p-6">
                  <h2 className="text-xl font-bold text-stone-900 mb-4">Portfolio (Optional)</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Field label="Website" helper="If you sell elsewhere, add a link">
                      <Input name="website" value={formData.website} onChange={handleInputChange} placeholder="https://example.com" />
                    </Field>
                    <Field label="Portfolio / Social Media">
                      <Input name="portfolio" value={formData.portfolio} onChange={handleInputChange} placeholder="https://instagram.com/yourshop" />
                    </Field>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="bg-stone-50 border border-stone-200 rounded-lg p-6">
                  <Field label="Additional Information">
                    <textarea
                      name="additionalInfo"
                      value={formData.additionalInfo}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="Tell us more about your craft, experience, or anything else that helps verify your expertise..."
                    />
                  </Field>
                </div>

                {/* Terms Agreement */}
                <div className="bg-stone-50 border border-stone-200 rounded-lg p-6">
                  <label className="inline-flex items-start gap-3 text-sm text-stone-700">
                    <input
                      type="checkbox"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleInputChange}
                      className="mt-1 h-4 w-4"
                    />
                    <span>I confirm that the information provided is accurate and I agree to the marketplace terms, including identity and craft verification. My information will be reviewed within 2-3 business days.</span>
                  </label>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-3">
                  <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                    {loading ? 'Submitting…' : 'Submit Application'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => window.history.back()}>
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-lg p-8">
                <div className="flex items-center gap-4 mb-4">
                  <CheckCircle className="w-16 h-16 text-green-600" />
                  <div>
                    <h2 className="text-2xl font-bold text-green-900 mb-2">Application Received!</h2>
                    <p className="text-green-800">Your seller registration has been submitted successfully.</p>
                  </div>
                </div>
                <p className="text-green-700 mb-4">
                  We will review your application and verify your documents within 2-3 business days. You will receive an email notification once your application is approved.
                </p>
                <Button onClick={() => window.location.href = '/'} className="bg-green-600 hover:bg-green-700">
                  Return to Home
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

function Field({ label, error, helper, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-stone-900 mb-1">{label}</label>
      {children}
      {helper && <p className="text-xs text-stone-600 mt-1">{helper}</p>}
      {error && <p className="text-sm mt-1 text-red-600">{error}</p>}
    </div>
  )
}
