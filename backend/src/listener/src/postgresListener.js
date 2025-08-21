const { Client } = require('pg')
const { createClient } = require('redis')
const config = require('../../config')

const CHANNEL = process.env.CONTACT_UPDATES_CHANNEL || config.notifications.contactUpdatesChannel

const redis = createClient({
    socket: {
        host: process.env.REDIS_HOST || config.redis.host,
        port: parseInt(process.env.REDIS_PORT || config.redis.port, 10) || 6379
    }
})


const pg = new Client({
    host: process.env.POSTGRES_HOST || config.database.host,
    port: parseInt(process.env.POSTGRES_PORT || config.database.port, 10) || 5432,
    user: process.env.POSTGRES_USER || config.database.user,
    password: process.env.POSTGRES_PASSWORD || config.database.password,
    database: process.env.POSTGRES_DB || config.database.database
})

async function startPostgresListener() {
    try {
        await redis.connect()
        console.info('Connected to Redis')

        await pg.connect()
        console.info('Connected to Postgres')

        await pg.query(`LISTEN "${CHANNEL}"`)

        pg.on('notification', (message) => {
            console.info(`Postgres notification: ${JSON.stringify(message)}`)            
            redis.publish(config.notifications.contactUpdatesChannel, JSON.stringify(JSON.parse(message.payload).data))
        })

        console.info(`Postgres listener service running. Subscribed to channel ${config.notifications.contactUpdatesChannel}`)
    } catch (err) {
        console.error(`Postgres listener failed to start. Error: ${err}`)
        process.exit(1)
    }
}

startPostgresListener()