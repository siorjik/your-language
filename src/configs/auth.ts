import NextAuth, { CredentialsSignin } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { z } from 'zod'

import { login } from '@/actions/auth'
import { loginFormTypeSchema } from '@/types/forms/auth'
import { signInAppPath } from '@/utils/paths'
import { SelectedUser } from '@/types/models/user'
import { Err } from '@/types/errTypes'
import FileStorageService from '@/services/fileStorageService'

class InvalidLoginError extends CredentialsSignin {
  code = 'Invalid credentials...'
}

const fileStorage = new FileStorageService()

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: {},
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'text', required: true },
        password: { label: 'Password', type: 'password', required: true },
      },
      authorize: async (credentials) => {
        const { email, password } = credentials

        const user: SelectedUser | null | Err = await login({ email, password } as z.infer<typeof loginFormTypeSchema>)

        if (!user || user.error) throw new InvalidLoginError()

        return user
      },
    }),
  ],

  callbacks: {
    jwt: async ({ token, user, session }) => {
      return { ...token, ...user, ...session }
    },

    session: async ({ session, token }) => {
      session.user = { id: '', emailVerified: new Date(), name: token.name!, email: token.email!, image: token.image as string }

      const fileStorageAuthData = await fileStorage.authorize()

      return { ...session, fileStorageAuth: fileStorageAuthData.authToken }
    },
  },

  trustHost: true,
  session: { strategy: 'jwt', maxAge: 60 * 60, updateAge: 60 * 10 },
  secret: process.env.NEXTAUTH_SECRET,

  pages: { signIn: signInAppPath },

  // logger: {
  //   error(code, ...message) {
  //     console.error({ code, message })
  //   },
  //   warn(code, ...message) {
  //     console.warn(code, ...message)
  //   },
  //   debug(code, ...message) {
  //     console.debug(code, ...message)
  //   },
  // },
})
