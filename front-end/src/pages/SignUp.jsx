import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSignUp } from '@clerk/clerk-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signUpSchema, signUpDefaultValues } from '@/forms/SignUpSchema'
import landingBg from '@/assets/StoneWork.avif'

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
  const { register, handleSubmit, getValues, formState, resetField } = form
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
    <div style={{ minHeight: '100vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px 12px', position: 'relative' }}>
      <div aria-hidden style={{ position: 'absolute', inset: 0, backgroundImage: `url(${landingBg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', transform: 'scale(1.05)', zIndex: 0, pointerEvents: 'none' }} />
      <div style={{ width: '100%', maxWidth: 520, background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', borderRadius: 12, padding: 20, boxShadow: '0 10px 20px rgba(0,0,0,0.15)', position: 'relative', zIndex: 1 }}>
        <h1 style={{ margin: 0, marginBottom: 8, fontSize: 'clamp(22px, 4vw, 28px)', fontWeight: 700, color: '#1f2937' }}>{needsCode ? 'Verify your email' : 'Create your account'}</h1>
        <p style={{ marginTop: 0, marginBottom: 20, color: '#4b5563', fontSize: 'clamp(14px, 2.8vw, 16px)' }}>{needsCode ? 'Enter the 6-digit code sent to your email.' : 'Sign up to start selling and buying on CraftCurio.'}</p>
        <form onSubmit={handleSubmit(onSubmit)}>
          {!needsCode ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <label htmlFor="fullName" style={{ fontWeight: 600, color: '#374151' }}>Full name</label>
              <Input id="fullName" type="text" placeholder="Jane Doe" {...register('fullName')} />
              {errors.fullName ? <span style={{ color: '#b91c1c' }}>{errors.fullName.message}</span> : null}

              <label htmlFor="email" style={{ fontWeight: 600, color: '#374151' }}>Email</label>
              <Input id="email" type="email" placeholder="you@example.com" {...register('email')} />
              {errors.email ? <span style={{ color: '#b91c1c' }}>{errors.email.message}</span> : null}

              <label htmlFor="password" style={{ fontWeight: 600, color: '#374151' }}>Password</label>
              <Input id="password" type="password" placeholder="At least 8 characters" {...register('password')} />
              {errors.password ? <span style={{ color: '#b91c1c' }}>{errors.password.message}</span> : null}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <label htmlFor="code" style={{ fontWeight: 600, color: '#374151' }}>Verification code</label>
              <Input id="code" type="text" placeholder="123456" maxLength={6} {...register('code')} />
            </div>
          )}

          {error ? (
            <div style={{ color: '#b91c1c', background: '#fee2e2', border: '1px solid #fecaca', padding: '8px 10px', borderRadius: 8, marginTop: 12 }}>
              {error}
            </div>
          ) : null}

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 16 }}>
            <Button type="submit" disabled={!isLoaded || isSubmitting || formIsSubmitting} style={{ flex: '1 1 140px' }}>
              {isSubmitting ? (needsCode ? 'Verifying…' : 'Signing up…') : (needsCode ? 'Verify' : 'Sign up')}
            </Button>
            {!needsCode && (
              <Button type="button" variant="outline" onClick={() => { resetField('fullName'); resetField('email'); resetField('password'); setError('') }} style={{ flex: '1 1 120px' }}>
                Reset
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
