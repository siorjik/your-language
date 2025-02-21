import NextAuth, { CredentialsSignin } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { z } from 'zod'

import { login } from '@/actions/auth'
import { loginFormTypeSchema } from '@/types/forms/auth'
import { signInAppPath } from '@/utils/paths'
import { SelectedUser } from '@/types/models/user'
import { Err } from '@/types/errTypes'

class InvalidLoginError extends CredentialsSignin {
  code = 'Invalid credentials...'
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  logger: {
    error(code, ...message) {
      console.error({ code, message })
    },
    warn(code, ...message) {
      console.warn(code, ...message)
    },
    debug(code, ...message) {
      console.debug(code, ...message)
    },
  },
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

        if (!user || 'error' in user) throw new InvalidLoginError()

        return user
      },
    }),
  ],

  callbacks: {
    jwt: ({ token, user, session }) => {
      return { ...token, ...user, ...session }
    },

    session: ({ session, token }) => {
      session.user = { id: '', emailVerified: new Date(), name: token.name!, email: token.email!, image: token.picture }

      return session
    },
  },

  trustHost: true,
  session: { strategy: 'jwt', maxAge: 60 },
  secret: process.env.NEXTAUTH_SECRET,

  pages: { signIn: signInAppPath },
})
