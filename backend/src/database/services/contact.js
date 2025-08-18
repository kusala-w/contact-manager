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
        console.error(`Error in contact.findAll(). Error: ${error}`)
        throw new DatabaseError()
    }
}

async function findById(id) {
    try {
        const result = await connectionPool.query(`SELECT * FROM contact WHERE id = ${id}`)        
        if(result.rowCount) return contactModel.mapToObject(result.rows[0])
        return null
    } catch(error) {
        console.error(`Error in contact.findById() for id ${id}. Error: ${error}`)
        throw new DatabaseError()
    }
}

async function find(params) {
    const model = contactModel.mapToModel(params)
    const paramsToFilter = _.pickBy(model, value => !_.isUndefined(value))

    const conditions = _.map(paramsToFilter, (value, key) => `${key} = '${value}'`)
    
    let query = `SELECT * FROM contact`
    query = conditions.length ? `${query} WHERE ${conditions.join(' AND ')}` : query

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

    const fields = []
    const values = []

    _.forEach(model, (value, key) => {
        if (key === 'id') return
        fields.push(key)
        values.push(`'${value}'`)
    })
      
    const query = `INSERT INTO contact (${fields.join(', ')}) VALUES (${values.join(', ')}) RETURNING *`    

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

async function update(id, contact) {
    const model = contactModel.mapToModel(contact)

    const updateFields = []

    _.forEach(model, (value, key) => {
        if (key === 'id') return
        updateFields.push(`${key} = ${value}`)
    })

    const query = `UPDATE contact SET ${updateFields.join(', ')} WHERE id = ${id}`
    
    const dbClient = await connectionPool.connect()

    try {
        await dbClient.query('BEGIN')
        const result = await dbClient.query(query)        

        await contactHistoryService.create({
            contactId: id,
            action: 'Update',
            description: 'Updated through the app'            
        }, dbClient)

        await dbClient.query('COMMIT')

        return true
    } catch (error) {
        await dbClient.query('ROLLBACK')

        console.error(`Error in contact.update() for contactId '${id}'. Error: ${error}`)
        throw new DatabaseError()
    } finally {
        dbClient.release()
    }
}

async function _delete(id) {
    const query = `UPDATE contact SET is_deleted = true WHERE id = ${id}`

    const dbClient = await connectionPool.connect()

    try {
        await dbClient.query('BEGIN')
        const result = await dbClient.query(query)
        
        await contactHistoryService.create({
            contactId: id,
            action: 'Delete',
            description: 'Deleted through the app'
        }, dbClient)

        await dbClient.query('COMMIT')

        return true
    } catch (error) {
        await dbClient.query('ROLLBACK')

        console.error(`Error in contact.delete() for contactId '${id}'. Error: ${error}`)
        throw new DatabaseError()
    } finally {
        dbClient.release()
    }
}

module.exports = {
    findAll,
    findById,
    find,
    create,
    update,
    delete: _delete
}