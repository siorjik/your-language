'use client'

import { ReactNode, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'

import ThemeBtn from './theme-btn'
import Navbar from './navbar'
import Spinner from './spinner'

export default function Layout({ children }: { children: ReactNode }) {
  const { status, data: session } = useSession()
  const pathname = usePathname()

  const isLoadingSession = status === 'loading'
  const isSession = !!session

  useEffect(() => {
    if (!isLoadingSession && !isSession && pathname !== '/') window.location.href = '/' // redirect if session expired
  }, [isSession, isLoadingSession])

  return (
    <div className="main-wrap">
      {isLoadingSession ? (
        <Spinner />
      ) : (
        <>
          <header className="w-full h-[55px] px-5 md:px-8 py-2 flex items-center fixed top-0 bg-stone-50 dark:bg-stone-900 z-10">
            <div className="w-full m-auto max-w-7xl text-muted-foreground">
              <Navbar />
            </div>
          </header>
          <main className="pt-[55px]">
            <div className="min-h-[calc(100dvh-110px)] px-5 md:px-8 xl:px-0 py-5 w-full m-auto max-w-7xl">{children}</div>
            <footer className="min-h-[55px] px-5 md:px-8 py-3 flex justify-between items-center bg-slate-200 dark:bg-slate-900">
              <div className="w-full m-auto max-w-7xl flex justify-between items-center text-sm text-muted-foreground">
                <span>&copy;{new Date().getFullYear()}</span>
                <ThemeBtn />
              </div>
            </footer>
          </main>
        </>
      )}
    </div>
  )
}
