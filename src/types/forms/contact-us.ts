import z from 'zod'

export const contactUsFormTypeSchema = z.object({
  email: z.string().email({ message: 'Invalid Email!' }),
  subject: z.string().min(1, { message: 'Required!' }),
  text: z
    .string()
    .min(10, { message: 'Need to be more than 10 symbols!' })
    .max(500, { message: 'Need to be less than 500 symbols!' }),
})
