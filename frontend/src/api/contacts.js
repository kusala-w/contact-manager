import axios from 'axios'

console.log('import.meta.env.VITE_API_BASE_URL = ', import.meta.env.VITE_API_BASE_URL)
console.log('import.meta.env.VITE_API_TIMEOUT = ', import.meta.env.VITE_API_TIMEOUT)

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 30000
})

async function search (params, page = 1, limit = 10) {
    const data = { params, page, limit }
    const response = await api.post('/contacts/search', data)
    return response.data
}

async function create (data) {
    const response = await api.post('/contacts', data)
    return response.data
}

async function update (id, data) {
    const response = await api.post(`/contacts/${id}`, data)
    return response.data
}

async function _delete (id) {
    const response = await api.delete(`/contacts/${id}`)
    return response.data
}

async function loadHistory (id) {
    const response = await api.get(`contacts/${id}/history`)
    return response.data
}

export default {
    search,
    create,
    update,
    delete: _delete,
    loadHistory
}