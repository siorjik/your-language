'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'

export default function ThemeBtn() {
  const [mode, setMode] = useState('')

  const { theme, setTheme } = useTheme()
  
  useEffect(() => {
    if (!window.localStorage.getItem('theme')) setTheme('light')

    setMode(theme!)
  }, [theme])

  return (
    <>
      {mode && <button
        className='border-2 border-slate-700 dark:border-white rounded-md'
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} 
      > 
        {mode === 'light' ? <Moon size={20} /> : <Sun size={20} />}
      </button>}
    </>
  )
}