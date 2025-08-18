const BaseError = require('./BaseError')

class InvalidEmailError extends BaseError {
    constructor(name) {
        super(
            'InvalidEmailError',
            400,
            `The email provided already exists in the system`
        )
    }
}

module.exports = InvalidEmailError