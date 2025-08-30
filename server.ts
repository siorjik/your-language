import { createServer } from 'http'
import next from 'next'
import { setConnection } from './src/services/socketService.ts'

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const port = 3000

app.prepare().then(() => {
  const server = createServer((req, res) => {
    handle(req, res)
  })

  setConnection(server)

  server.listen(port, () => {
    console.log(`🚀 Ready on ${process.env.NEXT_PUBLIC_APP_HOST}`)
  })
})
