const express = require('express')
const router = express.Router()
const { contactHistory } = require('../controllers')

router.post('/search', contactHistory.search)

module.exports = router