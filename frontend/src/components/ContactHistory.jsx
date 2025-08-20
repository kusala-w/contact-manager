function ContactHistory ({ contact, history, onClose }) {
    if (!contact) return null

    console.log('history = ', history)

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-header">
                    <h2>Update history for {contact.fullName}</h2>
                    <button onClick={onClose} className="close-btn">x</button>
                </div>

                <table className="history-table">
                    <thead>
                        <tr>
                            <th>Action</th>
                            <th>Date</th>
                            <th>Description</th>
                        </tr>                        
                    </thead>
                    <tbody>
                        {history.map((record) => (
                            <tr key={record.id}>
                                <td><strong>{record.action}</strong></td>
                                <td>{new Date(record.createdAt).toLocaleString()}</td>
                                <td>{record.description}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ContactHistory