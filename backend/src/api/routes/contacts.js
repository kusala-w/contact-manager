const express = require('express')
const router = express.Router()
const { contacts } = require('../controllers')

router.get('/', contacts.list)
router.get('/:id', contacts.load)
router.post('/search', contacts.search)
router.post('/validate-email', contacts.validateEmail)
router.post('/', contacts.create)
router.post('/:id', contacts.update)
router.delete('/:id', contacts.delete)
router.get('/:id/history', contacts.loadHistory)

module.exports = router