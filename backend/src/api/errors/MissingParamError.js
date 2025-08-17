const BaseError = require('./BaseError')

class MissingParameterError extends BaseError {
    constructor(name) {
        super('MissingParameterError'),
        400,
        `Parameter '${name}' is missing`
    }
}

module.exports = MissingParameterError