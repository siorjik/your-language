import NextAuth, { User } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'text', required: true },
        password: { label: 'Password', type: 'password', required: true },
      },
      authorize: async (credentials) => {
        const user = { ...credentials }

        if (!user) {
          throw new Error("Invalid credentials.")
        }
 
        return user as User
      }
    })
  ],

  callbacks: {
    jwt: ({ token, user }) => {
      return { ...token, age: 100}
    },
    session: ({ session, token }) => {
      return session
    }
  },

  session: { strategy: 'jwt' },

  pages: {
    signIn: '/login',
  },
})
