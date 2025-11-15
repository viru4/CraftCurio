import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signUpSchema, signUpDefaultValues } from '@/forms/SignUpSchema'
import { useAuth } from '@/contexts/AuthContext'
import Navbar from '@/components/layout/Navbar'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

export default function SignUpPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [selectedRole, setSelectedRole] = useState('buyer')
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: signUpDefaultValues,
    mode: 'onSubmit',
  })
  const { register, handleSubmit, getValues, setValue, formState } = form
  const { errors, isSubmitting: formIsSubmitting } = formState

  async function onSubmit() {
    if (isSubmitting) return
    const { email, password, fullName, role } = getValues()
    setError('')
    setIsSubmitting(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/sign-up`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName,
          email,
          password,
          role,
        }),
        credentials: 'include', // Include cookies
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Sign up failed')
      }

      // Use auth context to login
      login(data.user, data.token)

      // Navigate based on role
      navigate('/')
    } catch (err) {
      const message = err?.message || 'Sign up failed.'
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-stone-50 min-h-screen w-full" style={{ ['--primary-color']: '#ec6d13', ['--secondary-color']: '#f4f2f0', ['--text-primary']: '#181411', ['--text-secondary']: '#897261' }}>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md space-y-6 sm:space-y-8">
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
              <div className="text-center">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">Create your account</h2>
                <p className="mt-2 text-sm text-[var(--text-secondary)]">Join our community of artisans and collectors.</p>
              </div>
              <form className="mt-8 space-y-6" noValidate onSubmit={handleSubmit(onSubmit)}>
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
                      <label 
                        className={`relative flex cursor-pointer rounded-lg border p-3 sm:p-4 hover:border-[var(--primary-color)] focus:outline-none transition-all ${
                          selectedRole === 'buyer'
                            ? 'border-[var(--primary-color)] bg-orange-50 ring-2 ring-[var(--primary-color)]' 
                            : 'border-[var(--secondary-color)] bg-[var(--secondary-color)]'
                        }`}
                        onClick={() => {
                          setSelectedRole('buyer')
                          setValue('role', 'buyer')
                        }}
                      >
                        <input
                          type="radio"
                          value="buyer"
                          className="sr-only"
                          {...register('role')}
                          checked={selectedRole === 'buyer'}
                        />
                        <span className="flex flex-1 flex-col">
                          <span className="flex items-center gap-2">
                            <svg className="h-5 w-5 text-[var(--primary-color)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            <span className="block text-sm font-semibold text-[var(--text-primary)]">Buyer</span>
                          </span>
                          <span className="mt-1 flex items-center text-xs text-[var(--text-secondary)]">
                            Browse and purchase crafts
                          </span>
                        </span>
                      </label>

                      <label 
                        className={`relative flex cursor-pointer rounded-lg border p-3 sm:p-4 hover:border-[var(--primary-color)] focus:outline-none transition-all ${
                          selectedRole === 'artisan' 
                            ? 'border-[var(--primary-color)] bg-orange-50 ring-2 ring-[var(--primary-color)]' 
                            : 'border-[var(--secondary-color)] bg-[var(--secondary-color)]'
                        }`}
                        onClick={() => {
                          setSelectedRole('artisan')
                          setValue('role', 'artisan')
                        }}
                      >
                        <input
                          type="radio"
                          value="artisan"
                          className="sr-only"
                          {...register('role')}
                          checked={selectedRole === 'artisan'}
                        />
                        <span className="flex flex-1 flex-col">
                          <span className="flex items-center gap-2">
                            <svg className="h-5 w-5 text-[var(--primary-color)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="block text-sm font-semibold text-[var(--text-primary)]">Artisan</span>
                          </span>
                          <span className="mt-1 flex items-center text-xs text-[var(--text-secondary)]">
                            Sell your handcrafted items
                          </span>
                        </span>
                      </label>

                      <label 
                        className={`relative flex cursor-pointer rounded-lg border p-3 sm:p-4 hover:border-[var(--primary-color)] focus:outline-none transition-all ${
                          selectedRole === 'collector' 
                            ? 'border-[var(--primary-color)] bg-orange-50 ring-2 ring-[var(--primary-color)]' 
                            : 'border-[var(--secondary-color)] bg-[var(--secondary-color)]'
                        }`}
                        onClick={() => {
                          setSelectedRole('collector')
                          setValue('role', 'collector')
                        }}
                      >
                        <input
                          type="radio"
                          value="collector"
                          className="sr-only"
                          {...register('role')}
                          checked={selectedRole === 'collector'}
                        />
                        <span className="flex flex-1 flex-col">
                          <span className="flex items-center gap-2">
                            <svg className="h-5 w-5 text-[var(--primary-color)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                            </svg>
                            <span className="block text-sm font-semibold text-[var(--text-primary)]">Collector</span>
                          </span>
                          <span className="mt-1 flex items-center text-xs text-[var(--text-secondary)]">
                            Curate unique collectibles
                          </span>
                        </span>
                      </label>
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
                    disabled={isSubmitting || formIsSubmitting}
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[var(--primary-color)] hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                  >
                    {isSubmitting ? 'Creating account…' : 'Sign Up'}
                  </button>
                </div>
              </form>

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
