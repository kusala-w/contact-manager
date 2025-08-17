const { contact: contactModel } = require('../models')
const connectionPool = require('../connectionPool')
const _ = require('lodash')

async function findAll() {
    try {
        const result = await connectionPool.query('SELECT * FROM contact')        
        return result.rows.map(contactModel.mapToObject)
    } catch(error) {
        console.log(`Error in contact.findAll(). Error: ${error}`)
    }
}

async function findById(id) {
    try {
        const result = await connectionPool.query(`SELECT * FROM contact WHERE id = ${id}`)        
        if(result.rowsCount) return contactModel.mapToObject(result.rows[0])
        return null
    } catch(error) {
        console.log(`Error in contact.findById() for id ${id}. Error: ${error}`)
    }
}

async function find(params) {
    const model = contactModel.mapToModel(params)
    const paramsToFilter = _.pickBy(model, value => !_.isUndefined(value))

    const condition = null
    _.forEach(paramsToFilter, (value, key) => {
        condition = condition ? `${condition} AND` : ''
        condition = `${condition} ${key} = ${value}`
    })

    let query = `SELECT * FROM contact`
    query = condition ? `${query} ${condition}` : query

    try {
        const result = await connectionPool.query(query)
        return result.rows.map(contactModel.mapToObject)
    } catch (error) {
        console.log(`Error in contact.find() for params ${params.join(',')}. Error: ${error}`)
    }
}

async function create(contact) {}

async function update(id, contact) {}

async function _delete(id) {}

module.exports = {
    findAll,
    findById,
    find,
    create,
    update,
    delete: _delete
}