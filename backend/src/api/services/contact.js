const {
    contact: contactService
} = require('../../database/services')

async function findAll() {
    return await contactService.findAll()
}

async function findById(id) {
    return await contactService.findById(id)
}

async function find(params) {}

async function create (params) {
    return await contactService.create(params)
}

async function update(id, params) {}

async function _delete(id) {}

module.exports = {
    findAll,
    findById,
    find,
    create,
    update,
    delete: _delete
}