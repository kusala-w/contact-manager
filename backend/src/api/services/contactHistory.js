const { contactHistory: contactHistoryService } = require('../../database/services')

async function find(params) {
    return contactHistoryService.find(params)
}

module.exports = {
    find
}