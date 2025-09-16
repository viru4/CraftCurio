import { z } from 'zod'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_ID_TYPES = [
  'image/jpeg', 'image/png', 'application/pdf'
]

export const sellerRegistrationSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().min(8, 'Enter a valid phone number'),
  businessName: z.string().min(2, 'Business/Shop name is required'),
  businessType: z.enum(['individual', 'company']),
  taxId: z.string().min(8, 'Enter a valid Tax ID / GST / VAT'),
  addressLine1: z.string().min(5, 'Address line 1 is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State/Province is required'),
  postalCode: z.string().min(3, 'Postal/ZIP is required'),
  country: z.string().min(2, 'Country is required'),
  website: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  portfolio: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  agreeTerms: z.literal(true, {
    errorMap: () => ({ message: 'You must agree to the terms to continue' })
  }),
  governmentId: z
    .custom((val) => val instanceof FileList && val.length > 0, 'Government ID is required')
    .refine((files) => files instanceof FileList && Array.from(files).every((f) => ACCEPTED_ID_TYPES.includes(f.type)), 'Only JPG, PNG, or PDF files are allowed')
    .refine((files) => files instanceof FileList && Array.from(files).every((f) => f.size <= MAX_FILE_SIZE), 'Each file must be 5MB or less'),
  proofOfAddress: z
    .custom((val) => val instanceof FileList && val.length > 0, 'Proof of address is required')
    .refine((files) => files instanceof FileList && Array.from(files).every((f) => ACCEPTED_ID_TYPES.includes(f.type)), 'Only JPG, PNG, or PDF files are allowed')
    .refine((files) => files instanceof FileList && Array.from(files).every((f) => f.size <= MAX_FILE_SIZE), 'Each file must be 5MB or less'),
})

export const sellerRegistrationDefaults = {
  fullName: '',
  email: '',
  phone: '',
  businessName: '',
  businessType: 'individual',
  taxId: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  postalCode: '',
  country: '',
  website: '',
  portfolio: '',
  agreeTerms: false,
}
