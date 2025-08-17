const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const router = require('./routes')
const config = require('../config')

dotenv.config()

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

app.listen(config.port, () => {    
    console.log(`Server is running on port ${config.port}`)
})