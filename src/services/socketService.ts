import { SOCKET_EVENTS } from '../utils/constants.ts'
import { Server } from 'http'
import { Server as ServerIO } from 'socket.io'

let io: ServerIO | null = null

export const setConnection = (server: Server) => {
  if (!io) {
    io = new ServerIO(server)

    io.on('connection', (socket) => {
      console.log('🟢 User connected:', socket.id)

      socket.on(SOCKET_EVENTS.notification, (data?: Record<string, string | number | boolean>) => {
        emitEvent(SOCKET_EVENTS.notification, data)
      })

      socket.on('disconnect', () => {
        console.log('🔴 User disconnected:', socket.id)
      })
    })
  }

  return io
}

export const getIO = (): ServerIO => {
  if (!io) throw new Error('❌ Socket.IO not initialized!')
  return io
}

export const emitEvent = (ev: string, data?: Record<string, string | number | boolean>) => {
  const socket = getIO()

  socket.emit(ev, data || null)
}
