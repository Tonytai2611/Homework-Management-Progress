import { Link } from 'react-router-dom'
import Badge from './Badge'
import { SubjectIcon } from '../../utils/subjectIcons'
import DescriptionIcon from '@mui/icons-material/Description'

const AssignmentCard = ({
    assignment,
    onStart,
    onView,
    showActions = true,
    compact = false
}) => {
    const {
        id,
        title,
        subject,
        dueDate,
        due_date,
        status = 'pending',
        priority = 'medium',
        description,
        link,
        tasks = []
    } = assignment

    // Handle both dueDate and due_date formats
    const dueDateValue = dueDate || due_date

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
        return `Due ${date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`
    }

    const formatStatus = (status) => {
        return status === 'in-progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1)
    }

    const subjectGradients = {
        'Reading': 'bg-gradient-to-br from-blue-400 to-blue-600 shadow-blue-200',
        'Writing': 'bg-gradient-to-br from-pink-400 to-rose-600 shadow-pink-200',
        'Listening': 'bg-gradient-to-br from-yellow-400 to-orange-500 shadow-orange-200',
        'Speaking': 'bg-gradient-to-br from-green-400 to-emerald-600 shadow-emerald-200',
        'Grammar': 'bg-gradient-to-br from-purple-400 to-indigo-600 shadow-purple-200'
    }

    const getGradient = (subj) => subjectGradients[subj] || 'bg-gradient-to-br from-gray-400 to-gray-600'

    if (compact) {
        return (
            <div className={`card hover:shadow-lg transition-all duration-200 cursor-pointer ${priorityColors[priority]}`}>
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
        <div className={`card hover:shadow-xl transition-all duration-200 ${priorityColors[priority]} p-3 sm:p-4`}>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-0 mb-3">
                <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 ${getGradient(subject)} rounded-xl shadow-lg flex items-center justify-center text-xl sm:text-2xl text-white flex-shrink-0 transition-transform hover:scale-105`}>
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
                <div className="flex items-center gap-2 self-start sm:self-auto">
                    {dueDateValue && (
                        <div className="flex items-center text-xs text-gray-500 mr-2 sm:mr-4 bg-gray-50 px-2 py-1 rounded-lg">
                            <i className="fi fi-rr-calendar mr-1.5"></i>
                            <span className="font-medium">{getDueDate(dueDateValue)}</span>
                        </div>
                    )}
                    <Badge variant={statusVariants[status]} size="sm">
                        {formatStatus(status)}
                    </Badge>
                    {showActions && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                onView ? onView(assignment) : null
                            }}
                            className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            title="View Details"
                        >
                            <i className="fi fi-rr-eye text-lg"></i>
                        </button>
                    )}
                </div>
            </div>

            {description && (
                <div className="mb-3">
                    <div className="flex items-center gap-2 mb-1">
                        <DescriptionIcon className="text-blue-600" fontSize="small" />
                        <span className="text-blue-600 text-sm font-semibold">Description:</span>
                    </div>
                    <p className="text-sm text-gray-700 ml-1 line-clamp-2">{description}</p>
                </div>
            )}

            {link && (
                <div className="mb-3">
                    <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 hover:underline gap-1.5 p-1 -ml-1 rounded-md hover:bg-blue-50 transition-colors"
                    >
                        <i className="fi fi-rr-link-alt text-lg"></i>
                        <span className="truncate max-w-[200px] sm:max-w-xs">{link}</span>
                    </a>
                </div>
            )}

            {tasks && tasks.length > 0 && (
                <div className="mb-3 bg-gray-50/80 rounded-lg p-3 border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Tasks</p>
                        <span className="text-xs text-gray-500">{tasks.length} items</span>
                    </div>
                    <ul className="space-y-1.5">
                        {tasks.slice(0, 3).map((task, idx) => (
                            <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                                <i className="fi fi-rr-check text-xs text-green-500 mt-1"></i>
                                <span className="line-clamp-1">{typeof task === 'string' ? task : task?.text || 'Task'}</span>
                            </li>
                        ))}
                        {tasks.length > 3 && (
                            <li className="text-xs text-purple-600 pl-3 font-medium">+ {tasks.length - 3} more tasks...</li>
                        )}
                    </ul>
                </div>
            )}

            {showActions && status !== 'completed' && (
                <div className="flex justify-end pt-3 border-t border-gray-200">
                    <button
                        onClick={() => onStart && onStart(assignment)}
                        className="w-full sm:w-auto px-4 py-2 text-xs sm:text-sm font-medium text-white bg-gradient-purple-teal rounded-lg hover:shadow-lg transition-all"
                    >
                        {status === 'in-progress' ? 'Continue' : 'Start'} →
                    </button>
                </div>
            )}
        </div>
    )
}

export default AssignmentCard

