import z from 'zod'

export const setFormTypeSchema = z.object({
  title: z.string().min(1, { message: 'Required!' }),
  source: z.string().min(1, { message: 'Required!' }),
  target: z.string().min(1, { message: 'Required!' }),
  list: z.array(
    z.object({ term: z.string().min(1, { message: 'Required!' }), definition: z.string().min(1, { message: 'Required!' }) }),
  ),
})
