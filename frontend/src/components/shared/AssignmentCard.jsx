import { Link } from 'react-router-dom'
import Badge from './Badge'
import { SubjectIcon } from '../../utils/subjectIcons'
import DescriptionIcon from '@mui/icons-material/Description'
import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

const AssignmentCard = ({
    assignment,
    onStart,
    onView,
    showActions = true,
    compact = false
}) => {
    // Add missing helpers
    const subjectGradients = {
        'Reading': 'bg-gradient-to-br from-blue-400 to-blue-600 shadow-blue-200',
        'Writing': 'bg-gradient-to-br from-pink-400 to-rose-600 shadow-pink-200',
        'Listening': 'bg-gradient-to-br from-yellow-400 to-orange-500 shadow-orange-200',
        'Speaking': 'bg-gradient-to-br from-green-400 to-emerald-600 shadow-emerald-200',
        'Grammar': 'bg-gradient-to-br from-purple-400 to-indigo-600 shadow-purple-200'
    }

    const getGradient = (subj) => subjectGradients[subj] || 'bg-gradient-to-br from-gray-400 to-gray-600'
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

    // Legacy status variants for Badge (kept for compatibility)
    const statusVariants = {
        pending: 'warning',
        'in-progress': 'info',
        completed: 'success'
    }

    // New Agenda-style logic
    const priorityColors = {
        low: 'border-l-[6px] border-green-400',
        medium: 'border-l-[6px] border-orange-400',
        high: 'border-l-[6px] border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.1)]'
    }

    const subjectColors = {
        reading: 'bg-blue-600 text-white shadow-sm',
        writing: 'bg-rose-500 text-white shadow-sm',
        speaking: 'bg-emerald-500 text-white shadow-sm',
        listening: 'bg-amber-500 text-white shadow-sm',
        grammar: 'bg-violet-600 text-white shadow-sm',
        default: 'bg-gray-500 text-white shadow-sm'
    }

    const getSubjectStyle = (subj) => {
        const lowerSubj = subj?.toLowerCase() || ''
        return subjectColors[lowerSubj] || subjectColors.default
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

    const getDayName = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', { weekday: 'short' })
    }
    const getDayNumber = (dateString) => {
        const date = new Date(dateString)
        return date.getDate()
    }

    const formatStatus = (status) => {
        return status.charAt(0).toUpperCase() + status.slice(1)
    }

    if (compact) {
        return (
            <div
                className={`flex items-center justify-between p-4 bg-white border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-all cursor-pointer group ${priority === 'high' ? 'border-l-4 border-l-red-500' : priority === 'medium' ? 'border-l-4 border-l-orange-400' : 'border-l-4 border-l-green-400'}`}
                onClick={() => onView && onView(assignment)}
            >
                <div className="flex items-center gap-4 flex-1">
                    <div className={`w-10 h-10 ${getGradient(subject)} rounded-lg flex items-center justify-center text-lg text-white shadow-sm flex-shrink-0`}>
                        <SubjectIcon subject={subject} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className={`font-bold text-gray-800 truncate text-sm mb-0.5 ${status === 'completed' ? 'line-through text-gray-400' : ''}`}>{title}</h4>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span className="capitalize font-medium text-gray-400">{subject}</span>
                            {dueDateValue && (
                                <>
                                    <span>•</span>
                                    <span className={`${getDueDate(dueDateValue) === 'Overdue' ? 'text-red-500 font-bold' : ''}`}>
                                        {getDueDate(dueDateValue)}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 pl-3">
                    <Badge variant={statusVariants[status]} size="sm" className="hidden sm:inline-flex">
                        {formatStatus(status)}
                    </Badge>
                    {/* Circular Status Button similar to detailed view but smaller */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            if (status !== 'completed' && onStart) onStart(assignment)
                        }}
                        className={cn(
                            "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all shadow-sm",
                            status === 'completed'
                                ? "bg-green-500 border-green-500 text-white"
                                : "bg-white border-gray-200 text-gray-300 group-hover:border-purple-300"
                        )}
                        title={status === 'completed' ? 'Completed' : 'Mark as Done'}
                    >
                        {status === 'completed' ? (
                            <i className="fi fi-rr-check text-xs font-bold" />
                        ) : (
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-200 group-hover:bg-purple-300 transition-colors" />
                        )}
                    </button>
                </div>
            </div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ backgroundColor: "rgba(249, 250, 251, 0.8)", x: 4 }}
            className={cn(
                "group relative flex items-stretch transition-all duration-200 cursor-pointer overflow-hidden bg-white hover:shadow-md border-b border-gray-50 last:border-0",
                status === 'completed' && "bg-gray-50/30"
            )}
            onClick={() => onView && onView(assignment)}
        >
            {/* Left Edge Priority Indicator */}
            <div className={cn(
                "w-1.5 flex-shrink-0",
                priority === 'high' ? "bg-red-500" : priority === 'medium' ? "bg-orange-400" : "bg-green-400"
            )} />

            {/* Date Column */}
            <div className="flex flex-col items-center justify-center w-14 sm:w-16 flex-shrink-0 bg-gray-50/30 border-r border-gray-50 py-3">
                <span className="text-[10px] uppercase font-extrabold text-gray-400 tracking-tighter mb-0.5">
                    {dueDateValue ? getDayName(dueDateValue) : '???'}
                </span>
                <span className="text-xl font-black text-gray-700 leading-none">
                    {dueDateValue ? getDayNumber(dueDateValue) : '--'}
                </span>
            </div>

            {/* Content Column */}
            <div className="flex-1 px-3 sm:px-5 py-3 min-w-0 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-1">
                    <div className={cn(
                        "flex items-center gap-1.5 py-0.5 px-2 rounded text-[10px] font-black uppercase tracking-widest",
                        status === 'completed' ? "bg-gray-200 text-gray-500" : getSubjectStyle(subject)
                    )}>
                        <SubjectIcon subject={subject} className="text-[10px]" />
                        <span>{subject}</span>
                    </div>
                    {/* Status Badge for visibility */}
                    {status === 'completed' && (
                        <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded uppercase">
                            Finished
                        </span>
                    )}
                </div>

                <h3 className={cn(
                    "font-bold text-gray-800 text-sm sm:text-base truncate transition-all mb-1",
                    status === 'completed' && "line-through text-gray-400 italic"
                )}>
                    {title}
                </h3>

                {/* Sub-details (Tasks/Desc) */}
                <div className="flex items-center gap-3 text-xs text-gray-500">
                    {tasks && tasks.length > 0 && (
                        <div className="flex items-center font-medium">
                            <i className="fi fi-rr-list-check mr-1.5 text-gray-400"></i>
                            {status === 'completed' ? 'All tasks done' : `${tasks.length} tasks`}
                        </div>
                    )}
                    {description && (
                        <div className="hidden sm:flex items-center truncate max-w-[200px]">
                            <i className="fi fi-rr-align-left mr-1.5 text-gray-400"></i>
                            <span className="truncate">{description}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Right Action Column */}
            <div className="flex items-center gap-3 px-3 sm:px-4 bg-gray-50/10 border-l border-gray-50">
                {/* View Detail Eye */}
                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        onView ? onView(assignment) : null
                    }}
                    className="p-2 text-gray-300 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-colors"
                    title="View Details"
                >
                    <i className="fi fi-rr-eye text-lg"></i>
                </button>

                {/* Status Checkbox/Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        if (status !== 'completed' && onStart) onStart(assignment)
                    }}
                    className={cn(
                        "w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all shadow-sm",
                        status === 'completed'
                            ? "bg-green-500 border-green-500 text-white transform scale-100"
                            : status === 'in-progress'
                                ? "bg-white border-blue-400 text-blue-500"
                                : "bg-white border-gray-200 text-gray-300 hover:border-purple-300"
                    )}
                    title={status === 'completed' ? 'Completed' : 'Mark as Done'}
                >
                    {status === 'completed' ? (
                        <i className="fi fi-rr-check text-sm font-bold" />
                    ) : status === 'in-progress' ? (
                        <i className="fi fi-rr-play text-xs ml-0.5" />
                    ) : (
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-200 group-hover:bg-purple-300 transition-colors" />
                    )}
                </button>
            </div>
        </motion.div>
    )
}

export default AssignmentCard
