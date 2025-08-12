'use server'

import { z } from 'zod'

import getServerSessionToken from '@/helpers/getServerSessionToken'
import { prisma } from '@/lib/prisma'
import errHandlerService from '@/services/errHandlerService'
import { Err } from '@/types/errTypes'
import {
  updateAccFormTypeSchema,
  changePassFormTypeSchema,
  updateAccImageFormTypeSchema,
  updateAccTwoFaTypeSchema,
} from '@/types/forms/user'
import { SelectedUser } from '@/types/models/user'
import { encode, isVerifiedStr } from '@/services/cryptoService'
import updateServerSession from '@/helpers/updateServerSession'

export const updateAcc = async (data: z.infer<typeof updateAccFormTypeSchema>): Promise<SelectedUser | Err> => {
  const { email, name } = data

  try {
    updateAccFormTypeSchema.parse(data)

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
    changePassFormTypeSchema.parse(data)

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
    updateAccImageFormTypeSchema.parse(data)

    const session = await getServerSessionToken()

    return {
      ...(await prisma.user.update({ where: { id: session.id }, data: { image }, omit: { password: true } })),
      error: null,
    }
  } catch (error) {
    return errHandlerService(error)
  }
}

export const updateAccTwoFaHash = async (data: z.infer<typeof updateAccTwoFaTypeSchema>): Promise<SelectedUser | Err> => {
  try {
    updateAccTwoFaTypeSchema.parse(data)

    const session = await getServerSessionToken()

    const twoFaHash = data.secret || null

    const updatedUser = await prisma.user.update({
      where: { id: session.id },
      data: { twoFaHash, isTwoFa: !!twoFaHash },
      omit: { password: true },
    })

    // await updateServerSession({ isTwoFa: !!twoFaHash })

    return { ...updatedUser, error: null }
  } catch (error) {
    return errHandlerService(error)
  }
}
