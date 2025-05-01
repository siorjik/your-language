'use client'

import { useEffect, useState } from 'react'
import { ScaleLoader } from 'react-spinners'
import { useTheme } from 'next-themes'

export default function Spinner() {
  const [mode, setMode] = useState('')

  const { theme } = useTheme()

  useEffect(() => {
    setMode(theme!)
  }, [theme])

  return (
    <div
      className="
        flex justify-center items-center fixed w-full h-screen bg-slate-400/80 dark:bg-slate-700/50 top-0 left-0 z-10
      "
    >
      <ScaleLoader color={`${mode === 'light' ? 'black' : 'gray'}`} />
    </div>
  )
}
