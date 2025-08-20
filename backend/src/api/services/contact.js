const { contact: contactService } = require('../../database/services')

async function findAll(page, limit) {
    return await contactService.findAll(page, limit)
}

async function findById(id) {
    return await contactService.findById(id)
}

async function find(params, page, limit) {
    return await contactService.find(params, page, limit)
}

async function checkIsEmailUnique (email, id = null) {
    const response = await contactService.find({ email })

    if (id) return !!(
        !response.recordCount 
        || (response.recordCount == 1 && response.contacts[0]?.id === id)
    )
    
    return !response.contacts?.length
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