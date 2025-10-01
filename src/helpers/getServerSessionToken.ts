import { NextRequest } from 'next/server'
import { getToken, JWT } from 'next-auth/jwt'
import { headers } from 'next/headers'

import { SelectedUser } from '@/types/models/user'
import { emitEvent } from '@/services/socketService'
import { SOCKET_EVENTS } from '@/utils/constants'

export default async (req?: null | NextRequest) => {
  try {
    const session = (await getToken({
      req: req || { headers: Object.fromEntries(await headers()) },
      secret: process.env.NEXTAUTH_SECRET,
      secureCookie: process.env.NEXT_PUBLIC_APP_ENV === 'production',
    })) as JWT & SelectedUser

    if (session?.id) return session
    else throw Error('You are not authorized!')
  } catch (error) {
    console.log('error in getServerSessionToken - ', error)

    emitEvent(SOCKET_EVENTS.signOut)

    throw error
  }
}
