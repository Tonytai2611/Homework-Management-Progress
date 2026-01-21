import { Link } from 'react-router-dom'
import Badge from './Badge'
import { SubjectIcon } from '../../utils/subjectIcons'

const AssignmentCard = ({
    assignment,
    onClick,
    onView,
    compact = false,
    showActions = false
}) => {
    const {
        id,
        title,
        subject,
        dueDate,
        due_date,
        status = 'pending',
        priority = 'medium'
    } = assignment

    const dueDateValue = dueDate
    // Subject icon is now handled by SubjectIcon component

    const statusVariants = {
        pending: 'warning',
        'in-progress': 'info',
        completed: 'success'
    }

    const priorityColors = {
        low: 'border-l-4 border-green-400',
        medium: 'border-l-4 border-orange-400',
        high: 'border-l-4 border-red-400'
    }

    const getDueDate = (dateString) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffTime = date - now
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        if (diffDays < 0) return 'Overdue'
        if (diffDays === 0) return 'Due today'
        if (diffDays === 1) return 'Due tomorrow'
        return `Due ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
    }

    const formatStatus = (status) => {
        return status === 'in-progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1)
    }

    if (compact) {
        return (
            <div className={`card hover:shadow-lg transition-all duration-200 cursor-pointer ${priorityColors[priority]}`} onClick={onClick}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1">
                        <SubjectIcon subject={subject} className="text-2xl" />
                        <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 truncate">{title}</h4>
                            <p className="text-sm text-gray-600">{subject}</p>
                        </div>
                    </div>
                    <Badge variant={statusVariants[status]} size="sm">
                        {formatStatus(status)}
                    </Badge>
                </div>
            </div>
        )
    }

    return (
        <div
            className={`card hover:shadow-xl transition-all duration-200 ${priorityColors[priority]} p-3 sm:p-4 cursor-pointer`}
            onClick={onClick}
        >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-0 mb-3">
                <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-purple-teal rounded-lg flex items-center justify-center text-xl sm:text-2xl flex-shrink-0">
                        <SubjectIcon subject={subject} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                            <Badge variant="primary" size="sm">{subject}</Badge>
                            {priority === 'high' && <Badge variant="danger" size="sm">High</Badge>}
                        </div>
                        <h3 className="font-bold text-gray-900 mt-1 text-sm sm:text-base truncate">{title}</h3>
                    </div>
                </div>
                <Badge variant={statusVariants[status]} size="sm">
                    {formatStatus(status)}
                </Badge>
            </div>

            {dueDateValue && (
                <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600 mb-3">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="truncate">{getDueDate(dueDateValue)}</span>
                </div>
            )}

            {showActions && (
                <div className="flex justify-end pt-3 border-t border-gray-200">
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            onView ? onView() : null
                        }}
                        className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-colors"
                        title="View Details"
                    >
                        <i className="fi fi-rr-eye text-xl"></i>
                    </button>
                    {!onView && !onClick && (
                        <Link
                            to={`/student/assignments/${id}`}
                            className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-colors"
                            title="View Details"
                        >
                            <i className="fi fi-rr-eye text-xl"></i>
                        </Link>
                    )}
                </div>
            )}
        </div>
    )
}

export default AssignmentCard
