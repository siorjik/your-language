'use client'

import { Loader } from 'lucide-react'

export default function Spinner() {
  return (
    <div className="flex justify-center items-center fixed w-full h-screen bg-primary/30 top-0 left-0 z-[100]">
      <Loader className="text-primary animate-spin" size={80} />
    </div>
  )
}
