const _ = require('lodash')

const connectionPool = require('../connectionPool')
const { DatabaseError } = require('../errors')

const { contactHistory: contactHistoryModel } = require('../models')

async function create(history, client) {    
    const model = contactHistoryModel.mapToModel(history)

    const fields = []
    const values = []

    _.forEach(model, (value, key) => {
        if (key === 'id') return

        fields.push(key)
        values.push(`'${value}'`)
    })

    const query = `INSERT INTO contact_history (${fields.join(', ')}) VALUES (${values.join(', ')})`
        
    const dbClient = client || await connectionPool.connect()

    try {
        await dbClient.query(query)        
    } catch (err) {
        console.error(`Error in contactHistory.create(). ${err}`)
        throw new DatabaseError()
    } finally {
        if(!client) dbClient.release()
    }
}

async function find(params) {
    const model = contactHistoryModel.mapToModel(params)
    const paramsToFilter = _.pickBy(model, value => !_.isUndefined(value))

    const conditions = _.map(paramsToFilter, (value, key) => `${key} = '${value}'`)

    let query = `SELECT * FROM contact`
    query = conditions.length ? `${query} WHERE ${conditions.join(' AND ')}` : query

    try {
        const result = await connectionPool.query(query)
        return result.rows.map(contactHistoryModel.mapToObject)
    } catch (error) {
        console.error(`Error in contactHistory.find() for params ${params.join(',')}. Error: ${error}`)
        throw new DatabaseError()
    }
}

module.exports = {
    create,
    find
}