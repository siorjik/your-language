'use client'

import { ScaleLoader } from 'react-spinners'
import { useTheme } from 'next-themes'

export default function Spinner() {
  const { theme } = useTheme()

  return (
    <div className='flex justify-center items-center fixed w-full h-screen bg-zinc-400/80 dark:bg-zinc-700/50 top-0 left-0 z-10'>
      <ScaleLoader color={`${theme === 'light' ? 'black' : 'gray'}`} />
    </div>
  )
}
