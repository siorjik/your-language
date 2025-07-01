import type { NextAuthConfig } from 'next-auth'
import { CredentialsSignin } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import GithubProvider from 'next-auth/providers/github'
import Credentials from 'next-auth/providers/credentials'
import z from 'zod'

import { SelectedUser } from '@/types/models/user'
import { Err } from '@/types/errTypes'
import { login } from '@/actions/auth'
import { loginFormTypeSchema } from '@/types/forms/auth'
import { prisma } from '@/lib/prisma'

class InvalidLoginError extends CredentialsSignin {
  code = 'Invalid credentials...'
}

export default {
  providers: [
    GithubProvider({ allowDangerousEmailAccountLinking: true }),
    GoogleProvider({ allowDangerousEmailAccountLinking: true }),
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'text', required: true },
        password: { label: 'Password', type: 'password', required: true },
        code: { label: 'Code', type: 'text', required: false },
      },
      authorize: async (credentials) => {
        const { email, password, code } = credentials

        const user: SelectedUser | null | Err = await login({ email, password, code } as z.infer<typeof loginFormTypeSchema>)

        if (!user || user.error) throw new InvalidLoginError()

        const expires = new Date(Date.now() + +process.env.NEXT_PUBLIC_SESSION_DURATION!)

        // create session manually for credentials
        const session = await prisma.session.create({ data: { userId: user.id, sessionToken: crypto.randomUUID(), expires } })

        return { ...user, sessionToken: session.sessionToken, expires }
      },
    }),
  ],
  trustHost: true,
} satisfies NextAuthConfig
