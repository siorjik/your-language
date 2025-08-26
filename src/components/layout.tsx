'use client'

import { ReactNode, useEffect, useRef, useState } from 'react'
import { signOut, useSession } from 'next-auth/react'
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
    if (isSession && +new Date() > +new Date(session?.expires)) signOut({ redirectTo: '/' }) // log out if session expired

    // redirect after reloading if session expired
    if (!isLoadingSession && !isSession && pathname !== '/') window.location.href = '/'

    // clear chosen tab in the profile
    if (!isLoadingSession && !isSession && window.localStorage.getItem('tab')) window.localStorage.removeItem('tab')
  }, [isSession, isLoadingSession])

  useEffect(() => {
    if (window) {
      let lastScrollTop = window.scrollY

      const cb = () => {
        const currentScrollTop = window.scrollY

        if (currentScrollTop > lastScrollTop && currentScrollTop > 20) setHide(true)
        else setHide(false)

        lastScrollTop = currentScrollTop

        setShowBtn(currentScrollTop > 700)
      }

      window.addEventListener('scroll', throttle(cb))

      return () => window.removeEventListener('scroll', throttle(cb))
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
              w-full h-[55px] px-5 md:px-8 py-1 flex items-center fixed bg-background z-30 shadow-md
              ${isHide ? 'top-[-55px]' : 'top-0'} transition-all duration-500
            `}
          >
            <div className="w-full m-auto max-w-7xl text-muted-foreground">
              <Navbar />
            </div>
          </header>
          <main className="w-full pt-[55px] transition-all scroll-smooth" ref={mainRef}>
            <div className="min-h-[calc(100dvh-110px)] px-5 md:px-8 xl:px-0 py-5 w-full m-auto max-w-7xl">{children}</div>
            <footer
              className="
                min-h-[55px] px-5 md:px-8 flex justify-between items-center bg-gradient-to-t from-background to-secondary/30
              "
            >
              <div className="w-full mx-auto max-w-7xl flex justify-between items-center text-sm text-primary">
                <span className="font-semibold">&copy; {new Date().getFullYear()} Language Bro</span>
                <span className="icon-hover mr-[-8px] cursor-pointer">
                  <ThemeBtn />
                </span>
              </div>
            </footer>
          </main>
          {isShowBtn && (
            <button
              className="fixed bottom-36 right-10 p-3 rounded-xl bg-accent/[0.5]"
              onClick={() => window.scroll({ top: 0, behavior: 'smooth' })}
            >
              <ChevronUp />
            </button>
          )}
        </>
      )}
    </div>
  )
}
