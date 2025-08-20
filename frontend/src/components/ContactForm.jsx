import { useState, useEffect } from "react";
import contactsApi from '../api/contacts'

import Spinner from "./Spinner";
import '../styles/ContactForm.css'

function ContactForm ({ contact = null, onClose, onSave}) {
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
    })
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState(null)

    const title = contact ? 'Edit Contact' : 'Create Contact'
    
    useEffect(() => {        
        if (contact) {
            setForm({
                firstName: contact.firstName,
                lastName: contact.lastName,
                email: contact.email,
                phone: contact.email
            })
        }
    }, [contact])

    function updateField(e) {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value}))
    }

    function isFormValid () {
        return (
            form.firstName.trim() && form.lastName.trim() && form.email.trim() && form.phone.trim()
        )
    }

    async function save (e) {
        e.preventDefault()

        setIsSaving(true)
        setError(null)

        try {
            const savedContact = contact
                ? await contactsApi.update(contact.id, form)
                : await contactsApi.create(form)

            onSave(savedContact)
        } catch (err) {
            setError('There was an error saving Contact.')
            console.error(err)
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="modal-overlay">
            <div className="modal contact-form-modal">
                <h2>{title}</h2>

                {isSaving && <Spinner/>}
                
                <form 
                    onSubmit={save}
                    className="contact-form"
                >
                    <input
                        name='firstName'
                        placeholder='First Name *'
                        value={form.firstName}
                        onChange={updateField}
                        required
                        disabled={isSaving}
                    />
                    <input
                        name='lastName'
                        placeholder='Last Name *'
                        value={form.lastName}
                        onChange={updateField}
                        required
                        disabled={isSaving}
                    />
                    <input
                        name='email'
                        placeholder='Email *'
                        value={form.email}
                        onChange={updateField}
                        required
                        disabled={isSaving}
                    />
                    <input
                        name='phone'
                        placeholder='Phone *'
                        value={form.phone}
                        onChange={updateField}
                        required
                        disabled={isSaving}
                    />
                    
                    {error && <p className="error">{error}</p>}

                    <div className="form-actions">
                        <button 
                            type='submit' 
                            disabled={isSaving || !isFormValid()}
                            className="btn-primary"
                        >
                            {isSaving ? 'Saving...' : 'Save'}
                        </button>
                        <button 
                            type='button'
                            disabled={isSaving}
                            onClick={onClose}
                            className="btn-secondary"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ContactForm