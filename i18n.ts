import { getRequestConfig, GetRequestConfigParams } from 'next-intl/server'
import { notFound } from 'next/navigation'

export const locales = ['en', 'ru']

export default getRequestConfig(async ({ locale = 'en' }: GetRequestConfigParams) => {
  if (!locales.includes(locale)) notFound()

  return {
    messages: (await import(`./messages/${locale}.json`)).default,
    locale,
  }
})
