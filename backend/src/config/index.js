module.exports = {
    port:3001,
    database: {
        host: process.env.POSTGRES_HOST || 'localhost',
        user: process.env.POSTGRES_USER || 'postgres',
        password: process.env.POSTGRES_PASSWORD || 'postgres',
        database: process.env.POSTGRES_DB || 'contact-manager-db',
        port:process.env.POSTGRES_PORT || 5434
    },
    notifications: {        
        contactUpdatesChannel: 'contact-updates'
    },
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT, 10) || 6379
    }
}