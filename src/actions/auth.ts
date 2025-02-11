'use server'

import { prisma } from '@/lib/prisma'
import { loginFormTypeSchema } from '@/types/forms/auth'
import z from 'zod'

export const login = async (data: z.infer<typeof loginFormTypeSchema>) => {
  const { email, password } = data

  try {
    return await prisma.user.findFirst({ where: { AND: [{ email }, { password }] }, omit: { password: true } })
  } catch (error) {
    console.log(error)

    throw error
  }
}
