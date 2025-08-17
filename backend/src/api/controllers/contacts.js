const { contact: contactService } = require('../services')
const { MissingParamError, InvalidParamError } = require('../errors')

async function list (req, res, next) {    
    try{
        const result = await contactService.findAll()
        res.json(result)
    } catch(err) {
        next(err)
    }
}

async function load (req, res, next) {    
    const {id} = req.params

    if(!id) return next(new MissingParamError('id'))
    if(isNaN(Number(id))) return next(new InvalidParamError('id'))
    
    try {
        const result = await contactService.findById(id)
        res.json(result)
    } catch (err) {
        next(err)
    }
}


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