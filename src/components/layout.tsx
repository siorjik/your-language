'use client'

import { ReactNode } from 'react'

import ThemeBtn from './theme-btn'
import Navbar from './navbar'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className='main-wrap'>
      <header className='w-full h-[55px] px-5 md:px-8 py-3 flex items-center fixed top-0 bg-stone-50 dark:bg-stone-900'>
        <div className='w-full m-auto max-w-7xl'><Navbar /></div>
      </header>
      <main className='pt-[55px]'>
        <div className='min-h-[calc(100dvh-110px)] px-5 md:px-8 xl:px-0 py-5 w-full m-auto max-w-7xl'>{children}</div>
        <footer className='min-h-[55px] px-5 md:px-8 py-3 flex justify-between items-center bg-slate-200 dark:bg-slate-900'>
          <div className='w-full m-auto max-w-7xl flex justify-between items-center text-sm'>
            &copy;{new Date().getFullYear()}
            <ThemeBtn />
          </div>
        </footer>
      </main>
    </div>
  )  
}
