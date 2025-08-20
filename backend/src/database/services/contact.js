const _ = require('lodash')

const connectionPool = require('../connectionPool')
const { DatabaseError } = require('../errors')

const { contact: contactModel } = require('../models')
const contactHistoryService = require('./contactHistory')


async function findAll(page, limit) {
    try {
        const countQuery = 'SELECT COUNT(*)::int AS count FROM contact'
        const countResult = await connectionPool.query(countQuery)
        const recordCount = countResult.rows[0].count       
        
        let query = 'SELECT * FROM contact ORDER BY id'
        if (page, limit) {
            const offset = (page - 1) * limit
            query = `${query} LIMIT ${limit} OFFSET ${offset}`
        }

        const result = await connectionPool.query(query)
        const contacts = result.rows.map(contactModel.mapToObject)

        return {
            contacts,
            recordCount
        }

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

async function find(params, page, limit) {
    const model = contactModel.mapToModel(params)
    const paramsToFilter = _.pickBy(model, value => !_.isUndefined(value))

    const conditions = _.map(paramsToFilter, (value, key) => `${key} = '${value}'`)

    let countQuery = 'SELECT COUNT(*)::int AS count FROM contact'
    countQuery = conditions.length ? `${countQuery} WHERE ${conditions.join(' AND ')}` : countQuery
    
    let query = 'SELECT * FROM contact'
    query = conditions.length ? `${query} WHERE ${conditions.join(' AND ')}` : query
    if (page && limit) {
        const offset = (page - 1) * limit
        query = `${query} ORDER BY id LIMIT ${limit} OFFSET ${offset}`
    }

    try {
        const countResult = await connectionPool.query(countQuery)
        const recordCount = countResult.rows[0].count

        const result = await connectionPool.query(query)
        const contacts = result.rows.map(contactModel.mapToObject)

        return {
            contacts,
            recordCount
        }
    } catch (error) {
        console.error(`Error in contact.find(). Error: ${error}`)
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
        if (['id', 'is_deleted'].includes(key)) return
        updateFields.push(`${key} = '${value}'`)
    })

    const query = `UPDATE contact SET ${updateFields.join(', ')} WHERE id = ${id} RETURNING *`
    
    const dbClient = await connectionPool.connect()

    try {
        await dbClient.query('BEGIN')
        const result = await dbClient.query(query)
        const contact = contactModel.mapToObject(result.rows[0])

        await contactHistoryService.create({
            contactId: id,
            action: 'Update',
            description: 'Updated through the app'            
        }, dbClient)

        await dbClient.query('COMMIT')

        return contact
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