const { Client } = require('pg')
const { createClient } = require('redis')
const config = require('../../config')

const redis = createClient()
const pg = new Client({
    user: config.database.user,
    host: config.database.host,
    database: config.database.database,
    password: config.database.password,
    port: config.database.port
})

async function startPostgresListener() {
    try {
        await redis.connect()
        console.info('Connected to Redis')

        await pg.connect()
        console.info('Connected to Postgres')

        await pg.query(`LISTEN "${config.notifications.contactUpdatesChannel}"`)

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