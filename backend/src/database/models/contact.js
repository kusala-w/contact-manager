function mapToObject (model) {
    return {
        id: model.id,
        firstName: model.first_name,
        lastName: model.last_name,
        fullName: `${model.first_name} ${model.last_name}`,
        email: model.email,
        phone: model.phone,
        isDeleted: model.is_deleted
    }
}

function mapToModel (object) {
    return {
        id: object.id,
        first_name: object.firstName,
        last_name: object.lastName,        
        email: object.email,
        phone: object.phone,
        is_deleted: object.isDeleted
    }
}

module.exports = {
    mapToObject,
    mapToModel
}