import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'

import { signInAppPath } from '@/utils/paths'
import FileStorageService from '@/services/fileStorageService'
import { prisma } from '@/lib/prisma'
import authConfig from './nextAuth'
import { JWT } from 'next-auth/jwt'
import { SelectedUser } from '@/types/models/user'

const fileStorage = new FileStorageService()

export const nextAuthConfig = authConfig

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  ...nextAuthConfig,
  callbacks: {
    jwt: async ({ token, user, session, profile, trigger }) => {
      if (trigger === 'update') token = { ...token, ...session }

      if (!profile && !token.isProfile) {
        // reset token data from db session if credentials
        token.exp = +new Date(token.expires as string) / 1000
        token.jti = token.sessionToken as string

        // check if session exists in db
        const dbSession = await prisma.session.findFirst({ where: { sessionToken: token.sessionToken as string } })
        if (!dbSession) return null

        // check token expiration
        if (Date.now() / 1000 > token.exp!) {
          await prisma.session.delete({ where: { sessionToken: token.sessionToken as string } })

          return null
        }
      } else token.isProfile = true

      return { ...user, ...token } as JWT & SelectedUser
    },

    session: async ({ session, token }) => {
      session.user = {
        id: '',
        emailVerified: token.emailVerified || new Date(),
        name: token.name!,
        email: token.email!,
        image: token.image as string,
        isTwoFa: token.isTwoFa,
      }

      const fileStorageAuthData = await fileStorage.authorize()

      return { ...session, fileStorageAuth: fileStorageAuthData.authToken }
    },
  },

  events: {
    signOut: async (params) => {
      // manually delete session if credentials
      if ('token' in params) {
        if (!('isProfile' in params.token!))
          await prisma.session.delete({ where: { sessionToken: params?.token?.sessionToken as string } })
      }
    },
  },

  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,

  pages: { signIn: signInAppPath },

  // logger: {
  //   error(code, ...message) {
  //     console.error({ code, message })
  //   },
  //   warn(code, ...message) {
  //     console.warn(code, message)
  //   },
  //   debug(code, ...message) {
  //     console.debug(code, message)
  //   },
  // },
})
