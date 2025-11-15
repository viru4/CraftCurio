import { z } from 'zod'

export const signUpSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['buyer', 'artisan', 'collector'], {
    required_error: 'Please select a role',
    invalid_type_error: 'Invalid role selected',
  }),
  code: z.string().optional(),
})

export const signUpDefaultValues = {
  fullName: '',
  email: '',
  password: '',
  role: 'buyer',
  code: '',
}
