import z from 'zod'

export const classFormTypeSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, { message: 'Required!' }),
  sets: z.array(z.string()).min(1, { message: 'Required!' }),
  users: z.array(z.string()).optional(),
  file: z.instanceof(File).optional(),
  image: z.string().nullable().optional(),
})
