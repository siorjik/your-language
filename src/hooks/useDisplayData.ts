'use client'

import { useEffect, useState } from 'react'

type WindowDataType = { viewSize: number; isMobile: boolean | undefined; isXlDisplay: boolean | undefined }

export default function useDisplayData() {
  const [windowData, setWindowData] = useState<WindowDataType>({ viewSize: 0, isMobile: undefined, isXlDisplay: undefined })

  useEffect(() => {
    setViewSize(window)

    window.addEventListener('resize', () => setViewSize(window))

    return () => {
      window.removeEventListener('resize', () => setViewSize(window))
    }
  }, [])

  const setViewSize = (window: Window) =>
    setWindowData({
      ...windowData,
      viewSize: window.innerWidth,
      isXlDisplay: window.innerWidth >= 1280,
      isMobile: window.innerWidth < 768,
    })

  return { ...windowData }
}
