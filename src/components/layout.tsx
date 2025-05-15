'use client'

import { ReactNode, useEffect, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { ChevronUp } from 'lucide-react'

import ThemeBtn from './theme-btn'
import Navbar from './navbar'
import Spinner from './spinner'

export default function Layout({ children }: { children: ReactNode }) {
  const [isHide, setHide] = useState(false)
  const [isShowBtn, setShowBtn] = useState(false)

  const { status, data: session } = useSession()
  const pathname = usePathname()

  const mainRef = useRef<HTMLDivElement>(null)

  const isLoadingSession = status === 'loading'
  const isSession = !!session

  useEffect(() => {
    if (!isLoadingSession && !isSession && pathname !== '/') window.location.href = '/' // redirect if session expired
  }, [isSession, isLoadingSession])

  useEffect(() => {
    if (mainRef.current) {
      const div = mainRef.current
      let lastScrollTop = div.scrollTop

      const cb = () => {
        const currentScrollTop = div.scrollTop

        if (currentScrollTop > lastScrollTop && currentScrollTop > 20) setHide(true)
        else setHide(false)

        lastScrollTop = currentScrollTop

        setShowBtn(currentScrollTop > 400)
      }

      div.addEventListener('scroll', throttle(cb))

      return () => div.removeEventListener('scroll', throttle(cb))
    }
  }, [session])

  const throttle = (cb: () => void) => {
    const delay = 10
    let time = new Date()

    return () => {
      if (delay + +time - +new Date() <= 0) {
        cb()

        time = new Date()
      }
    }
  }

  return (
    <div className="main-wrap">
      {isLoadingSession ? (
        <Spinner />
      ) : (
        <>
          <header
            className={`
              w-full h-[55px] px-5 md:px-8 py-2 flex items-center fixed bg-stone-50 dark:bg-stone-900 z-10
              ${isHide ? 'top-[-55px]' : 'top-0'} transition-all duration-500
            `}
          >
            <div className="w-full m-auto max-w-7xl text-muted-foreground">
              <Navbar />
            </div>
          </header>
          <main className="h-[100vh] pt-[55px] overflow-y-auto transition-all scroll-smooth" ref={mainRef}>
            <div className="min-h-[calc(100dvh-110px)] px-5 md:px-8 xl:px-0 py-5 w-full m-auto max-w-7xl">{children}</div>
            <footer className="min-h-[55px] px-5 md:px-8 py-3 flex justify-between items-center bg-slate-200 dark:bg-slate-800">
              <div className="w-full m-auto max-w-7xl flex justify-between items-center text-sm text-muted-foreground">
                <span>&copy;{new Date().getFullYear()}</span>
                <ThemeBtn />
              </div>
            </footer>
          </main>
          {isShowBtn && (
            <button
              className="absolute bottom-36 right-10 p-3 rounded-xl bg-accent/[0.5]"
              onClick={() => (mainRef.current!.scrollTop = 0)}
            >
              <ChevronUp />
            </button>
          )}
        </>
      )}
    </div>
  )
}
