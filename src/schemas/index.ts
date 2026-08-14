import { z } from 'zod'

export const loginSchema = z.object({
  email: z.email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

const dateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Enter a valid date')

export const medicationSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  categoryId: z.string().min(1, 'Category is required'),
  description: z.string().trim(),
  productionDate: dateString.or(z.literal('')),
  expirationDate: dateString,
})
