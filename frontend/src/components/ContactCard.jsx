function ContactCard ({ contact, onEdit, onDelete, onViewHistory }) {
    const isDeleted = contact.isDeletd ? 'Yes' : 'No'

    return (
        <div className="contact-card">
            <div className="contact-header">
                <h2>{contact.fullName}</h2>
            </div>

            <div className="contact-details">
                <p><strong>ID: </strong> {contact.id}</p>
                <p><strong>Email: </strong> {contact.email}</p>
                <p><strong>Phone: </strong> {contact.phone}</p>
                <p><strong>Is Deleted: </strong> {isDeleted}</p>              
            </div>

            <div className="contact-actions">
                <button onClick={() => onViewHistory(contact)}>History</button>
                <button onClick={() => onEdit(contact)}>Edit</button>
                <button onClick={() => onDelete(contact)}>Delete</button>
            </div>
        </div>
    )
}

export default ContactCard