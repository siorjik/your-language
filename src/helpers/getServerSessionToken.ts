'use server'

import { SelectedUser } from '@/types/models/user'
import { getToken, JWT } from 'next-auth/jwt'
import { headers } from 'next/headers'

export default async () => {
  try {
    const session = (await getToken({
      req: { headers: Object.fromEntries(await headers()) },
      secret: process.env.NEXTAUTH_SECRET,
    })) as JWT & SelectedUser

    if (session?.id) return session
    else throw Error('You are not authorized or session was expired!')
  } catch (error) {
    throw error
  }
}
