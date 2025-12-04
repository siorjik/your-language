'use client'

import Link from '@/components/link'

import { Button } from '@/components/ui/button'

import './globals.css'

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  console.log('error in GlobalError:', error)
  return (
    <html>
      <body className="h-[100dvh] flex flex-col justify-center items-center">
        <h2 className="mb-10 text-xl text-orange-500 font-semibold">Something went wrong!</h2>
        <div>
          <Button className="bg-slate-300 rounded-md" onClick={() => reset()}>
            Try again
          </Button>{' '}
          or go to{' '}
          <Link className="link" href="/">
            home page
          </Link>
        </div>
      </body>
    </html>
  )
}
