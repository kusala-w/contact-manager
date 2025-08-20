import '../styles/deleteConfirm.css'

function DeleteConfirm({ contact, onCancel, onConfirm }) {
    if (!contact) return

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Delete Contact</h2>
                <p>Are you sure you want to delete <strong>{contact.fullName}</strong>?</p>
                <div className="form-actions">
                    <button onClick={onConfirm} className="btn-primary">Delete</button>
                    <button onClick={onCancel} className="btn-secondary">Cancel</button>
                </div>
            </div>
        </div>
    )
}

export default DeleteConfirm