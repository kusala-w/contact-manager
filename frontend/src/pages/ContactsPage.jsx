import { useState, useEffect } from "react";
import contactsApi from '../api/contacts'

import ContactForm from "../components/ContactForm";
import ContactHistory from "../components/ContactHistory";
import Spinner from '../components/Spinner'

import { Clock, Edit2, Trash2 } from 'lucide-react'
import '../styles/contactsPage.css'

function ContactsPage () {
    const [contacts, setContacts] = useState([])
    const [isLoading, setLoading] = useState(false)    
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [selectedContact, setSelectedContact] = useState(null)
    const [contactHistory, setContactHistory] = useState(null)
    const [showContactHistory, setShowContactHistory] = useState(false)
    const [showContactForm, setShowContactForm] = useState(false)
    const [error, setError] = useState(null)

    const limit = 10

    async function getContacts (page=1) {
        setLoading(true)
        setError(null)
        try {            
            const result = await contactsApi.search({ isDeleted: false }, page, limit)
            setContacts(result.contacts)

            const pageCount = Math.ceil(Math.max(result.recordCount / limit, 1))
            setTotalPages(pageCount)
        } catch (err) {
            setError('There was an error loading Contact.')
            console.error(`Error loading Contacts. ${err}`)
        } finally {
            setLoading(false)
        }
    }

    async function loadHistory (contact) {
        setLoading(true)
        setError(null)

        try {
            const history = await contactsApi.loadHistory(contact.id)            
            setContactHistory(history)
            setSelectedContact(contact)
            setShowContactHistory(true)
        } catch (err) {
            setError('There was an error loading Contact history.')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    function closeHistory () {
        setSelectedContact(null)
        setContactHistory(null)
        setShowContactHistory(false)
    }

    async function deleteContact (contact) {
        setLoading(true)
        setError(null)

        try {
            await contactsApi.delete(contact.id)
            await getContacts(page)
        } catch (err) {
            setError('There was an error deleting Contact.')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    async function createContact () {
        setSelectedContact(null)
        setShowContactForm(true)
    }

    async function editContact (contact) {
        setSelectedContact(contact)
        setShowContactForm(true)
    }

    function closeContactForm () {
        setShowContactForm(false)
        getContacts(page)
    }

    useEffect(() => {
        getContacts()
    }, [page])
    
    const viewNextPage = () => setPage((prev) => Math.min(prev + 1, totalPages))
    const viewPreviousPage = () => setPage((prev) => Math.max(prev - 1, 1))

    return (
        <div className="contacts-page">
            <h1>Contacts</h1>

            {error && <p className="error">{error}</p>}

            <button 
                onClick={createContact}
                className="new-contact-btn"
            >
                + New Contact
            </button>

            {isLoading ? (
                <Spinner/>
            ) : (
                <table className="contacts-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Active?</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contacts.map(contact=> (
                            <tr key={contact.id}>
                                <td>{contact.id}</td>
                                <td>{contact.fullName}</td>
                                <td>{contact.email}</td>
                                <td>{contact.phone}</td>
                                <td>{contact.isDeleted ? 'No' : 'Yes'}</td>
                                <td className="actions">
                                    <button onClick={() => loadHistory(contact)}>
                                        <Clock size={18} />
                                    </button>
                                    <button onClick={() => editContact(contact)}>
                                        <Edit2 size={18} />
                                    </button>
                                    <button onClick={() => deleteContact(contact)}>
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <div className="pagination">
                <button onClick={viewPreviousPage} disabled={page === 1}>Previous</button>
                <span className="page-indicator">
                    Page {page} of {totalPages}
                </span>
                <button onClick={viewNextPage} disabled={page === totalPages}>Next</button>
            </div>

            {showContactHistory && (
                <ContactHistory
                    contact={selectedContact}
                    history={contactHistory}
                    onClose={closeHistory}
                />
            )}

            {showContactForm && (
                <ContactForm
                    contact={selectedContact}
                    onClose={closeContactForm}
                    onSave={closeContactForm}
                />
            )}
        </div>
    )
}

export default ContactsPage