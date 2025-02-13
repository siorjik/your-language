'use server'

import z from 'zod'
import { SelectedUser } from '@/types/models/user'

import { loginFormTypeSchema, createAccFormTypeSchema } from '@/types/forms/auth'
import { prisma } from '@/lib/prisma'
import dbErrHandlerService from '@/services/dbErrHandlerService'

export const login = async (data: z.infer<typeof loginFormTypeSchema>): Promise<SelectedUser | null | { error: string }> => {
  const { email, password } = data

  try {
    return await prisma.user.findFirst({ where: { AND: [{ email }, { password }] }, omit: { password: true } })
  } catch (error) {
    return dbErrHandlerService(error)
  }
}

export const createAcc = async (data: z.infer<typeof createAccFormTypeSchema>): Promise<SelectedUser | { error: string }> => {
  const { email, name } = data

  try {
    return await prisma.user.create({ data: { email, name } })
  } catch (error) {
    return dbErrHandlerService(error)
  }
}
