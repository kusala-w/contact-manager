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
                phone: contact.phone
            })
        }
    }, [contact])

    function updateField(e) {
        const { id, value } = e.target
        let newValue = value

        if (id === 'phone') {
            newValue = value.replace(/\D/g,'') // remove all non-digits
        }

        setForm(prev => ({ ...prev, [id]: newValue}))
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
                    <div className="form-group">
                        <label htmlFor="firstName">
                            First Name <span className="required">*</span>
                        </label>
                        <input
                            id='firstName'
                            type="text"
                            value={form.firstName}
                            onChange={updateField}
                            disabled={isSaving}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="lastName">
                            Last Name <span className="required">*</span>
                        </label>
                        <input
                            id='lastName'
                            type='text'
                            value={form.lastName}
                            onChange={updateField}                            
                            disabled={isSaving}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">
                            Email <span className="required">*</span>
                        </label>
                        <input
                            id='email'
                            type='text'
                            value={form.email}
                            onChange={updateField}                            
                            disabled={isSaving}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone">
                            Phone <span className="required">*</span>
                        </label>
                        <input
                            id='phone'
                            type='tel'
                            value={form.phone}
                            pattern='[0-9]*'
                            onChange={updateField}                            
                            disabled={isSaving}
                            required
                        />
                    </div>
                    
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