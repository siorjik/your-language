import { getRequestConfig } from 'next-intl/server'
import { notFound } from 'next/navigation'

export const locales = ['en', 'ru']

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale

  if (!locale) locale = 'en'

  if (!locales.includes(locale)) notFound()

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  }
})

