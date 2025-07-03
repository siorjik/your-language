'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'

import { THEMES } from '@/utils/constants'

export default function ThemeBtn() {
  const [mode, setMode] = useState('')

  const { theme, setTheme } = useTheme()

  useEffect(() => {
    if (!window.localStorage.getItem('theme')) setTheme(THEMES.find((item) => item.name === 'default')?.value as string)

    setMode(theme!)
  }, [theme])

  return (
    <>
      {mode && (
        <button
          onClick={() => setTheme(theme?.includes('-dark') ? theme.replace('-dark', '') : theme + '-dark')}
          onKeyDown={(e) => e.preventDefault()}
        >
          {!mode.includes('-dark') ? <Moon className="text-primary" /> : <Sun className="text-primary" />}
        </button>
      )}
    </>
  )
}
