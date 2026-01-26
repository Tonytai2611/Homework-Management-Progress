import { createContext, useContext, useState, useCallback } from 'react'
import ToastContainer from '../components/shared/Toast'

const ToastContext = createContext(null)

export const useToast = () => {
    const context = useContext(ToastContext)
    if (!context) {
        throw new Error('useToast must be used within ToastProvider')
    }
    return context
}

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([])

    const showToast = useCallback((message, type = 'success', duration = 3000) => {
        const id = Date.now().toString()
        // If type is not one of 'success', 'error', 'info', default to 'info' or map it
        const validTypes = ['success', 'error', 'info']
        const toastType = validTypes.includes(type) ? type : 'info'

        setToasts(prev => [...prev, { id, message, type: toastType, duration }])
    }, [])

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id))
    }, [])

    return (
        <ToastContext.Provider value={{ showToast, removeToast }}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    )
}
