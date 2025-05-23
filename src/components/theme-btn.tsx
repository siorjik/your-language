'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'

import { themes } from '@/utils/constants'

export default function ThemeBtn() {
  const [mode, setMode] = useState('')

  const { theme, setTheme } = useTheme()

  useEffect(() => {
    if (!window.localStorage.getItem('theme')) setTheme(themes.find((item) => item.name === 'default')?.value as string)

    setMode(theme!)
  }, [theme])

  return (
    <>
      {mode && (
        <button
          // className="border-2 border-muted-foreground rounded-md"
          onClick={() => setTheme(theme?.includes('-dark') ? theme.replace('-dark', '') : theme + '-dark')}
          onKeyDown={(e) => e.preventDefault()}
        >
          {!mode.includes('-dark') ? <Moon className="text-muted-foreground" /> : <Sun className="text-muted-foreground" />}
        </button>
      )}
    </>
  )
}
