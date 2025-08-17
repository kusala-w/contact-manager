class DatabaseError extends Error {
    constructor() {
        super('A database error occured')
    }
}

module.exports = DatabaseError