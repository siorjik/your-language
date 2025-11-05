import type { Metadata } from 'next'
import { Playpen_Sans, Balsamiq_Sans } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { SessionProvider } from 'next-auth/react'

import './globals.css'

import { Toaster } from '@/components/ui/toaster'
import { THEMES } from '@/utils/constants'
import QueryProvider from '@/providers/query-provider'

const playpenSans = Playpen_Sans({ variable: '--font-playpen-sans', subsets: ['latin'] })
const balsamiqSans = Balsamiq_Sans({ variable: '--font-balsamiq-sans', subsets: ['latin'], weight: '700' })

export const metadata: Metadata = {
  title: 'Home | Language Bro',
  description: 'Learn languages faster with Language Bro. Flashcards, quizzes, and progress tracking — all in one simple app.',
  manifest: '/manifest.json',
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${playpenSans.variable} ${balsamiqSans.variable} antialiased`}>
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="theme-default"
            themes={THEMES.map((theme) => theme.value)}
            enableSystem={false}
          >
            <QueryProvider>{children}</QueryProvider>
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
