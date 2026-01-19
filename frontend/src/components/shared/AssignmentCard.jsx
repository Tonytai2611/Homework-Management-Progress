import Badge from './Badge'

const AssignmentCard = ({
    assignment,
    onStart,
    onView,
    showActions = true,
    compact = false
}) => {
    const {
        title,
        subject,
        dueDate,
        status = 'pending',
        description,
        link,
        priority = 'medium'
    } = assignment

    const subjectIcons = {
        Reading: '📖',
        Writing: '✍️',
        Listening: '🎧',
        Speaking: '🗣️',
        Grammar: '📝',
        default: '📚'
    }

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

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffTime = date - now
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        if (diffDays < 0) return 'Overdue'
        if (diffDays === 0) return 'Due today'
        if (diffDays === 1) return 'Due tomorrow'
        return `Due ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
    }

    if (compact) {
        return (
            <div className={`card hover:shadow-lg transition-all duration-200 cursor-pointer ${priorityColors[priority]}`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1">
                        <span className="text-2xl">{subjectIcons[subject] || subjectIcons.default}</span>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 truncate">{title}</h4>
                            <p className="text-sm text-gray-600">{subject}</p>
                        </div>
                    </div>
                    <Badge variant={statusVariants[status]} size="sm">
                        {status === 'in-progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1)}
                    </Badge>
                </div>
            </div>
        )
    }

    return (
        <div className={`card hover:shadow-xl transition-all duration-200 ${priorityColors[priority]}`}>
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-purple-teal rounded-lg flex items-center justify-center text-2xl">
                        {subjectIcons[subject] || subjectIcons.default}
                    </div>
                    <div>
                        <div className="flex items-center space-x-2">
                            <Badge variant="primary" size="sm">{subject}</Badge>
                            {priority === 'high' && <Badge variant="danger" size="sm">High Priority</Badge>}
                        </div>
                        <h3 className="font-bold text-gray-900 mt-1">{title}</h3>
                    </div>
                </div>
                <Badge variant={statusVariants[status]}>
                    {status === 'in-progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1)}
                </Badge>
            </div>

            {description && (
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{description}</p>
            )}

            {link && (
                <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-purple-600 hover:text-purple-700 mb-3 inline-flex items-center"
                >
                    <span className="mr-1">🔗</span>
                    {link.length > 40 ? link.substring(0, 40) + '...' : link}
                </a>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span className={`text-sm font-medium ${formatDate(dueDate).includes('Overdue') ? 'text-red-600' :
                        formatDate(dueDate).includes('today') ? 'text-orange-600' :
                            'text-gray-600'
                    }`}>
                    📅 {formatDate(dueDate)}
                </span>

                {showActions && (
                    <div className="flex space-x-2">
                        {status === 'completed' ? (
                            <button
                                onClick={() => onView && onView(assignment)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                View →
                            </button>
                        ) : (
                            <button
                                onClick={() => onStart && onStart(assignment)}
                                className="px-4 py-2 text-sm font-medium text-white bg-gradient-purple-teal rounded-lg hover:shadow-lg transition-all"
                            >
                                {status === 'in-progress' ? 'Continue' : 'Start'} →
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default AssignmentCard
