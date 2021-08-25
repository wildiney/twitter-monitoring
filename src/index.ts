import http from 'http'
import path from 'path'
import express from 'express'
import { Socket } from 'socket.io'

import routes from './routes/routes'

const port = process.env.PORT_APP || 8001
const app = express()
const server = http.createServer(app)

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/', routes)

server.listen(port, () => {
  console.log(`⚡️[server]: Server is running at port ${port}`)
})

const io = require('./socket').init(server)
io.on('connection', (socket: Socket) => {
  console.log('Client connected')
})
