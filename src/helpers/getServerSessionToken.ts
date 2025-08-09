import { NextRequest } from 'next/server'
import { getToken, JWT } from 'next-auth/jwt'
import { headers } from 'next/headers'

import { SelectedUser } from '@/types/models/user'

export default async (req?: null | NextRequest) => {
  console.log('req - ', req)
  console.log('header - ', Object.fromEntries(await headers()))

  try {
    const session = (await getToken({
      req: req || { headers: Object.fromEntries(await headers()) },
      secret: process.env.NEXTAUTH_SECRET,
    })) as JWT & SelectedUser

    console.log('session - ', session)

    if (session?.id) return session
    else throw Error('You are not authorized!')
  } catch (error) {
    console.log('error in getServerSessionToken - ', error)

    throw error
  }
}
