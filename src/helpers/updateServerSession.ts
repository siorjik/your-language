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

    if (!crf.ok) throw crf

    const crfRes = await crf.json()

    const updatedSession = await fetch(`${appHost}/api/auth/session`, {
      method: 'POST',
      headers: { ...heads, 'Content-Type': 'application/json' },
      body: JSON.stringify({ csrfToken: crfRes.csrfToken, data }),
      credentials: 'include',
    })

    if (!updatedSession.ok) throw updatedSession

    const sessionCookie = updatedSession.headers.get('set-cookie') as string

    const parsedCookie = getParsedCookie(sessionCookie, 'authjs.session-token')

    const cookieStore = await cookies()
    cookieStore.set('authjs.session-token', parsedCookie)
  } catch (error) {
    console.log('error in updateServerSession - ', error)

    throw error
  }
}
