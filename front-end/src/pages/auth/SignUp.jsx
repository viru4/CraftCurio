import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signUpSchema, signUpDefaultValues } from '@/forms/SignUpSchema'

export default function SignUpPage() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [needsCode, setNeedsCode] = useState(false)

  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: signUpDefaultValues,
    mode: 'onSubmit',
  })
  const { register, handleSubmit, getValues, formState } = form
  const { errors, isSubmitting: formIsSubmitting } = formState

  async function onSubmit() {
    if (isSubmitting) return
    const { email, password, fullName, code } = getValues()
    setError('')
    setIsSubmitting(true)
    try {
      if (!needsCode) {
        // TODO: Implement JWT registration
        console.log('Sign up data:', { email, password, fullName })
        // Replace this with your JWT registration logic
        // Example: await signUpWithJWT(email, password, fullName)
        setNeedsCode(true)
        return
      }
      // TODO: Implement email verification with JWT
      console.log('Verification code:', code)
      // Replace this with your JWT verification logic
      // Example: await verifyEmailWithJWT(code)
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
        <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-10">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center gap-2">
                <img src="/cc_favicon.png" alt="CraftCurio logo" className="h-8 w-8 rounded" />
                <h1 className="text-2xl font-bold text-stone-800">CraftCurio</h1>
              </Link>
              <nav className="hidden md:flex items-center gap-8">
                <Link className="text-stone-600 hover:text-[var(--primary-color)] transition-colors" to="/">Home</Link>
                <a className="text-stone-600 hover:text-[var(--primary-color)] transition-colors" href="#">Explore</a>
                <a className="text-stone-600 hover:text-[var(--primary-color)] transition-colors" href="#">Sell</a>
                <Link className="bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold py-2 px-4 rounded-md transition-colors" to="/sign-in">Log in</Link>
              </nav>
              <button className="md:hidden flex items-center p-2 rounded-md hover:bg-stone-100 transition-colors" aria-label="Open menu">
                <span className="material-symbols-outlined">menu</span>
              </button>
            </div>
          </div>
        </header>
        <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="text-center">
                <h2 className="text-3xl font-extrabold text-[var(--text-primary)]">{needsCode ? 'Verify your email' : 'Create your account'}</h2>
                <p className="mt-2 text-sm text-[var(--text-secondary)]">{needsCode ? 'Enter the 6-digit code sent to your email.' : 'Join our community of artisans and collectors.'}</p>
              </div>
              <form className="mt-8 space-y-6" noValidate onSubmit={handleSubmit(onSubmit)}>
                {!needsCode ? (
                  <div className="rounded-md -space-y-px">
                    <div>
                      <label className="sr-only" htmlFor="fullName">Name</label>
                      <input
                        id="fullName"
                        type="text"
                        placeholder="Full Name"
                        className="appearance-none relative block w-full px-4 py-3 placeholder:text-stone-500 text-[var(--text-primary)] focus:z-10 sm:text-sm rounded-t-md bg-[var(--secondary-color)] border border-[var(--secondary-color)] focus:border-[var(--primary-color)] outline-none"
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
                        className="appearance-none relative block w-full px-4 py-3 placeholder:text-stone-500 text-[var(--text-primary)] focus:z-10 sm:text-sm bg-[var(--secondary-color)] border border-[var(--secondary-color)] focus:border-[var(--primary-color)] outline-none"
                        {...register('email')}
                      />
                      {errors.email ? <p className="mt-1 text-sm text-red-600">{errors.email.message}</p> : null}
                    </div>
                    <div>
                      <label className="sr-only" htmlFor="password">Password</label>
                      <input
                        id="password"
                        type="password"
                        autoComplete="new-password"
                        placeholder="Password"
                        className="appearance-none relative block w-full px-4 py-3 placeholder:text-stone-500 text-[var(--text-primary)] focus:z-10 sm:text-sm bg-[var(--secondary-color)] border border-[var(--secondary-color)] focus:border-[var(--primary-color)] outline-none"
                        {...register('password')}
                      />
                      {errors.password ? <p className="mt-1 text-sm text-red-600">{errors.password.message}</p> : null}
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="sr-only" htmlFor="code">Verification code</label>
                    <input
                      id="code"
                      type="text"
                      placeholder="123456"
                      maxLength={6}
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      pattern="\\d{6}"
                      className="appearance-none relative block w-full px-4 py-3 placeholder:text-stone-500 text-[var(--text-primary)] focus:z-10 sm:text-sm rounded-md bg-[var(--secondary-color)] border border-[var(--secondary-color)] focus:border-[var(--primary-color)] outline-none"
                      {...register('code', { onChange: (e) => { e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6) } })}
                    />
                  </div>
                )}

                {error ? (
                  <div className="text-red-700 bg-red-100 border border-red-200 px-3 py-2 rounded-md">
                    {error}
                  </div>
                ) : null}

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting || formIsSubmitting}
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[var(--primary-color)] hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (needsCode ? 'Verifying…' : 'Signing up…') : (needsCode ? 'Verify' : 'Sign Up')}
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
