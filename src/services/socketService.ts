import { SOCKET_EVENT_LIST } from '@/utils/constants'
import { Server } from 'http'
import { Server as ServerIO } from 'socket.io'

declare global {
  // eslint-disable-next-line no-var
  var io: ServerIO | undefined
}

export const setConnection = (server: Server) => {
  if (!globalThis.io) {
    globalThis.io = new ServerIO(server)

    globalThis.io.on('connection', (socket) => {
      console.log('🟢 User connected:', socket.id)

      socket.on(SOCKET_EVENT_LIST, (data?: Record<string, string | number | boolean>) => {
        console.log('☄️ Event:', SOCKET_EVENT_LIST)
        emitEvent(SOCKET_EVENT_LIST, data)
      })

      socket.on('disconnect', () => {
        console.log('🔴 User disconnected:', socket.id)
      })
    })
  }
}

export const getIO = (): ServerIO => {
  if (!globalThis.io) throw new Error('❌ Socket.IO not initialized!')
  return globalThis.io
}

export const emitEvent = (ev: string, data?: Record<string, string | number | boolean>) => {
  const socket = getIO()

  socket.emit(ev, data || null)
}
