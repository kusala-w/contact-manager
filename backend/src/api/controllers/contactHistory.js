const _ = require('lodash')

const { contactHistory: contactHistoryService  } = require('../services')

async function search (req, res, next) {
    if (!req.body) return next(new InvalidSearchParamError())

    const { contactId, action } = req.body

    const searchParams = _.omitBy({contactId, action}, _.isUndefined)

    if (_.isEmpty(searchParams)) return next(new InvalidSearchParamError())

    try {
        const history = await contactHistoryService.find(searchParams)
        res.json(history)
    } catch (err) {
        next(err)
    }
}

module.exports = {
    search
}