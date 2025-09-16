import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useSignUp } from '@clerk/clerk-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signUpSchema, signUpDefaultValues } from '@/forms/SignUpSchema'

export default function SignUpPage() {
  const navigate = useNavigate()
  const { isLoaded, signUp, setActive } = useSignUp()
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
    if (!isLoaded || isSubmitting) return
    const { email, password, fullName, code } = getValues()
    setError('')
    setIsSubmitting(true)
    try {
      if (!needsCode) {
        const [firstName, ...rest] = fullName.trim().split(' ')
        const lastName = rest.join(' ')
        await signUp.create({ emailAddress: email, password, firstName, lastName })
        await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
        setNeedsCode(true)
        return
      }
      const attempt = await signUp.attemptEmailAddressVerification({ code })
      if (attempt.status === 'complete') {
        await setActive({ session: attempt.createdSessionId })
        navigate('/')
        return
      }
      setError('Additional verification required. Please try again.')
    } catch (err) {
      const message = err?.errors?.[0]?.message || 'Sign up failed.'
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
              <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
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
                      className="appearance-none relative block w-full px-4 py-3 placeholder:text-stone-500 text-[var(--text-primary)] focus:z-10 sm:text-sm rounded-md bg-[var(--secondary-color)] border border-[var(--secondary-color)] focus:border-[var(--primary-color)] outline-none"
                      {...register('code')}
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
                    disabled={!isLoaded || isSubmitting || formIsSubmitting}
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[var(--primary-color)] hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (needsCode ? 'Verifying…' : 'Signing up…') : (needsCode ? 'Verify' : 'Sign Up')}
                  </button>
                </div>
              </form>
              {!needsCode && (
                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-stone-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-[var(--text-secondary)]">Or continue with</span>
                    </div>
                  </div>
                  <div className="mt-6 grid grid-cols-3 gap-3">
                    <button type="button" onClick={() => signUp.authenticateWithRedirect({ strategy: 'oauth_google', redirectUrl: '/', redirectUrlComplete: '/' })} className="w-full inline-flex justify-center items-center py-3 px-4 border border-stone-200 rounded-md shadow-sm bg-white text-sm font-medium text-stone-600 hover:bg-stone-50 transition-colors">
                      <svg aria-hidden="true" className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z"></path></svg>
                      <span>Google</span>
                    </button>
                    <button type="button" onClick={() => signUp.authenticateWithRedirect({ strategy: 'oauth_facebook', redirectUrl: '/', redirectUrlComplete: '/' })} className="w-full inline-flex justify-center items-center py-3 px-4 border border-stone-200 rounded-md shadow-sm bg-white text-sm font-medium text-stone-600 hover:bg-stone-50 transition-colors">
                      <svg aria-hidden="true" className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path clipRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h 2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" fillRule="evenodd"></path></svg>
                      <span>Facebook</span>
                    </button>
                    <button type="button" onClick={() => signUp.authenticateWithRedirect({ strategy: 'oauth_x', redirectUrl: '/', redirectUrlComplete: '/' })} className="w-full inline-flex justify-center items-center py-3 px-4 border border-stone-200 rounded-md shadow-sm bg-white text-sm font-medium text-stone-600 hover:bg-stone-50 transition-colors">
                      <svg aria-hidden="true" className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1.036c-6.075 0-10.964 4.889-10.964 10.964 0 6.075 4.889 10.964 10.964 10.964 6.075 0 10.964-4.889 10.964-10.964C22.964 5.925 18.075 1.036 12 1.036zm5.836 7.973c.007.133.01.266.01.401 0 4.093-3.114 8.81-8.81 8.81-1.75 0-3.377-.512-4.748-1.391.242.028.488.043.738.043 1.45 0 2.784-.494 3.84-1.323-1.353-.025-2.494-.92-2.888-2.148.188.035.38.055.578.055.282 0 .556-.038.817-.108-1.414-.285-2.477-1.534-2.477-3.018v-.038c.417.23.893.37 1.39.383-1.24-1.24-1.63-3.23.01-4.453 1.523 1.866 3.79 3.09 6.3 3.19-.053-.225-.08-.456-.08-.695 0-1.684 1.36-3.044 3.044-3.044.877 0 1.67.37 2.227.973.694-.136 1.346-.39 1.936-.74-.228.71-.71 1.31-1.336 1.688.616-.073 1.206-.237 1.75-.48-.41.625-.92.1.183-1.63.1.57z"></path></svg>
                      <span>X</span>
                    </button>
                  </div>
                  <p className="mt-8 text-center text-xs text-[var(--text-secondary)]">
                    By creating an account, you agree to our <a className="font-medium text-[var(--primary-color)] hover:text-orange-600" href="#">Terms of Service</a> and <a className="font-medium text-[var(--primary-color)] hover:text-orange-600" href="#">Privacy Policy</a>.
                  </p>
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
