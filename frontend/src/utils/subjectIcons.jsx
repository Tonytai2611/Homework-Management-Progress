import { FaHeadphones } from "react-icons/fa"
import { RiSpeakLine } from "react-icons/ri"

/**
 * Get Icon for subject (Can be string class or component)
 * @param {string} subject - Subject name
 * @returns {string|Component} Icon class string or React Component
 */
export const getSubjectIcon = (subject) => {
    const icons = {
        'Reading': 'fi fi-rs-book-alt',
        'Writing': 'fi fi-rr-pencil',
        'Listening': FaHeadphones,
        'Speaking': RiSpeakLine,
        'Grammar & Vocabulary': 'fi fi-rs-document',
        'Grammar': 'fi fi-rs-document'
    }
    return icons[subject] || 'fi fi-rs-document'
}

/**
 * Render subject icon component
 * @param {string} subject - Subject name
 * @param {string} className - Additional CSS classes
 * @returns {JSX.Element} Icon element
 */
export const SubjectIcon = ({ subject, className = '' }) => {
    const Icon = getSubjectIcon(subject)

    // Check if it's a component (function) or string (class name)
    if (typeof Icon === 'function') {
        return <Icon className={className} />
    }

    return <i className={`${Icon} ${className}`}></i>
}

/**
 * Format subject for display
 */
export const formatSubject = (subject) => {
    if (!subject) return ''
    if (subject.toLowerCase() === 'grammar' || subject === 'Grammar & Vocabulary') return 'Grammar & Vocabulary'
    return subject
}
