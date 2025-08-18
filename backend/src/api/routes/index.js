const router = require('express').Router()
const contacts = require('./contacts')
const contactHistory = require('./contactHistory')

router.use('/contacts', contacts)
router.use('/contact-history', contactHistory)

module.exports = router