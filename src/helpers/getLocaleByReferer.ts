'use server'

import { headers } from 'next/headers'

export default async () => {
  let locale = 'en'

  const headerList = await headers()
  const referer = headerList.get('referer') || ''

  if (referer) {
    const url = new URL(referer)
    const pathname = url.pathname

    locale = pathname.split('/')[1]
  }

  return locale
}
