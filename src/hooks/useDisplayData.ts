'use client'

import { useEffect, useState } from 'react'

type WindowDataType = {
  viewSize: number
  isMobile: boolean | undefined
  isXlDisplay: boolean | undefined
  isLgDisplay: boolean | undefined
}

export default function useDisplayData() {
  const [windowData, setWindowData] = useState<WindowDataType>({
    viewSize: 0,
    isMobile: undefined,
    isXlDisplay: undefined,
    isLgDisplay: undefined,
  })

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
      viewSize: window.document.documentElement.clientWidth,
      isXlDisplay: window.document.documentElement.clientWidth >= 1280,
      isLgDisplay: window.document.documentElement.clientWidth >= 1024,
      isMobile: window.document.documentElement.clientWidth < 768,
    })

  return { ...windowData }
}
