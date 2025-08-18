const { contact: contactService } = require('../../database/services')

async function findAll() {
    return await contactService.findAll()
}

async function findById(id) {
    return await contactService.findById(id)
}

async function find(params) {
    return await contactService.find(params)
}

async function checkIsEmailUnique (email, id = null) {
    const contacts = await contactService.find({ email })

    if (id) return !!(!contacts.length || (contacts.length == 1 && contacts[0]?.id === id))
    
    return !contacts.length
}

async function create (params) {
    return await contactService.create(params)
}

async function update(id, params) {
    return await contactService.update(id, params)
}

async function _delete(id) {
    return await contactService.delete(id)
}

module.exports = {
    findAll,
    findById,
    find,
    checkIsEmailUnique,
    create,
    update,
    delete: _delete
}