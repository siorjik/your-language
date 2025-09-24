import z from 'zod'

export const NotificationTypeSchema = z.object({
  id: z.string().optional(),
  type: z.string().min(1, { message: 'Required!' }),
  status: z.string().optional(),
  setId: z.string().optional(),
  classId: z.string().optional(),
  userId: z.string().optional(),
  recipientId: z.string().optional(),
})
