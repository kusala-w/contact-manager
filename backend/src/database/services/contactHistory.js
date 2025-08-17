const _ = require('lodash')

const connectionPool = require('../connectionPool')
const { DatabaseError } = require('../errors')

const { contactHistory: contactHistoryModel } = require('../models')

async function create(history, client) {    
    const model = contactHistoryModel.mapToModel(history)
    
    let fields = null
    let values = null

    _.forEach(model, (value, key) => {
        if (key === 'id') return

        fields = fields ? `${fields}, ${key}` : `( ${key}`
        values = values ? `${values}, '${value}'` : `VALUES ('${value}'`
    })

    fields = fields ? `${fields} )` : null
    values = values ? `${values} )` : null
    const query = `INSERT INTO contact_history ${fields} ${values}`

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

module.exports = {
    create
}