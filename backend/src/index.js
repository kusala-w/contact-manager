const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const router = require('./routes')

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())
app.use(router)

app.listen(process.env.PORT, () => {    
    console.log(`Server is running on port ${process.env.PORT}`)    
})