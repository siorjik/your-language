import { NextRequest } from 'next/server'
import { getToken, JWT } from 'next-auth/jwt'
import { headers } from 'next/headers'

import { SelectedUser } from '@/types/models/user'

async function getOriginalHeaders(req?: NextRequest) {
  if (req) {
    // Use headers from the incoming request, but override Host and protocol if behind proxy
    const newHeaders = new Headers(req.headers)

    // Override Host header with x-forwarded-host if present
    const xForwardedHost = req.headers.get('x-forwarded-host')
    if (xForwardedHost) newHeaders.set('host', xForwardedHost)

    // Optionally override protocol
    const xForwardedProto = req.headers.get('x-forwarded-proto')
    if (xForwardedProto) newHeaders.set('x-forwarded-proto', xForwardedProto)

    return newHeaders
  } else {
    // fallback to server runtime headers
    const hdrs = Object.fromEntries(await headers())
    return new Headers(hdrs as HeadersInit)
  }
}

export default async (req?: null | NextRequest) => {
  console.log('req - ', req)
  console.log('header - ', Object.fromEntries(await headers()))

  console.log('new headers - ', await getOriginalHeaders(req || undefined))

  try {
    const newHeaders = await getOriginalHeaders(req ?? undefined)

    const tokenReq = { headers: newHeaders } as Request

    const session = (await getToken({
      // req: req || { headers: Object.fromEntries(await headers()) },
      req: tokenReq,
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
