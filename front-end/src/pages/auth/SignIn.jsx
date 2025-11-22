import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { otpSignInSchema, otpSignInDefaultValues } from '@/forms/SignInSchema'
import { useAuth } from '@/contexts/AuthContext'
import Navbar from '@/components/layout/Navbar'
import OTPInput from '@/components/auth/OTPInput'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

export default function SignInPage() {
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
  const { register, handleSubmit, formState, getValues, setValue } = form
  const { errors, isSubmitting: formIsSubmitting } = formState

  // Step 1: Send OTP
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

  // Step 2: Verify OTP
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

      // Login successful
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
    <div className="bg-stone-50 min-h-screen w-full overflow-x-hidden" style={{ ['--brand-color']: '#ec6d13', fontFamily: 'Manrope, "Noto Sans", sans-serif' }}>
      <div className="relative flex h-auto min-h-screen w-full flex-col bg-stone-50">
        <Navbar />
        <main className="flex flex-1 items-center justify-center py-8 sm:py-12 md:py-16 px-4">
          <div className="w-full max-w-md space-y-6 sm:space-y-8">
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                {step === 'email' ? 'Welcome Back!' : 'Enter Verification Code'}
              </h2>
              <p className="mt-2 text-sm sm:text-base text-stone-600">
                {step === 'email' 
                  ? 'Sign in to your CraftCurio account with OTP.' 
                  : `We've sent a 6-digit code to ${email}`}
              </p>
            </div>

            {step === 'email' ? (
              <form className="space-y-6" noValidate onSubmit={handleSubmit(onSendOTP)}>
                <div className="space-y-4 rounded-md">
                  <div>
                    <label className="sr-only" htmlFor="email">Email address</label>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="Email address"
                      className="relative block w-full appearance-none rounded-md border border-stone-300 px-4 py-3 text-stone-900 placeholder-stone-500 focus:z-10 focus:border-[var(--brand-color)] focus:outline-none focus:ring-[var(--brand-color)] sm:text-base"
                      {...register('email')}
                    />
                    {errors.email ? (
                      <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    ) : null}
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
                    className="group relative flex w-full justify-center rounded-md border border-transparent bg-[var(--brand-color)] py-3 px-4 text-base font-bold text-white hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-[var(--brand-color)] focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSendingOTP ? 'Sending OTP…' : 'Send OTP'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
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
                    className="group relative flex w-full justify-center rounded-md border border-transparent bg-[var(--brand-color)] py-3 px-4 text-base font-bold text-white hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-[var(--brand-color)] focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Verifying…' : 'Verify OTP'}
                  </button>

                  <div className="flex items-center justify-center gap-2 text-sm">
                    <span className="text-stone-600">Didn't receive the code?</span>
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={isSendingOTP}
                      className="font-medium text-[var(--brand-color)] hover:text-orange-500 disabled:opacity-50"
                    >
                      {isSendingOTP ? 'Sending…' : 'Resend OTP'}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setStep('email')
                      setOtp('')
                      setOtpError('')
                      setError('')
                    }}
                    className="w-full text-sm text-stone-600 hover:text-stone-900 font-medium"
                  >
                    ← Change email
                  </button>
                </div>
              </div>
            )}

            <div className="text-center text-stone-600 text-base">
              <span>New to CraftCurio? </span>
              <Link to="/sign-up" className="font-semibold text-[var(--brand-color)] hover:text-orange-500">Create an account</Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
