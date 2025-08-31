import { SOCKET_EVENTS } from '@/utils/constants'
import { Server } from 'http'
import { Server as ServerIO } from 'socket.io'

let io: ServerIO | null = null
const event = SOCKET_EVENTS.notification || SOCKET_EVENTS.message

export const setConnection = (server: Server) => {
  if (!io) {
    io = new ServerIO(server)

    io.on('connection', (socket) => {
      console.log('🟢 User connected:', socket.id)

      socket.on(event, (data?: Record<string, string | number | boolean>) => {
        console.log('☄️ event:', event)
        emitEvent(event, data)
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
