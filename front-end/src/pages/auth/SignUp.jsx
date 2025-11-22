import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signUpSchema, signUpDefaultValues } from '@/forms/SignUpSchema'
import { useAuth } from '@/contexts/AuthContext'
import Navbar from '@/components/layout/Navbar'
import OTPInput from '@/components/auth/OTPInput'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

export default function SignUpPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [step, setStep] = useState('form') // 'form' or 'otp'
  const [signupData, setSignupData] = useState(null)
  const [otp, setOtp] = useState('')
  const [otpError, setOtpError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSendingOTP, setIsSendingOTP] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [selectedRole, setSelectedRole] = useState('buyer')
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: signUpDefaultValues,
    mode: 'onSubmit',
  })
  const { register, handleSubmit, getValues, setValue, formState } = form
  const { errors, isSubmitting: formIsSubmitting } = formState

  // Step 1: Send OTP
  async function onSendOTP() {
    if (isSendingOTP) return
    const { email, password, fullName, role } = getValues()
    setError('')
    setSuccessMessage('')
    setIsSendingOTP(true)

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/send-otp-signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName,
          email,
          password,
          role: role || selectedRole,
        }),
        credentials: 'include',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send OTP')
      }

      setSignupData({ email, password, fullName, role: role || selectedRole })
      setStep('otp')
      
      // In development, if OTP is included in response, show it
      if (data.otp) {
        setSuccessMessage(`OTP: ${data.otp} (Development mode - check backend console for email OTP)`)
        console.log('📧 OTP for testing:', data.otp)
      } else {
        setSuccessMessage(data.message || 'OTP sent to your email. Please check your inbox.')
      }
    } catch (err) {
      const message = err?.message || 'Failed to send OTP. Please try again.'
      setError(message)
    } finally {
      setIsSendingOTP(false)
    }
  }

  // Step 2: Verify OTP and create account
  async function onVerifyOTP(otpValue) {
    if (isSubmitting || !signupData) return
    setOtpError('')
    setError('')
    setIsSubmitting(true)

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/verify-otp-signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: signupData.email,
          otp: otpValue,
          fullName: signupData.fullName,
          password: signupData.password,
          role: signupData.role,
        }),
        credentials: 'include',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Invalid OTP or signup failed')
      }

      // Signup successful
      login(data.user, data.token)
      navigate('/')
    } catch (err) {
      const message = err?.message || 'Invalid OTP. Please try again.'
      setOtpError(message)
      setOtp('') // Clear OTP on error
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResendOTP = () => {
    setOtp('')
    setOtpError('')
    onSendOTP()
  }

  return (
    <div className="bg-stone-50 min-h-screen w-full" style={{ ['--primary-color']: '#ec6d13', ['--secondary-color']: '#f4f2f0', ['--text-primary']: '#181411', ['--text-secondary']: '#897261' }}>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md space-y-6 sm:space-y-8">
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
              <div className="text-center">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">
                  {step === 'form' ? 'Create your account' : 'Verify your email'}
                </h2>
                <p className="mt-2 text-sm text-[var(--text-secondary)]">
                  {step === 'form' 
                    ? 'Join our community of artisans and collectors.' 
                    : `We've sent a 6-digit code to ${signupData?.email}`}
                </p>
              </div>

              {step === 'form' ? (
                <form className="mt-8 space-y-6" noValidate onSubmit={handleSubmit(onSendOTP)}>
                  <div className="rounded-md space-y-4">
                    <div>
                      <label className="sr-only" htmlFor="fullName">Name</label>
                      <input
                        id="fullName"
                        type="text"
                        placeholder="Full Name"
                        className="appearance-none relative block w-full px-4 py-3 placeholder:text-stone-500 text-[var(--text-primary)] focus:z-10 sm:text-sm rounded-md bg-[var(--secondary-color)] border border-[var(--secondary-color)] focus:border-[var(--primary-color)] outline-none"
                        {...register('fullName')}
                      />
                      {errors.fullName ? <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p> : null}
                    </div>
                    <div>
                      <label className="sr-only" htmlFor="email">Email address</label>
                      <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        placeholder="Email address"
                        className="appearance-none relative block w-full px-4 py-3 placeholder:text-stone-500 text-[var(--text-primary)] focus:z-10 sm:text-sm rounded-md bg-[var(--secondary-color)] border border-[var(--secondary-color)] focus:border-[var(--primary-color)] outline-none"
                        {...register('email')}
                      />
                      {errors.email ? <p className="mt-1 text-sm text-red-600">{errors.email.message}</p> : null}
                    </div>
                    <div>
                      <label className="sr-only" htmlFor="password">Password</label>
                      <div className="relative">
                        <input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          autoComplete="new-password"
                          placeholder="Password"
                          className="appearance-none relative block w-full px-4 py-3 placeholder:text-stone-500 text-[var(--text-primary)] sm:text-sm rounded-md bg-[var(--secondary-color)] border border-[var(--secondary-color)] focus:border-[var(--primary-color)] outline-none pr-12"
                          {...register('password')}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 z-10 flex items-center pr-3 text-stone-500 hover:text-[var(--primary-color)] transition-colors"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? (
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            </svg>
                          ) : (
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          )}
                        </button>
                      </div>
                      {errors.password ? <p className="mt-1 text-sm text-red-600">{errors.password.message}</p> : null}
                    </div>
                    
                    {/* Role Selection */}
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-primary)] mb-2" htmlFor="role">
                        Select Your Role
                      </label>
                      <div className="grid grid-cols-1 gap-2 sm:gap-3 sm:grid-cols-3">
                        {['buyer', 'artisan', 'collector'].map((role) => (
                          <label 
                            key={role}
                            className={`relative flex cursor-pointer rounded-lg border p-3 sm:p-4 hover:border-[var(--primary-color)] focus:outline-none transition-all ${
                              selectedRole === role
                                ? 'border-[var(--primary-color)] bg-orange-50 ring-2 ring-[var(--primary-color)]' 
                                : 'border-[var(--secondary-color)] bg-[var(--secondary-color)]'
                            }`}
                            onClick={() => {
                              setSelectedRole(role)
                              setValue('role', role)
                            }}
                          >
                            <input
                              type="radio"
                              value={role}
                              className="sr-only"
                              {...register('role')}
                              checked={selectedRole === role}
                            />
                            <span className="flex flex-1 flex-col">
                              <span className="block text-sm font-semibold text-[var(--text-primary)] capitalize">
                                {role === 'buyer' ? 'Buyer' : role === 'artisan' ? 'Artisan' : 'Collector'}
                              </span>
                              <span className="mt-1 flex items-center text-xs text-[var(--text-secondary)]">
                                {role === 'buyer' && 'Browse and purchase crafts'}
                                {role === 'artisan' && 'Sell your handcrafted items'}
                                {role === 'collector' && 'Curate unique collectibles'}
                              </span>
                            </span>
                          </label>
                        ))}
                      </div>
                      {errors.role ? <p className="mt-1 text-sm text-red-600">{errors.role.message}</p> : null}
                    </div>
                  </div>

                  {error ? (
                    <div className="text-red-700 bg-red-100 border border-red-200 px-3 py-2 rounded-md">
                      {error}
                    </div>
                  ) : null}

                  <div>
                    <button
                      type="submit"
                      disabled={isSendingOTP || formIsSubmitting}
                      className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[var(--primary-color)] hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                    >
                      {isSendingOTP ? 'Sending OTP…' : 'Send Verification Code'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="mt-8 space-y-6">
                  {successMessage && (
                    <div className="text-green-700 bg-green-100 border border-green-200 px-3 py-2 rounded-md text-sm">
                      {successMessage}
                    </div>
                  )}
                  
                  <div className="space-y-4">
                    <OTPInput
                      value={otp}
                      onChange={setOtp}
                      onComplete={onVerifyOTP}
                      error={otpError}
                      disabled={isSubmitting}
                    />
                    
                    {otpError && (
                      <div className="text-red-700 bg-red-100 border border-red-200 px-3 py-2 rounded-md text-sm text-center">
                        {otpError}
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={() => onVerifyOTP(otp)}
                      disabled={otp.length !== 6 || isSubmitting}
                      className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[var(--primary-color)] hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                    >
                      {isSubmitting ? 'Creating account…' : 'Verify & Create Account'}
                    </button>

                    <div className="flex items-center justify-center gap-2 text-sm">
                      <span className="text-stone-600">Didn't receive the code?</span>
                      <button
                        type="button"
                        onClick={handleResendOTP}
                        disabled={isSendingOTP}
                        className="font-medium text-[var(--primary-color)] hover:text-orange-600 disabled:opacity-50"
                      >
                        {isSendingOTP ? 'Sending…' : 'Resend OTP'}
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setStep('form')
                        setOtp('')
                        setOtpError('')
                        setError('')
                        setSignupData(null)
                      }}
                      className="w-full text-sm text-stone-600 hover:text-stone-900 font-medium"
                    >
                      ← Back to form
                    </button>
                  </div>
                </div>
              )}
            </div>
            <p className="text-center text-sm text-stone-500">
              Already have an account? <Link className="font-medium text-[var(--primary-color)] hover:text-orange-600" to="/sign-in">Log in</Link>
            </p>
          </div>
        </main>
      </div>
    </div>
  )
}
