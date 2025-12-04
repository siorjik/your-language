'use client'

import { useLocale } from 'next-intl'

export default function useLocaleUrl(): { getLocaleUrl: (url?: string) => string } {
  const locale = useLocale()

  const getLocaleUrl = (url?: string): string => {
    return url ? `/${locale}${url}` : `/${locale}`
  }

  return { getLocaleUrl }
}
