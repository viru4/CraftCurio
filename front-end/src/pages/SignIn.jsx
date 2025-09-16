import React from 'react'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useSignIn } from '@clerk/clerk-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signInSchema, signInDefaultValues } from '@/forms/SignInSchema'
import landingBg from '@/assets/StoneWork.avif'

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

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px 12px',
        position: 'relative'
      }}
    >
      {/* Background image with same styling as Landing page */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${landingBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          transform: "scale(1.05)",
          zIndex: 0,
          pointerEvents: "none"
        }}
      />
      <div style={{ 
        width: '100%', 
        maxWidth: 480, 
        background: 'rgba(255, 255, 255, 0.95)', 
        backdropFilter: 'blur(10px)',
        borderRadius: 12, 
        padding: 20, 
        boxShadow: '0 10px 20px rgba(0,0,0,0.15)',
        position: 'relative',
        zIndex: 1
      }}>
        <h1 style={{ margin: 0, marginBottom: 8, fontSize: 'clamp(22px, 4vw, 28px)', fontWeight: 700, color: '#1f2937' }}>Welcome back</h1>
        <p style={{ marginTop: 0, marginBottom: 20, color: '#4b5563', fontSize: 'clamp(14px, 2.8vw, 16px)' }}>Sign in to continue to CraftCurio</p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <label htmlFor="email" style={{ fontWeight: 600, color: '#374151' }}>Email</label>
            <Input id="email" type="email" placeholder="you@example.com" {...register('email')} />
            {errors.email ? (
              <span style={{ color: '#b91c1c' }}>{errors.email.message}</span>
            ) : null}
            <label htmlFor="password" style={{ marginTop: 8, fontWeight: 600, color: '#374151' }}>Password</label>
            <Input id="password" type="password" placeholder="Enter your password" {...register('password')} />
            {errors.password ? (
              <span style={{ color: '#b91c1c' }}>{errors.password.message}</span>
            ) : null}
            {error ? (
              <div style={{ color: '#b91c1c', background: '#fee2e2', border: '1px solid #fecaca', padding: '8px 10px', borderRadius: 8 }}>
                {error}
              </div>
            ) : null}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Button type="submit" disabled={!isLoaded || isSubmitting || formIsSubmitting} style={{ flex: '1 1 140px' }}>
                {isSubmitting ? 'Signing in…' : 'Sign in'}
              </Button>
              <Button type="button" variant="outline" onClick={() => { reset(); setError('') }} disabled={isSubmitting || formIsSubmitting} style={{ flex: '1 1 120px' }}>
                Reset
              </Button>
            </div>
          </div>
        </form>
        <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
          <span style={{ color: '#4b5563' }}>not signed in?</span>
          <Link to="/sign-up" className="flex min-w-[84px] max-w-[480px] items-center justify-center overflow-hidden rounded-full h-10 px-6 bg-[var(--primary-color)] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-opacity-90 transition-all">Sign Up</Link>
        </div>
      </div>
    </div>
  )
}
