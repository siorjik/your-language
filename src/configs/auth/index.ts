import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { JWT } from 'next-auth/jwt'

import { signInAppPath } from '@/utils/paths'
import { prisma } from '@/lib/prisma'
import authConfig from './nextAuth'
import { SelectedUser } from '@/types/models/user'
import { emitEvent } from '@/services/socketService'
import { SOCKET_EVENTS } from '@/utils/constants'

export const nextAuthConfig = authConfig

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  ...nextAuthConfig,
  callbacks: {
    jwt: async ({ token, user, session, account, trigger }) => {
      if (trigger === 'update') token = { ...token, ...session }

      if (account?.provider === 'credentials' || token.isCredentials) {
        // check if credentials session
        token.isCredentials = true

        // reset token data from db session if credentials
        token.exp = +new Date(token.expires as string) / 1000
        token.jti = token.sessionToken as string

        // check if session exists in db
        const dbSession = await prisma.session.findFirst({ where: { sessionToken: token.sessionToken as string } })
        if (!dbSession) return null

        // check token expiration
        if (Date.now() / 1000 > token.exp!) {
          await prisma.session.delete({ where: { sessionToken: token.sessionToken as string } })

          emitEvent(SOCKET_EVENTS.signOut) // log out from session

          return null
        }
      }

      return { ...user, ...token } as JWT & SelectedUser
    },

    session: async ({ session, token }) => {
      session.user = {
        id: token.id,
        emailVerified: token.emailVerified || new Date(),
        name: token.name!,
        email: token.email!,
        image: token.image as string,
        isTwoFa: token.isTwoFa,
        isCredentials: token.isCredentials || false,
      }

      return { ...session, fileStorageAuth: token.fileStorageAuth || '' }
    },
  },

  events: {
    signOut: async (params) => {
      // manually delete session if credentials
      if ('token' in params) {
        if ('isCredentials' in params.token!)
          await prisma.session.delete({ where: { sessionToken: params?.token?.sessionToken as string } })
      }
    },
  },

  session: {
    strategy: 'jwt',
    maxAge: +process.env.NEXT_PUBLIC_SESSION_DURATION! / 1000,
    updateAge: +process.env.NEXT_PUBLIC_SESSION_DURATION! / 100,
  },
  secret: process.env.NEXTAUTH_SECRET,

  pages: { signIn: signInAppPath },

  logger: {
    error(code, ...message) {
      console.error({ code, message })
    },
    warn(code, ...message) {
      console.warn(code, message)
    },
    debug(code, ...message) {
      console.debug(code, message)
    },
  },
})
