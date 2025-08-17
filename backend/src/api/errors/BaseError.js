class BaseError extends Error {
    constructor(type, statusCode, message) {
        super(message)

        this.type = type
        this.statusCode = statusCode

        // Capture the stack trace
        Error.captureStackTrace(this, this.constructor)
    }
}

module.exports = BaseError