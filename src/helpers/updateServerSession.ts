import { headers, cookies } from 'next/headers'

import getParsedCookie from './getParsedCookie'
import { appHost } from '@/utils/paths'

export default async (data: { [k: string]: string | number | boolean }): Promise<void> => {
  try {
    const heads = { ...Object.fromEntries(await headers()) }
    delete heads['content-length']

    const crf = await fetch(`${appHost}/api/auth/csrf`, {
      method: 'GET',
      headers: { ...heads, 'Content-Type': 'application/json' },
      credentials: 'include',
    })

    if (!crf.ok) throw Error('Getting crf token error...')

    const crfRes = await crf.json()

    const updatedSession = await fetch(`${appHost}/api/auth/session`, {
      method: 'POST',
      headers: { ...heads, 'Content-Type': 'application/json' },
      body: JSON.stringify({ csrfToken: crfRes.csrfToken, data }),
      credentials: 'include',
    })

    if (!updatedSession.ok) throw Error('Updating server session error...')

    const sessionCookie = updatedSession.headers.get('set-cookie') as string

    const cookieName = process.env.NEXT_PUBLIC_APP_ENV === 'production' ? '__Secure-authjs.session-token' : 'authjs.session-token'

    const parsedCookie = getParsedCookie(sessionCookie, cookieName)

    const cookieStore = await cookies()

    cookieStore.delete(cookieName)
    cookieStore.set(cookieName, parsedCookie)
  } catch (error) {
    console.log('error in updateServerSession - ', error)

    throw error
  }
}
