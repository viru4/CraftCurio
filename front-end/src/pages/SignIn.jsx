import React from 'react'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useSignIn } from '@clerk/clerk-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signInSchema, signInDefaultValues } from '@/forms/SignInSchema'

export default function SignInPage() {
  const navigate = useNavigate()
  const { isLoaded, signIn, setActive } = useSignIn()

  const form = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: signInDefaultValues,
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  })
  const { register, handleSubmit, formState, reset, getValues } = form
  const { errors, isSubmitting: formIsSubmitting } = formState
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function onSubmit() {
    const { email, password } = getValues()
    if (!isLoaded || isSubmitting) return
    setError('')
    setIsSubmitting(true)
    try {
      const result = await signIn.create({ identifier: email, password })
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId })
        navigate('/')
        return
      }
      // Fallback for any other unexpected status
      setError('Additional verification is required. Please try again.')
    } catch (err) {
      const message = err?.errors?.[0]?.message || 'Sign in failed. Please check your credentials.'
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  function authenticateWithProvider(strategy) {
    if (!isLoaded || isSubmitting) return
    try {
      signIn.authenticateWithRedirect({
        strategy,
        redirectUrl: '/',
        redirectUrlComplete: '/',
      })
    } catch (e) {
      // no-op; Clerk handles redirect flow
    }
  }

  return (
    <div className="bg-stone-50 min-h-screen w-full overflow-x-hidden" style={{ ['--brand-color']: '#ec6d13', fontFamily: 'Manrope, "Noto Sans", sans-serif' }}>
      <div className="relative flex h-auto min-h-screen w-full flex-col bg-stone-50 group/design-root">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-stone-200 px-10 py-4">
          <div className="flex items-center gap-3 text-stone-800">
            <img src="/cc_favicon.png" alt="CraftCurio logo" className="h-8 w-8 rounded" />
            <h1 className="text-stone-900 text-2xl font-bold leading-tight tracking-tighter">CraftCurio</h1>
          </div>
          <div className="flex items-center gap-6">
            <Link className="text-stone-600 hover:text-stone-900 text-base font-medium leading-normal transition-colors" to="/">Home</Link>
            <a className="text-stone-600 hover:text-stone-900 text-base font-medium leading-normal transition-colors" href="#">Explore</a>
            <a className="text-stone-600 hover:text-stone-900 text-base font-medium leading-normal transition-colors" href="#">Sell</a>
            <Link className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-10 px-5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-base font-bold leading-normal tracking-[-0.015em] transition-colors" to="/sign-up">
              <span className="truncate">Sign up</span>
            </Link>
          </div>
        </header>
        <main className="flex flex-1 items-center justify-center py-16">
          <div className="w-full max-w-md space-y-8 px-4">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-stone-900 tracking-tight">Welcome Back, Artisan!</h2>
              <p className="mt-2 text-base text-stone-600">Sign in to your CraftCurio account.</p>
            </div>
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
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
                  <input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Password"
                    className="relative block w-full appearance-none rounded-md border border-stone-300 px-4 py-3 text-stone-900 placeholder-stone-500 focus:z-10 focus:border-[var(--brand-color)] focus:outline-none focus:ring-[var(--brand-color)] sm:text-base"
                    {...register('password')}
                  />
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
                  disabled={!isLoaded || isSubmitting || formIsSubmitting}
                  className="group relative flex w-full justify-center rounded-md border border-transparent bg-[var(--brand-color)] py-3 px-4 text-base font-bold text-white hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-[var(--brand-color)] focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Signing in…' : 'Sign in'}
                </button>
              </div>
            </form>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-stone-300"></div>
              </div>
              <div className="relative flex justify-center text-base">
                <span className="bg-stone-50 px-2 text-stone-500">Or continue with</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <button
                type="button"
                className="inline-flex w-full justify-center items-center gap-3 rounded-md border border-stone-300 bg-white py-3 px-4 text-base font-medium text-stone-700 hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2"
                onClick={() => authenticateWithProvider('oauth_google')}
              >
                <svg aria-hidden="true" className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z"></path>
                </svg>
                <span>Google</span>
              </button>
              <button
                type="button"
                className="inline-flex w-full justify-center items-center gap-3 rounded-md border border-stone-300 bg-white py-3 px-4 text-base font-medium text-stone-700 hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2"
                onClick={() => authenticateWithProvider('oauth_facebook')}
              >
                <svg aria-hidden="true" className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path clipRule="evenodd" d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" fillRule="evenodd"></path>
                </svg>
                <span>Facebook</span>
              </button>
              <button
                type="button"
                className="inline-flex w-full justify-center items-center gap-3 rounded-md border border-stone-300 bg-white py-3 px-4 text-base font-medium text-stone-700 hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2"
                onClick={() => authenticateWithProvider('oauth_x')}
              >
                <svg aria-hidden="true" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2H21l-6.55 7.48L22 22h-6.756l-4.41-5.78L5.6 22H3l7.02-8.02L2 2h6.756l4.05 5.38L18.244 2zm-1.186 18h1.645L7.03 4H5.294l11.764 16z"></path></svg>
                <span>X</span>
              </button>
            </div>
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
