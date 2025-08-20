import { useState, useEffect } from "react";
import contactsApi from '../api/contacts'

import ContactCard from "../components/ContactCard"
import Spinner from '../components/Spinner'

function ContactsPage () {
    const [contacts, setContacts] = useState([])
    const [isLoading, setLoading] = useState(false)    
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const limit = 10

    async function getContacts (page=1) {
        setLoading(true)
        try {            
            const result = await contactsApi.search({ isDeleted: false }, page, limit)
            setContacts(result.contacts)
            setTotalPages(result.totalPages)
        } catch (err) {
            console.error(`Error loading Contacts. ${err}`)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getContacts()
    }, [page])

    // Pagination handlers
    const handleNext = () => setPage((prev) => Math.min(prev + 1, totalPages))
    const handlePrev = () => setPage((prev) => Math.max(prev - 1, 1))

    return (
        <div>
            <h1>Contacts</h1>

            {isLoading ? (
                <Spinner/>
            ) : (
                <div className="contact-list">
                    {contacts.map((contact) => (
                        <ContactCard key={contact.id} contact={contact} />
                    ))}
                </div>
            )}

            <div className="pagination">
                <button onClick={handlePrev} disabled={page === 1}>Previous</button>
                <button onClick={handleNext} disabled={page === totalPages}>Next</button>
            </div>
        </div>
    )
}

export default ContactsPage