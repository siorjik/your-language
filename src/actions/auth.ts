'use server'

import z from 'zod'
import bcrypt from 'bcryptjs'

import { SelectedUser } from '@/types/models/user'
import { loginFormTypeSchema, createAccFormTypeSchema, createPassActionTypeSchema } from '@/types/forms/auth'
import { prisma } from '@/lib/prisma'
import dbErrHandlerService from '@/services/errHandlerService/dbErrHandlerService'
import { Err } from '@/types/errTypes'
import { verifyToken } from '@/services/jwtService'
import errHandlerService from '@/services/errHandlerService'

const registrationTime = 1000 * 60 * 3 // 3 mins

export const login = async (data: z.infer<typeof loginFormTypeSchema>): Promise<SelectedUser | null | Err> => {
  const { email, password } = data

  try {
    const user = await prisma.user.findFirst({ where: { email } })

    if (user && user.password) {
      const isVerifiedPass = await bcrypt.compare(password, user?.password as string)

      if (isVerifiedPass) {
        delete (user as SelectedUser & { password?: string }).password

        return user
      } else return null
    } else return null
  } catch (error) {
    return dbErrHandlerService(error)
  }
}

const deleteInactiveUsers = async () => {
  const lte = new Date(+new Date() - registrationTime).toISOString()

  await prisma.user.deleteMany({ where: { password: null, isActive: false, createdAt: { lte } } })
}

export const createAcc = async (data: z.infer<typeof createAccFormTypeSchema>): Promise<SelectedUser | Err> => {
  const { email, name } = data

  try {
    await deleteInactiveUsers()

    await prisma.user.deleteMany({ where: { AND: [{ email }, { password: null }] } }) // delete inactive acc with the same email

    const user = await prisma.user.create({ data: { email, name }, omit: { password: true } })

    if (user) return user

    return { error: { message: 'Creation user error...' } }
  } catch (error) {
    return errHandlerService(error)
  }
}

export const createPass = async (data: z.infer<typeof createPassActionTypeSchema>): Promise<SelectedUser | Err> => {
  const { password, token } = data

  try {
    const verifiedToken = await verifyToken(token)

    if ('email' in verifiedToken) {
      const { email } = verifiedToken as { email: string }
      const user = await prisma.user.findFirst({ where: { email } })

      if (!user?.password && !user?.isActive) {
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt)

        return await prisma.user.update({ data: { password: hash, isActive: true }, where: { email }, omit: { password: true } })
      } else throw Error('User already have password!')
    } else throw Error('Token error!')
  } catch (error) {
    return errHandlerService(error)
  }
}
