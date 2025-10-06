import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signInSchema, signInDefaultValues } from '@/forms/SignInSchema'

export default function SignInPage() {
  const navigate = useNavigate()

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
      // TODO: Implement JWT authentication
      console.log('Sign in data:', { email, password })
      // Replace this with your JWT authentication logic
      // Example: await signInWithJWT(email, password)
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
