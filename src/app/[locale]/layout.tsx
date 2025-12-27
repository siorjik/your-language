import type { Metadata } from 'next'
import { Playpen_Sans, Balsamiq_Sans } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { SessionProvider } from 'next-auth/react'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'

import './globals.css'

import { Toaster } from '@/components/ui/toaster'
import ServiceWorkerRegistration from '@/components/sw-registration'

import { THEMES } from '@/utils/constants'
import QueryProvider from '@/providers/query-provider'

const playpenSans = Playpen_Sans({ variable: '--font-playpen-sans', subsets: ['latin'] })
const balsamiqSans = Balsamiq_Sans({ variable: '--font-balsamiq-sans', subsets: ['latin'], weight: '700' })

export const metadata: Metadata = {
  title: 'Home | Language Bro',
  description: 'Learn languages faster with Language Bro. Flashcards, quizzes, and progress tracking — all in one simple app.',
  manifest: process.env.NODE_ENV === 'production' ? '/manifest.json' : '',
}

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'ru' }, { locale: 'ua' }]
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{ children: React.ReactNode; params: Promise<{ locale: string }> }>) {
  const { locale } = await params

  let messages
  try {
    messages = await getMessages({ locale })
  } catch {
    notFound()
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${playpenSans.variable} ${balsamiqSans.variable} antialiased`}>
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="theme-default"
            themes={THEMES.map((theme) => theme.value)}
            enableSystem={false}
          >
            <ServiceWorkerRegistration />
            <QueryProvider>
              <NextIntlClientProvider messages={messages} locale={locale}>
                {children}
              </NextIntlClientProvider>
            </QueryProvider>
          </ThemeProvider>
        </SessionProvider>
        <Toaster />

        {/* overriding of css styles */}
        <style>{`
          body[data-scroll-locked] {
            margin-right: 0 !important;
          }
        `}</style>
      </body>
    </html>
  )
}
