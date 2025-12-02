'use client'

import { useLocale } from 'next-intl'

export default (): { getLocaleUrl: (url: string) => string } => {
  const locale = useLocale()

  const getLocaleUrl = (url: string): string => {
    return `/${locale}${url}`
  }

  return { getLocaleUrl }
}
