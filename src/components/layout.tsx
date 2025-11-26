'use client'

import { ReactNode, useEffect, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { ChevronUp } from 'lucide-react'
import Link from 'next/link'

import ThemeBtn from './theme-btn'
import Navbar from './navbar'
import Spinner from './spinner'
import { contactUsAppPath } from '@/utils/paths'
import useDisplayData from '@/hooks/useDisplayData'
import { Separator } from './ui/separator'

export default function Layout({ children }: { children: ReactNode }) {
  const [isHide, setHide] = useState(false)
  const [isShowBtn, setShowBtn] = useState(false)

  const { isMobile } = useDisplayData()
  const { status, data: session } = useSession()

  const mainRef = useRef<HTMLDivElement>(null)

  const isLoadingSession = status === 'loading'
  const isSession = !!session

  useEffect(() => {
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
              w-full h-[55px] px-5 md:px-8 py-1 flex items-center fixed
              ${isSession ? 'bg-background' : 'bg-transparent backdrop-blur-sm'} z-30 shadow-md
              ${isHide ? 'top-[-55px]' : 'top-0'} transition-all duration-500
            `}
          >
            <div className="w-full m-auto max-w-7xl text-muted-foreground">
              <Navbar />
            </div>
          </header>
          <main className="w-full pt-[55px] transition-all scroll-smooth" ref={mainRef}>
            <div
              className="
                min-h-[calc(100dvh-115px)] md:min-h-[calc(100dvh-111px)] px-5 md:px-8 xl:px-0 py-5 w-full m-auto max-w-7xl
              "
            >
              {children}
            </div>
            <footer
              className="
                px-5 py-2 md:px-8 bg-gradient-to-t from-background to-secondary/30
              "
            >
              <div className="w-full mx-auto max-w-7xl flex flex-wrap justify-between items-center text-primary">
                {!isMobile && <span className="text-primary/70 text-sm">&copy; {new Date().getFullYear()} Language Bro</span>}
                <div className="flex gap-5">
                  <Link className="leading-tight hover:text-muted-foreground/50 font-balsamiqSans" href="/">
                    Home
                  </Link>
                  <Link className="leading-tight hover:text-muted-foreground/50 font-balsamiqSans" href={contactUsAppPath}>
                    Contact Us
                  </Link>
                </div>
                <span className="icon-hover mr-[-8px] cursor-pointer">
                  <ThemeBtn />
                </span>
              </div>
              {isMobile && (
                <>
                  <Separator className="my-2" />
                  <p className="pb-2 w-fit mx-auto text-primary/70 text-sm">&copy; {new Date().getFullYear()} Language Bro</p>
                </>
              )}
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
