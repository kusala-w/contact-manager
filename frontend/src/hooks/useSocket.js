import { useEffect } from 'react'
import { io } from 'socket.io-client'

let socket

function getSocket() {
    socket = socket || io(import.meta.env.VITE_API_BASE_URL)
    return socket
}

function useSocket(event, callback) {
    useEffect(() => {
        const s = getSocket()
        s.on(event, callback) // Notify

        return () => {
            s.off(event, callback) // Remove listener
        }
    }, [event, callback])
}

export default useSocket