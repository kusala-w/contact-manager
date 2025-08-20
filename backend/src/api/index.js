const cors = require('cors')
const dotenv = require('dotenv')
const express = require('express')
const http = require('http')

const { Server } = require('socket.io')
const { createClient } = require('redis')

const router = require('./routes')

dotenv.config()
const config = require('../config')

const app = express()
app.use(cors())
app.use(express.json())
app.use(router)
app.use((err, req, res, next) => {
    console.error(err)

    res.status(err.statusCode || 500).json({
        error: {
            type: err.type || 'InternalServerError',
            message: err.message || 'An error occured'
        }
    })
})

// socket.io setup
const server = http.createServer(app)
const io = new Server(server, { cors: { origin: "*" } })

// redis
async function subscribeToRedis() {
    const redisSub = createClient({ 
        socket: {
            host: config.redis.host,
            port: config.redis.port,
        }
     })
    await redisSub.connect()

    await redisSub.subscribe(config.notifications.contactUpdatesChannel, (message) => {
        console.info(`Received redis message ${message}`)
        io.emit(config.notifications.contactUpdatesChannel, message)
    })
}
subscribeToRedis()

io.on('connection', (socket) => {
    console.info(`Socket connected: ${socket.id}`)
})

server.listen(config.port, () => {    
    console.info(`Server is running on port ${config.port}`)
})