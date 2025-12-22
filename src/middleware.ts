import { NextResponse } from 'next/server'
import NextAuth from 'next-auth'
import createIntlMiddleware from 'next-intl/middleware'

import { nextAuthConfig } from './configs/auth'
import { signInAppPath, createPasswordAppPath, signUpAppPath, recoverPasswordAppPath, contactUsAppPath } from './utils/paths'
import { LOCALE } from './utils/constants'

export const intlMiddleware = createIntlMiddleware({ locales: ['en', 'ru'], defaultLocale: 'en' })

export const config = {
  matcher: [
    '/',
    '/(en|ru)',
    '/(en|ru)/profile',
    '/(en|ru)/create-password',
    '/(en|ru)/sign-up',
    '/(en|ru)/sign-in',
    '/(en|ru)/sets/:path*',
    '/(en|ru)/library',
    '/(en|ru)/activities',
    '/(en|ru)/classes/:path*',
    '/(en|ru)/contact-us',
  ],
}
// export const config = { matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'] }

const { auth } = NextAuth(nextAuthConfig)

export default auth((req) => {
  const pathname = req.nextUrl.pathname
  const locale = pathname.split('/')[1]

  // set locale in headers for server
  req.headers.set('x-next-intl-locale', locale)

  if (pathname === '/' || !LOCALE.includes(locale)) {
    const intlResponse = intlMiddleware(req)

    if (intlResponse) return intlResponse
  }

  const session = req.auth

  const isUnauthorizedPath =
    pathname === `/${locale}${signInAppPath}` ||
    pathname === `/${locale}${signUpAppPath}` ||
    pathname === `/${locale}${createPasswordAppPath}` ||
    pathname === `/${locale}${recoverPasswordAppPath}`

  if (session && isUnauthorizedPath) {
    return NextResponse.redirect(new URL(`/${locale}`, req.nextUrl.origin))
  } else if (!session && !isUnauthorizedPath && pathname !== `/${locale}` && pathname !== `/${locale}${contactUsAppPath}`) {
    return NextResponse.redirect(new URL(`/${locale}${signInAppPath}`, req.nextUrl.origin))
  }

  return NextResponse.next({ request: { headers: req.headers } })
})
