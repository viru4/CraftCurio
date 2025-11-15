import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signInSchema, signInDefaultValues } from '@/forms/SignInSchema'
import { useAuth } from '@/contexts/AuthContext'
import Navbar from '@/components/layout/Navbar'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

export default function SignInPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: signInDefaultValues,
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  })
  const { register, handleSubmit, formState, getValues } = form
  const { errors, isSubmitting: formIsSubmitting } = formState
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function onSubmit() {
    const { email, password } = getValues()
    if (isSubmitting) return
    setError('')
    setIsSubmitting(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/sign-in`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Sign in failed')
      }

      // Use auth context to login
      login(data.user, data.token)

      navigate('/')
    } catch (err) {
      const message = err?.message || 'Sign in failed. Please check your credentials.'
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }


  return (
    <div className="bg-stone-50 min-h-screen w-full overflow-x-hidden" style={{ ['--brand-color']: '#ec6d13', fontFamily: 'Manrope, "Noto Sans", sans-serif' }}>
      <div className="relative flex h-auto min-h-screen w-full flex-col bg-stone-50">
        <Navbar />
        <main className="flex flex-1 items-center justify-center py-8 sm:py-12 md:py-16 px-4">
          <div className="w-full max-w-md space-y-6 sm:space-y-8">
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">Welcome Back, Artisan!</h2>
              <p className="mt-2 text-sm sm:text-base text-stone-600">Sign in to your CraftCurio account.</p>
            </div>
            <form className="space-y-6" noValidate onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-4 rounded-md">
                <div>
                  <label className="sr-only" htmlFor="email">Email or username</label>
                  <input
                    id="email"
                    type="text"
                    autoComplete="email"
                    placeholder="Email or username"
                    className="relative block w-full appearance-none rounded-md border border-stone-300 px-4 py-3 text-stone-900 placeholder-stone-500 focus:z-10 focus:border-[var(--brand-color)] focus:outline-none focus:ring-[var(--brand-color)] sm:text-base"
                    {...register('email')}
                  />
                  {errors.email ? (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  ) : null}
                </div>
                <div>
                  <label className="sr-only" htmlFor="password">Password</label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="Password"
                      className="relative block w-full appearance-none rounded-md border border-stone-300 px-4 py-3 text-stone-900 placeholder-stone-500 focus:border-[var(--brand-color)] focus:outline-none focus:ring-[var(--brand-color)] sm:text-base pr-12"
                      {...register('password')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 z-10 flex items-center pr-3 text-stone-500 hover:text-[var(--brand-color)] transition-colors"
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
                  {errors.password ? (
                    <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                  ) : null}
                </div>
              </div>
              {error ? (
                <div className="text-red-700 bg-red-100 border border-red-200 px-3 py-2 rounded-md">
                  {error}
                </div>
              ) : null}
              <div className="flex items-center justify-end">
                <div className="text-base">
                  <a className="font-medium text-[var(--brand-color)] hover:text-orange-500" href="#">Forgot your password?</a>
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting || formIsSubmitting}
                  className="group relative flex w-full justify-center rounded-md border border-transparent bg-[var(--brand-color)] py-3 px-4 text-base font-bold text-white hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-[var(--brand-color)] focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Signing in…' : 'Sign in'}
                </button>
              </div>
            </form>

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
