import { NextResponse } from 'next/server'
import NextAuth from 'next-auth'

import { nextAuthConfig } from './configs/auth'
import { signInAppPath, createPasswordAppPath, signUpAppPath, recoverPasswordAppPath } from './utils/paths'

export const config = {
  matcher: ['/', '/profile', '/create-password', '/sign-up', '/sign-in', '/sets/:path*', '/library', '/activities'],
}
// export const config = { matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'] }

const { auth } = NextAuth(nextAuthConfig)

export default auth((req) => {
  const session = req.auth

  const isUnauthorizedPath =
    req.nextUrl.pathname === signInAppPath ||
    req.nextUrl.pathname === signUpAppPath ||
    req.nextUrl.pathname === createPasswordAppPath ||
    req.nextUrl.pathname === recoverPasswordAppPath

  if (session && isUnauthorizedPath) {
    return NextResponse.redirect(new URL('/', req.nextUrl.origin))
  } else if (!session && !isUnauthorizedPath && req.nextUrl.pathname !== '/') {
    return NextResponse.redirect(new URL(signInAppPath, req.nextUrl.origin))
  }

  return NextResponse.next()
})
