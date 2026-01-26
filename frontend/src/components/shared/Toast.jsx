import { motion, AnimatePresence } from 'framer-motion'
import { HiCheckCircle, HiExclamationCircle, HiInformationCircle, HiX } from 'react-icons/hi'
import { useEffect } from 'react'

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
    useEffect(() => {
        if (duration) {
            const timer = setTimeout(() => {
                onClose()
            }, duration)
            return () => clearTimeout(timer)
        }
    }, [duration, onClose])

    const icons = {
        success: <HiCheckCircle className="w-6 h-6 text-green-500" />,
        error: <HiExclamationCircle className="w-6 h-6 text-red-500" />,
        info: <HiInformationCircle className="w-6 h-6 text-blue-500" />
    }

    const styles = {
        success: 'bg-green-50 border-green-200 text-green-800',
        error: 'bg-red-50 border-red-200 text-red-800',
        info: 'bg-blue-50 border-blue-200 text-blue-800'
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            className={`flex items-start w-full max-w-sm px-4 py-3 rounded-lg shadow-lg border ${styles[type]} pointer-events-auto`}
            role="alert"
        >
            <div className="flex-shrink-0 mt-0.5">
                {icons[type]}
            </div>
            <div className="ml-3 flex-1">
                <p className="text-sm font-medium">
                    {message}
                </p>
            </div>
            <div className="ml-4 flex-shrink-0 flex">
                <button
                    onClick={onClose}
                    className="inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
                    aria-label="Close"
                >
                    <HiX className="w-5 h-5" />
                </button>
            </div>
        </motion.div>
    )
}

const ToastContainer = ({ toasts, removeToast }) => {
    return (
        <div className="fixed top-0 right-0 p-4 sm:p-6 z-[9999] flex flex-col items-end space-y-4 pointer-events-none">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <Toast
                        key={toast.id}
                        {...toast}
                        onClose={() => removeToast(toast.id)}
                    />
                ))}
            </AnimatePresence>
        </div>
    )
}

export default ToastContainer
