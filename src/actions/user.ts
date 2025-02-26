'use server'

import { z } from 'zod'

import getServerSessionToken from '@/helpers/getServerSessionToken'
import { prisma } from '@/lib/prisma'
import errHandlerService from '@/services/errHandlerService'
import { Err } from '@/types/errTypes'
import { updateAccFormTypeSchema, changePassFormTypeSchema, updateAccImageFormTypeSchema } from '@/types/forms/user'
import { SelectedUser } from '@/types/models/user'
import { encode, isVerifiedStr } from '@/services/cryptoService'

export const updateAcc = async (data: z.infer<typeof updateAccFormTypeSchema>): Promise<SelectedUser | Err> => {
  const { email, name } = data

  try {
    const session = await getServerSessionToken()

    return {
      ...(await prisma.user.update({ where: { id: session.id }, data: { email, name }, omit: { password: true } })),
      error: null,
    }
  } catch (error) {
    return errHandlerService(error)
  }
}

export const updatePass = async (
  data: z.infer<typeof changePassFormTypeSchema>,
): Promise<{ success: true; error: null } | Err> => {
  try {
    const session = await getServerSessionToken()

    const user = await prisma.user.findFirst({ where: { id: session.id } })

    const isVerifiedPass = await isVerifiedStr(data.currentPass, user?.password as string)

    if (isVerifiedPass) {
      const hash = encode(data.newPass)

      await prisma.user.update({ where: { id: session.id }, data: { password: hash } })

      return { success: true, error: null }
    } else throw Error('Invalid password...')
  } catch (error) {
    return errHandlerService(error)
  }
}

export const updateAccImage = async (data: z.infer<typeof updateAccImageFormTypeSchema>): Promise<SelectedUser | Err> => {
  const { image } = data

  try {
    const session = await getServerSessionToken()

    return {
      ...(await prisma.user.update({ where: { id: session.id }, data: { image }, omit: { password: true } })),
      error: null,
    }
  } catch (error) {
    return errHandlerService(error)
  }
}
