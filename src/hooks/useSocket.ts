'use client'

import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

export default function useSocket(ev: string, cb?: (data?: Record<string, string | number | boolean>) => void) {
  const [isConnected, setConnected] = useState(false)

  useEffect(() => {
    if (!socket) {
      socket = io()

      socket.on('connect', () => {
        setConnected(true)
      })

      socket.on('disconnect', () => {
        setConnected(false)
      })

      socket.on(ev, (data?: Record<string, string | number | boolean>) => {
        cb?.(data)
      })
    }
  }, [])

  const eventEmit = (data?: Record<string, string | number | boolean>) => {
    socket?.emit(ev, data || null)
  }

  return { isConnected, eventEmit }
}
