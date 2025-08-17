const { contact: contactService } = require('../services')

async function list (req, res, next) {    
    try{
        const result = await contactService.findAll()
        res.json(result)
    } catch(err) {
        next(err)
    }
}

async function load () {}
async function create () {}
async function update () {}
async function _delete () {}

module.exports = {
    list,
    load,
    create,
    update,
    delete: _delete
}