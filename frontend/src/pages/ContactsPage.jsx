import { useState, useEffect } from "react";
import contactsApi from '../api/contacts'

import ContactCard from "../components/ContactCard"
import ContactHistory from "../components/ContactHistory";
import Spinner from '../components/Spinner'

function ContactsPage () {
    const [contacts, setContacts] = useState([])
    const [isLoading, setLoading] = useState(false)    
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [selectedContact, setSelectedContact] = useState(null)
    const [contactHistory, setContactHistory] = useState(null)

    const limit = 10

    async function getContacts (page=1) {
        setLoading(true)
        try {            
            const result = await contactsApi.search({ isDeleted: false }, page, limit)
            setContacts(result.contacts)

            const pageCount = Math.max(result.recordCount / limit, 1)
            setTotalPages(pageCount)
        } catch (err) {
            console.error(`Error loading Contacts. ${err}`)
        } finally {
            setLoading(false)
        }
    }

    async function loadHistory (contact) {
        setLoading(true)

        try {
            const history = await contactsApi.loadHistory(contact.id)            
            setContactHistory(history)
            setSelectedContact(contact)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    function closeHistory () {
        setSelectedContact(null)
        setContactHistory(null)
    }

    async function deleteContact (contact) {
        setLoading(true)

        try {
            await contactsApi.delete(contact.id)
            await getContacts(page)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getContacts()
    }, [page])
    
    const viewNextPage = () => setPage((prev) => Math.min(prev + 1, totalPages))
    const viewPreviousPage = () => setPage((prev) => Math.max(prev - 1, 1))

    return (
        <div>
            <h1>Contacts</h1>

            {isLoading ? (
                <Spinner/>
            ) : (
                <div className="contact-grid">
                    {contacts.map((contact) => (
                        <ContactCard 
                            key={contact.id} 
                            contact={contact}                            
                            onViewHistory={loadHistory}
                            onDelete={deleteContact}
                        />
                    ))}
                </div>
            )}

            <div className="pagination">
                <button onClick={viewPreviousPage} disabled={page === 1}>Previous</button>
                <span className="page-indicator">
                    Page {page} of {totalPages}
                </span>
                <button onClick={viewNextPage} disabled={page === totalPages}>Next</button>
            </div>

            <ContactHistory
                contact={selectedContact}
                history={contactHistory}
                onClose={closeHistory}
            />
        </div>
    )
}

export default ContactsPage