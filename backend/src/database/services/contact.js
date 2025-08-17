const _ = require('lodash')

const connectionPool = require('../connectionPool')
const { DatabaseError } = require('../errors')

const { contact: contactModel } = require('../models')
const contactHistoryService = require('./contactHistory')


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
        console.error(`Error in contact.findById() for id ${id}. Error: ${error}`)
        throw new DatabaseError()
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
        console.error(`Error in contact.find() for params ${params.join(',')}. Error: ${error}`)
        throw new DatabaseError()
    }
}

async function create(contact) {
    const model = contactModel.mapToModel(contact)
    
    let fields = null
    let values = null

    _.forEach(model, (value, key) => {
        if (key === 'id') return

        fields = fields ? `${fields}, ${key}` : `( ${key}`
        values = values ? `${values}, '${value}'` : `VALUES ('${value}'`
    })

    fields = fields ? `${fields} )` : null
    values = values ? `${values} )` : null
    const query = `INSERT INTO contact ${fields} ${values} RETURNING *`

    const dbClient = await connectionPool.connect()

    try {
        await dbClient.query('BEGIN')
        const result = await dbClient.query(query)
        const contact = contactModel.mapToObject(result.rows[0])
       
        await contactHistoryService.create({
            contactId: contact.id,
            action: 'Create',
            description: 'Created through the app'
        }, dbClient)

        await dbClient.query('COMMIT')

        return contact
    } catch (error) {
        await dbClient.query('ROLLBACK')

        console.error(`Error in contact.create(). Error: ${error}`)        
        throw new DatabaseError()
    } finally {
        dbClient.release()
    }
    
}

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