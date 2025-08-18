const BaseError = require('./BaseError')

class InvalidParameterError extends BaseError {
    constructor(name) {
        super(
            'InvalidSearchParameterError',
            400,
            `At least one search parameter is required`
        )
    }
}

module.exports = InvalidParameterError