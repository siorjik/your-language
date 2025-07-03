import type { Metadata } from 'next'
import { Montserrat, Poppins, Ubuntu } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { SessionProvider } from 'next-auth/react'

import './globals.css'

import { Toaster } from '@/components/ui/toaster'
import { THEMES } from '@/utils/constants'

const montserrat = Montserrat({ variable: '--font-montserrat', subsets: ['latin'], weight: '600' })
const poppins = Poppins({ variable: '--font-poppins', subsets: ['latin'], weight: '700' })
const ubuntu = Ubuntu({ variable: '--font-ubuntu', subsets: ['latin'], weight: '400' })

export const metadata: Metadata = { title: 'Home', description: 'Home page' }

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${montserrat.variable} ${poppins.variable} ${ubuntu.variable} antialiased`}>
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="theme-default"
            themes={THEMES.map((theme) => theme.value)}
            enableSystem={false}
          >
            {children}
          </ThemeProvider>
        </SessionProvider>
        <Toaster />
      </body>
    </html>
  )
}
