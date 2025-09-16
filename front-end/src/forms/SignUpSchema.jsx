import { z } from 'zod'

export const signUpSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  code: z.string().optional(),
})

export const signUpDefaultValues = {
  fullName: '',
  email: '',
  password: '',
  code: '',
}
