const BaseError = require('./BaseError')

class InvalidParameterError extends BaseError {
    constructor(name) {
        super(
            'InvalidParameterError',
            400,
            `Parameter '${name}' is not in the correct format`
        )
    }
}

module.exports = InvalidParameterError