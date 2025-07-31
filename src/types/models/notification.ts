import z from 'zod'

export const NotificationTypeSchema = z.object({
  id: z.string().optional(),
  type: z.string().min(1, { message: 'Required!' }),
  status: z.string().min(1, { message: 'Required!' }),
  setId: z.string().optional(),
  userId: z.string().optional(),
})
