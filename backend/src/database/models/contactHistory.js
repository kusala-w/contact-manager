function mapToObject (model) {
    return {
        id: model.id,
        contactId: model.contact_id,
        action: model.action,
        description: model.description,
        createdAt: model.created_at
    }
}

function mapToModel (object) {
    return {
        contact_id: object.contactId,
        action: object.action,
        description: object.description
    }
}

module.exports = {
    mapToObject,
    mapToModel
}