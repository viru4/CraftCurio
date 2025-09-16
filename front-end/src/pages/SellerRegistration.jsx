import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { sellerRegistrationSchema, sellerRegistrationDefaults } from '@/forms/SellerRegistrationSchema'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Navbar from '@/components/Navbar'

export default function SellerRegistration() {
  const [submitted, setSubmitted] = useState(false)
  const [result, setResult] = useState(null)

  const form = useForm({
    resolver: zodResolver(sellerRegistrationSchema),
    defaultValues: sellerRegistrationDefaults,
    mode: 'onSubmit',
  })
  const { register, handleSubmit, formState } = form
  const { errors, isSubmitting } = formState

  async function onSubmit(values) {
    const idFiles = Array.from(values.governmentId)
    const addressFiles = Array.from(values.proofOfAddress)

    const verificationChecks = {
      emailDomain: /@.+\./.test(values.email),
      phoneLength: values.phone.replace(/\D/g, '').length >= 8,
      taxIdShape: /[A-Za-z0-9]{8,}/.test(values.taxId),
      hasIdFiles: idFiles.length > 0,
      hasAddressFiles: addressFiles.length > 0,
    }

    const passed = Object.values(verificationChecks).every(Boolean)
    setResult({ passed, verificationChecks })
    setSubmitted(true)

    // Here you would POST to your backend for real verification.
    // For security, we do NOT upload files client-side without server integration.
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
      <Navbar />
      <main className="flex-1 pt-16 md:pt-20">
        <section className="py-12 px-4 md:px-10 lg:px-20 bg-white">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)] mb-2">Become a Seller / Artisan</h1>
            <p className="text-[var(--text-secondary)] mb-8">Provide your details for verification. We require identity and address proof to keep our marketplace trustworthy.</p>

            {!submitted ? (
              <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Field label="Full name" error={errors.fullName?.message}><Input id="fullName" {...register('fullName')} placeholder="Jane Doe" /></Field>
                  <Field label="Business / Shop name" error={errors.businessName?.message}><Input id="businessName" {...register('businessName')} placeholder="CraftCurio Studio" /></Field>
                </div>

                <Field label="Email" error={errors.email?.message}><Input id="email" type="email" {...register('email')} placeholder="you@example.com" /></Field>
                <Field label="Phone" error={errors.phone?.message}><Input id="phone" type="tel" {...register('phone')} placeholder="+1 555 000 0000" /></Field>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Business type</label>
                  <select className="w-full h-9 rounded-md border px-3 text-sm" {...register('businessType')}>
                    <option value="individual">Individual</option>
                    <option value="company">Company</option>
                  </select>
                  {errors.businessType && <ErrorText>{errors.businessType.message}</ErrorText>}
                </div>
                <Field label="Tax ID / GST / VAT" error={errors.taxId?.message}><Input id="taxId" {...register('taxId')} placeholder="ABCD123456" /></Field>

                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Field label="Address line 1" error={errors.addressLine1?.message}><Input id="address1" {...register('addressLine1')} placeholder="123 Artisan St" /></Field>
                  <Field label="Address line 2" error={errors.addressLine2?.message}><Input id="address2" {...register('addressLine2')} placeholder="Suite, unit, etc. (optional)" /></Field>
                </div>

                <Field label="City" error={errors.city?.message}><Input id="city" {...register('city')} /></Field>
                <Field label="State / Province" error={errors.state?.message}><Input id="state" {...register('state')} /></Field>
                <Field label="Postal / ZIP" error={errors.postalCode?.message}><Input id="postalCode" {...register('postalCode')} /></Field>
                <Field label="Country" error={errors.country?.message}><Input id="country" {...register('country')} /></Field>

                <Field label="Website (optional)" error={errors.website?.message} helper="If you sell elsewhere, add a link."><Input id="website" {...register('website')} placeholder="https://example.com" /></Field>
                <Field label="Portfolio (optional)" error={errors.portfolio?.message}><Input id="portfolio" {...register('portfolio')} placeholder="https://instagram.com/yourshop" /></Field>

                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="governmentId" className="block text-sm font-medium text-[var(--text-primary)] mb-1">Government ID (JPG/PNG/PDF, max 5MB)</label>
                    <Input id="governmentId" type="file" accept="image/jpeg,image/png,application/pdf" {...register('governmentId')} />
                    {errors.governmentId && <ErrorText>{errors.governmentId.message}</ErrorText>}
                  </div>
                  <div>
                    <label htmlFor="proofOfAddress" className="block text-sm font-medium text-[var(--text-primary)] mb-1">Proof of Address (JPG/PNG/PDF, max 5MB)</label>
                    <Input id="proofOfAddress" type="file" accept="image/jpeg,image/png,application/pdf" {...register('proofOfAddress')} />
                    {errors.proofOfAddress && <ErrorText>{errors.proofOfAddress.message}</ErrorText>}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="inline-flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                    <input type="checkbox" className="mt-1" {...register('agreeTerms')} />
                    <span>I confirm that the information provided is accurate and I agree to the marketplace terms, including identity and address verification.</span>
                  </label>
                  {errors.agreeTerms && <ErrorText>{errors.agreeTerms.message}</ErrorText>}
                </div>

                <div className="md:col-span-2 flex gap-3">
                  <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Submitting…' : 'Submit application'}</Button>
                  <Button type="button" variant="outline" onClick={() => window.history.back()}>Cancel</Button>
                </div>
              </form>
            ) : (
              <div className="bg-[var(--secondary-color)] rounded-lg p-6">
                <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Application received</h2>
                <p className="text-[var(--text-secondary)] mb-4">Your details passed our initial checks. We will complete verification and notify you by email.</p>
                {result && (
                  <ul className="text-sm text-[var(--text-secondary)] list-disc pl-5">
                    <li>Email format check: {result.verificationChecks.emailDomain ? 'OK' : 'Failed'}</li>
                    <li>Phone length check: {result.verificationChecks.phoneLength ? 'OK' : 'Failed'}</li>
                    <li>Tax ID pattern check: {result.verificationChecks.taxIdShape ? 'OK' : 'Failed'}</li>
                    <li>Government ID provided: {result.verificationChecks.hasIdFiles ? 'OK' : 'Missing'}</li>
                    <li>Proof of Address provided: {result.verificationChecks.hasAddressFiles ? 'OK' : 'Missing'}</li>
                  </ul>
                )}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

function Field({ label, error, helper, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">{label}</label>
      {children}
      {helper ? <p className="text-xs text-[var(--text-secondary)] mt-1">{helper}</p> : null}
      {error ? <ErrorText>{error}</ErrorText> : null}
    </div>
  )
}

function ErrorText({ children }) {
  return <p className="text-sm mt-1 text-[#b91c1c]">{children}</p>
}
