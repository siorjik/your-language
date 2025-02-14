import { NextRequest, NextResponse } from 'next/server'

import { auth } from '@/configs/auth'
import { signInAppPath, createPasswordAppPath, signUpAppPath } from './utils/paths'

export const config = { matcher: ['/', '/profile', '/create-password', '/create-account', '/login'] }

export async function middleware(req: NextRequest) {
  const session = await auth()

  const isUnauthorizedPath =
    req.nextUrl.pathname === signInAppPath ||
    req.nextUrl.pathname === signUpAppPath ||
    req.nextUrl.pathname === createPasswordAppPath

  if (session && isUnauthorizedPath) return NextResponse.redirect(req.nextUrl.origin)
  else if (!session && !isUnauthorizedPath && req.nextUrl.pathname !== '/') {
    return NextResponse.redirect(new URL(signInAppPath, req.nextUrl.origin))
  }

  return NextResponse.next()
}
