const express = require('express')
const router = express.Router()
const { contacts } = require('../controllers')

router.get('/', contacts.list)
router.get('/:id', contacts.load)
router.post('/search', contacts.search)
router.post('/', contacts.create)
router.post('/:id', contacts.update)
router.delete('/:id', contacts.delete)

module.exports = router