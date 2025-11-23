import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { otpSignInSchema, otpSignInDefaultValues } from '@/forms/SignInSchema'
import { useAuth } from '@/contexts/AuthContext'
import OTPInput from '@/components/auth/OTPInput'
import { Shield, ArrowLeft, Lock, Mail, AlertCircle } from 'lucide-react'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

export default function AdminLogin() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [step, setStep] = useState('email') // 'email' or 'otp'
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [otpError, setOtpError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSendingOTP, setIsSendingOTP] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const form = useForm({
    resolver: zodResolver(otpSignInSchema),
    defaultValues: otpSignInDefaultValues,
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  })
  const { register, handleSubmit, formState, getValues } = form
  const { errors, isSubmitting: formIsSubmitting } = formState

  // Step 1: Send OTP (Admin Only)
  async function onSendOTP() {
    const { email: formEmail } = getValues()
    if (isSendingOTP) return
    setError('')
    setSuccessMessage('')
    setIsSendingOTP(true)

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/send-otp-signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formEmail }),
        credentials: 'include',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send OTP')
      }

      setEmail(formEmail)
      setStep('otp')
      
      if (data.otp) {
        setSuccessMessage(`Development Mode - OTP: ${data.otp}`)
        console.log('🔐 Admin OTP:', data.otp)
      } else {
        setSuccessMessage('OTP sent to your email. Please check your inbox.')
      }
    } catch (err) {
      const message = err?.message || 'Failed to send OTP. Please try again.'
      setError(message)
    } finally {
      setIsSendingOTP(false)
    }
  }

  // Step 2: Verify OTP (Admin Only)
  async function onVerifyOTP(otpValue) {
    if (isSubmitting) return
    setOtpError('')
    setError('')
    setIsSubmitting(true)

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/verify-otp-signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp: otpValue }),
        credentials: 'include',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Invalid OTP')
      }

      // Check if user is admin
      if (data.user.role !== 'admin') {
        setOtpError('Access denied. Admin credentials required.')
        setOtp('')
        setIsSubmitting(false)
        return
      }

      // Login successful - Admin verified
      login(data.user, data.token)
      navigate('/admin')
    } catch (err) {
      const message = err?.message || 'Invalid OTP. Please try again.'
      setOtpError(message)
      setOtp('')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResendOTP = () => {
    setOtp('')
    setOtpError('')
    setError('')
    setSuccessMessage('')
    onSendOTP()
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJjMi4yMSAwIDQgMS43OSA0IDRzLTEuNzkgNC00IDRoLTJ2MmMwIDIuMjEtMS43OSA0LTQgNHMtNC0xLjc5LTQtNHYtMmgtMmMtMi4yMSAwLTQtMS43OS00LTRzMS43OS00IDQtNGgydi0yYzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-40"></div>

      {/* Back to Home Button */}
      <Link
        to="/"
        className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm sm:text-base group"
      >
        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="hidden sm:inline">Back to Home</span>
      </Link>

      {/* Main Container */}
      <div className="w-full max-w-md relative z-10">
        {/* Admin Badge */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full flex items-center gap-2 shadow-lg shadow-orange-500/50">
            <Shield className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="font-bold text-sm sm:text-base tracking-wide">ADMIN ACCESS</span>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 sm:p-8 md:p-10 space-y-6 sm:space-y-8">
          {/* Header */}
          <div className="text-center space-y-2 sm:space-y-3">
            <div className="flex justify-center mb-3 sm:mb-4">
              <div className="bg-gradient-to-br from-orange-500 to-red-600 p-3 sm:p-4 rounded-2xl shadow-lg">
                <Lock className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900">
              {step === 'email' ? 'Admin Login' : 'Verify Your Identity'}
            </h1>
            <p className="text-sm sm:text-base text-slate-600">
              {step === 'email' 
                ? 'Secure authentication with OTP verification' 
                : `Enter the code sent to ${email}`}
            </p>
          </div>

          {/* Alert for admin access */}
          {step === 'email' && (
            <div className="bg-orange-50 border-l-4 border-orange-500 p-3 sm:p-4 rounded-r-lg flex items-start gap-2 sm:gap-3">
              <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500 flex-shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-orange-800">
                <p className="font-semibold mb-1">Restricted Access</p>
                <p>This portal is exclusively for administrators. Unauthorized access attempts will be logged.</p>
              </div>
            </div>
          )}

          {/* Form Steps */}
          {step === 'email' ? (
            <form onSubmit={handleSubmit(onSendOTP)} className="space-y-5 sm:space-y-6" noValidate>
              {/* Email Input */}
              <div className="space-y-2">
                <label htmlFor="admin-email" className="block text-sm font-semibold text-slate-700">
                  Admin Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="admin-email"
                    type="email"
                    autoComplete="email"
                    placeholder="admin@craftcurio.com"
                    className="block w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 text-sm sm:text-base border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all placeholder:text-slate-400 bg-white"
                    {...register('email')}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSendingOTP || formIsSubmitting}
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-3 sm:py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                {isSendingOTP ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sending OTP...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    Send Verification Code
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-5 sm:space-y-6">
              {/* Success Message */}
              {successMessage && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-3 sm:px-4 py-3 rounded-lg text-xs sm:text-sm">
                  {successMessage}
                </div>
              )}

              {/* OTP Input */}
              <div className="space-y-3 sm:space-y-4">
                <label className="block text-sm font-semibold text-slate-700 text-center">
                  Enter 6-Digit Verification Code
                </label>
                <OTPInput
                  value={otp}
                  onChange={setOtp}
                  onComplete={onVerifyOTP}
                  error={otpError}
                  disabled={isSubmitting}
                />
              </div>

              {/* Error Message */}
              {otpError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm text-center flex items-center justify-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  <span>{otpError}</span>
                </div>
              )}

              {/* Verify Button */}
              <button
                onClick={() => onVerifyOTP(otp)}
                disabled={otp.length !== 6 || isSubmitting}
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-3 sm:py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Verifying...
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    Verify & Login
                  </>
                )}
              </button>

              {/* Resend OTP */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-xs sm:text-sm">
                <span className="text-slate-600">Didn't receive the code?</span>
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={isSendingOTP}
                  className="font-semibold text-orange-600 hover:text-orange-700 disabled:opacity-50 transition-colors underline"
                >
                  {isSendingOTP ? 'Sending...' : 'Resend OTP'}
                </button>
              </div>

              {/* Change Email */}
              <button
                type="button"
                onClick={() => {
                  setStep('email')
                  setOtp('')
                  setOtpError('')
                  setError('')
                  setSuccessMessage('')
                }}
                className="w-full text-sm text-slate-600 hover:text-slate-900 font-medium transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Change Email Address
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6 sm:mt-8 space-y-3 sm:space-y-4">
          <p className="text-xs sm:text-sm text-slate-400">
            Protected by OTP verification and role-based access control
          </p>
          <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-slate-500">
            <Shield className="w-4 h-4" />
            <span>Secure Admin Portal</span>
          </div>
        </div>
      </div>
    </div>
  )
}
