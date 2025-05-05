'use server'

import z from 'zod'

import { SelectedUser } from '@/types/models/user'
import { loginFormTypeSchema, createAccFormTypeSchema, createPassActionTypeSchema } from '@/types/forms/auth'
import { prisma } from '@/lib/prisma'
import { Err } from '@/types/errTypes'
import { verifyToken } from '@/services/jwtService'
import errHandlerService from '@/services/errHandlerService'
import { encode, isVerifiedStr } from '@/services/cryptoService'
import { signIn } from '@/configs/auth'
import apiRequestService from '@/services/apiRequestService'
import { appHost, twoFaVerifyApiPath } from '@/utils/paths'

const registrationTime = 1000 * 60 * 3 // 3 mins

export const login = async (data: z.infer<typeof loginFormTypeSchema>): Promise<SelectedUser | null | Err> => {
  const { email, password, code } = data

  try {
    loginFormTypeSchema.parse(data)

    const user = await prisma.user.findFirst({ where: { email } })

    if (user && user.password) {
      const isVerifiedPass = await isVerifiedStr(password, user?.password as string)

      if (isVerifiedPass) {
        delete (user as SelectedUser & { password?: string }).password

        if (user.isTwoFa && user.twoFaHash && code) {
          const isVerifiedTwoFa: { verified: boolean } | Err = await apiRequestService({
            url: `${appHost}${twoFaVerifyApiPath}`,
            method: 'POST',
            body: { secret: user.twoFaHash, code },
          })

          if (!('error' in isVerifiedTwoFa) && isVerifiedTwoFa.verified) return { ...user, error: null }
          else return null
        } else if (user.isTwoFa && user.twoFaHash && !code) throw Error('Two-fa code is required!')

        return { ...user, error: null }
      } else return null
    } else return null
  } catch (error) {
    return errHandlerService(error)
  }
}

const deleteInactiveUsers = async (): Promise<void> => {
  const lte = new Date(+new Date() - registrationTime).toISOString()

  await prisma.user.deleteMany({ where: { password: null, isActive: false, accounts: { none: {} }, createdAt: { lte } } })
}

export const createAcc = async (data: z.infer<typeof createAccFormTypeSchema>): Promise<SelectedUser | Err> => {
  const { email, name } = data

  try {
    createAccFormTypeSchema.parse(data)

    await deleteInactiveUsers()

    // delete inactive user with the same email without acc
    await prisma.user.deleteMany({ where: { AND: [{ email }, { password: null }, { accounts: { none: {} } }] } })

    const user = await prisma.user.create({ data: { email, name }, omit: { password: true } })

    if (user) return { ...user, error: null }

    return { error: { message: 'Creation user error...' } }
  } catch (error) {
    return errHandlerService(error)
  }
}

export const createPass = async (data: z.infer<typeof createPassActionTypeSchema>): Promise<SelectedUser | Err> => {
  const { password, token } = data

  try {
    createPassActionTypeSchema.parse(data)

    const verifiedToken = await verifyToken(token)

    if ('email' in verifiedToken) {
      const { email } = verifiedToken as { email: string }
      const user = await prisma.user.findFirst({ where: { email } })

      if (!user?.password && !user?.isActive) {
        const hash = encode(password)

        return {
          ...(await prisma.user.update({ data: { password: hash, isActive: true }, where: { email }, omit: { password: true } })),
          error: null,
        }
      } else throw Error('User already have password!')
    } else throw Error('Token error!')
  } catch (error) {
    return errHandlerService(error)
  }
}

export const recoverPass = async (data: z.infer<typeof createPassActionTypeSchema>) => {
  const { password, token } = data

  try {
    createPassActionTypeSchema.parse(data)

    const verifiedToken = await verifyToken(token)

    if ('email' in verifiedToken) {
      const { email } = verifiedToken as { email: string }
      const user = await prisma.user.findFirst({ where: { email } })

      if (user) {
        const hash = encode(password)

        return {
          ...(await prisma.user.update({ data: { password: hash }, where: { email }, omit: { password: true } })),
          error: null,
        }
      } else throw Error(`User with ${email} not found!`)
    } else throw Error('Token error!')
  } catch (error) {
    return errHandlerService(error)
  }
}

export const oauthLogin = async (name: 'google' | 'github'): Promise<{ url: string; error: false } | Err> => {
  try {
    const res = await signIn(name, { redirect: false })

    return { url: res, error: false }
  } catch (error) {
    console.log('oauthLogin err - ', error)

    return { error: { message: 'OAuth authentication error...' } }
  }
}

export const checkTwoFa = async (email: string): Promise<{ isTwoFa: boolean; error: null } | Err> => {
  try {
    const user = await prisma.user.findFirst({ where: { email } })

    return { isTwoFa: user?.isTwoFa as boolean, error: null }
  } catch (error) {
    console.log('checkTwoFa err - ', error)

    return { error: { message: 'Check two-fa error...' } }
  }
}
