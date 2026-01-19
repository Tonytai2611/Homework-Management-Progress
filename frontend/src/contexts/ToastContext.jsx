import { createContext, useContext, useState, useCallback } from 'react'

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

    const showToast = useCallback((message, type = 'info', duration = 3000) => {
        const id = Date.now()
        const newToast = { id, message, type, duration }

        setToasts(prev => [...prev, newToast])

        // Auto remove after duration
        if (duration > 0) {
            setTimeout(() => {
                removeToast(id)
            }, duration)
        }
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

const ToastContainer = ({ toasts, removeToast }) => {
    return (
        <div className="fixed top-4 right-4 z-[9999] space-y-2 pointer-events-none">
            {toasts.map(toast => (
                <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
            ))}
        </div>
    )
}

const Toast = ({ toast, onClose }) => {
    const { message, type } = toast

    const getToastStyles = () => {
        switch (type) {
            case 'success':
                return 'bg-green-500 text-white'
            case 'error':
                return 'bg-red-500 text-white'
            case 'warning':
                return 'bg-yellow-500 text-white'
            case 'info':
            default:
                return 'bg-blue-500 text-white'
        }
    }

    const getIcon = () => {
        switch (type) {
            case 'success':
                return '✓'
            case 'error':
                return '✗'
            case 'warning':
                return '⚠'
            case 'info':
            default:
                return 'ℹ'
        }
    }

    return (
        <div
            className={`${getToastStyles()} px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 min-w-[300px] max-w-md pointer-events-auto animate-slide-in-right`}
        >
            <span className="text-xl font-bold">{getIcon()}</span>
            <p className="flex-1 font-medium">{message}</p>
            <button
                onClick={onClose}
                className="text-white hover:text-gray-200 font-bold text-xl leading-none"
            >
                ×
            </button>
        </div>
    )
}
