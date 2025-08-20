function ContactCard ({ contact, onEdit, onDelete }) {
    return (
        <div className="contact-card">
            <h3>{contact.firstName} {contact.lastName}</h3>
            <p>Email: {contact.email}</p>
            <p>Phone: {contact.phone}</p>
            <div className="actions">
                <button onClick={() => onEdit(contact)}>Edit</button>
                <button onClick={() => onDelete(contact)}>Delete</button>
            </div>
        </div>
    )
}

export default ContactCard