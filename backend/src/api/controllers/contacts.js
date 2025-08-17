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

async function create (req, res, next) {
    const { firstName, lastName, email, phone } = req.body

    if (!firstName) return next(new MissingParamError('firstName'))
    if (!lastName) return next(new MissingParamError('lastName'))
    if (!email) return next(new MissingParamError('email'))
    if (!phone) return next(new MissingParamError('phone'))

    try {
        const isCreated = await contactService.create({firstName, lastName, email, phone, isDeleted: false})
        res.json({isCreated})
    } catch(err) {
        next(err)
    }
}

async function update () {}
async function _delete () {}

module.exports = {
    list,
    load,
    create,
    update,
    delete: _delete
}