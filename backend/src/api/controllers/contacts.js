const _ = require('lodash')
const validator = require('validator')

const { contact: contactService } = require('../services')
const { 
    InvalidEmailError,
    InvalidParamError, 
    InvalidSearchParamError,
    MissingParamError
 } = require('../errors')

async function list (req, res, next) {    
    try{
        const contacts = await contactService.findAll()
        res.json(contacts)
    } catch(err) {
        next(err)
    }
}

async function load (req, res, next) {    
    const {id} = req.params

    if(!id) return next(new MissingParamError('id'))
    if(isNaN(Number(id))) return next(new InvalidParamError('id'))
    
    try {
        const contact = await contactService.findById(id)        
        res.json(contact)
    } catch (err) {
        next(err)
    }
}

async function search (req, res, next) {
    if (!req.body) return next(new InvalidSearchParamError())

    const { firstName, lastName, email, phone, isDeleted } = req.body

    const searchParams = _.omitBy({firstName, lastName, email, phone, isDeleted}, _.isUndefined)

    if (_.isEmpty(searchParams)) return next(new InvalidSearchParamError())

    try {
        const contacts = await contactService.find(searchParams)
        res.json(contacts)
    } catch (err) {
        next(err)
    }
}

async function validateEmail (req, res, next) {
    const { id, email } = req.body

    if (!email) return next(new MissingParamError('email'))

    try {
        const isUnique = await contactService.checkIsEmailUnique(email, id)
        res.json({ isUnique })
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

    if (!validator.isEmail(email)) return next(new InvalidParamError('email'))
    
    try {
        const isUniqueEmail = await contactService.checkIsEmailUnique(email)
        if (!isUniqueEmail) return next(new InvalidEmailError())

        const contact = await contactService.create({firstName, lastName, email, phone, isDeleted: false})
        res.json(contact)
    } catch (err) {
        next(err)
    }
}

async function update (req, res, next) {
    const { id } = req.params
    const { firstName, lastName, email, phone } = req.body

    if (!id) return next(new MissingParamError('id'))
    if (!firstName) return next(new MissingParamError('firstName'))
    if (!lastName) return next(new MissingParamError('lastName'))
    if (!email) return next(new MissingParamError('email'))
    if (!phone) return next(new MissingParamError('phone'))

    try {
        const contact = await contactService.update(id, { firstName, lastName, email, phone })
        res.json(contact)
    } catch (err) {
        next(err)
    }
                    
}

async function _delete (req, res, next) {
    const { id } = req.params

    if (!id) return next(new MissingParamError('id'))

    try {
        const isDeleted = await contactService.delete(id)
        res.json({ isDeleted })
    } catch (err) {
        next(err)
    }
}

module.exports = {
    list,
    load,
    search,
    validateEmail,
    create,
    update,
    delete: _delete
}