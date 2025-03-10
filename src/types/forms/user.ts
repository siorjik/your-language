import z from 'zod'

export const updateAccFormTypeSchema = z.object({
  email: z.string().email({ message: 'Invalid email!' }),
  name: z.string().min(1, { message: 'Name is required!' }),
})

export const changePassFormTypeSchema = z.object({
  currentPass: z.string().min(1, { message: 'Password is required' }),
  newPass: z.string().min(5, { message: 'New password length must be at least 5' }),
})

export const updateAccImageFormTypeSchema = z.object({ image: z.string().min(1, { message: 'Image is required' }) })

export const updateAccTwoFaTypeSchema = z.object({
  secret: z.string().length(52, { message: 'Invalid two-fa secret' }).nullable(),
})
