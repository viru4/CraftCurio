import { z } from 'zod'

export const signInSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters.')
    .max(80, 'Name must be at most 80 characters.')
    .regex(/^[A-Za-z][A-Za-z '\-]*[A-Za-z]$/, 'Name can contain letters, spaces, apostrophes, and hyphens.'),
  email: z
    .string()
    .trim()
    .email('Enter a valid email address.'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters.'),
})

export const signInDefaultValues = {
  fullName: '',
  email: '',
  password: '',
}


