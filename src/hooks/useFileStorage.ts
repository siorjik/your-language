'use client'

import { useSession } from 'next-auth/react'
import { useCallback } from 'react'

export default function useFileStorage() {
  const { data: session } = useSession()

  const sessionData = session

  const getAuthUrl = useCallback(
    (url: string) => {
      if (!sessionData?.fileStorageAuth) return ''
      else return `${url}?Authorization=${sessionData?.fileStorageAuth}`
    },
    [sessionData?.fileStorageAuth],
  )

  return { getAuthUrl }
}
