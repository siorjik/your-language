'use client'

import { useEffect, useState, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import { signOut } from 'next-auth/react'

import { SOCKET_EVENTS } from '@/utils/constants'

let socket: Socket | null = null

type Obj = Record<string, string | number | boolean>

export default function useSocket(ev: string, cb?: (data?: Obj) => void) {
  const [isConnected, setConnected] = useState(false)
  const savedCb = useRef(cb)

  useEffect(() => {
    savedCb.current = cb
  }, [cb])

  useEffect(() => {
    if (!socket) socket = io()

    const s = socket

    const onConnect = () => setConnected(true)
    const onDisconnect = () => setConnected(false)
    const onSignOut = async () => await signOut({ redirectTo: '/' })
    const onEvent = (data?: Obj) => {
      console.log('💥 Event on client: ', ev)

      savedCb.current?.(data)
    }

    s.on('connect', onConnect)
    s.on('disconnect', onDisconnect)
    s.on(SOCKET_EVENTS.signOut, onSignOut) // log out from session
    s.on(ev, onEvent)

    return () => {
      s.off('connect', onConnect)
      s.off('disconnect', onDisconnect)
      s.on(SOCKET_EVENTS.signOut, onSignOut)
      s.off(ev, onEvent)
    }
  }, [ev])

  const eventEmit = (data?: Obj) => {
    socket?.emit(ev, data || null)
  }

  return { isConnected, eventEmit }
}
