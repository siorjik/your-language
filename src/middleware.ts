import { NextResponse } from 'next/server'

import { auth } from '@/configs/auth'
import { signInAppPath, createPasswordAppPath, signUpAppPath } from './utils/paths'

// export const config = { matcher: ['/', '/profile', '/create-password', '/sign-up', '/sign-in'] }
export const config = { matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'] }

export default auth((req) => {
  const session = req.auth
  const isUnauthorizedPath =
    req.nextUrl.pathname === signInAppPath ||
    req.nextUrl.pathname === signUpAppPath ||
    req.nextUrl.pathname === createPasswordAppPath

  if (session && isUnauthorizedPath) {
    return NextResponse.redirect(new URL('/', req.nextUrl.origin), 303)
  } else if (!session && !isUnauthorizedPath && req.nextUrl.pathname !== '/') {
    return NextResponse.redirect(new URL(signInAppPath, req.nextUrl.origin), 303)
  }

  return NextResponse.next()
})
