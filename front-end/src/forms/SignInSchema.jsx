import { z } from 'zod'

export const signInSchema = z.object({
  email: z
    .string()
    .trim()
    .email('Enter a valid email address.'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters.'),
})

export const signInDefaultValues = {
  email: '',
  password: '',
}


