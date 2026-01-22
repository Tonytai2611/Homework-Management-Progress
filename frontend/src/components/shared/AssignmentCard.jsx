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

    const getDueDateLabel = (dateString) => {
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

    const getDueTime = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
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

    // Agenda logic
    const displayTime = null // Time removed per user request

    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ backgroundColor: "rgba(249, 250, 251, 0.8)", x: 4 }}
            className={cn(
                "group relative flex items-stretch transition-all duration-200 cursor-pointer overflow-hidden",
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
                        "flex items-center gap-1.5 py-1 px-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest",
                        status === 'completed' ? "bg-gray-200 text-gray-500" : getSubjectStyle(subject)
                    )}>
                        <SubjectIcon subject={subject} className="text-[10px]" />
                        <span>{subject}</span>
                    </div>
                    {priority === 'high' && !status === 'completed' && (
                        <span className="text-[9px] font-black text-red-500 bg-red-50 px-1.5 py-0.5 rounded uppercase animate-pulse">
                            Critical
                        </span>
                    )}
                </div>

                <h3 className={cn(
                    "font-bold text-gray-800 text-sm sm:text-base truncate transition-all",
                    status === 'completed' && "line-through text-gray-400 italic"
                )}>
                    {title}
                </h3>

                <div className="flex items-center gap-3 mt-1.5">
                    {tasks.length > 0 && (
                        <div className="flex items-center text-[10px] font-bold text-gray-400">
                            <i className="fi fi-rr-list-check mr-1"></i>
                            {status === 'completed' ? 'Tasks finished' : `${tasks.length} items`}
                        </div>
                    )}
                </div>
            </div>

            {/* Right Action Column */}
            <div className="flex items-center gap-2 px-3 sm:px-4 bg-gray-50/10">
                {/* View Detail Eye (Always there) */}
                {showActions && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            onView ? onView(assignment) : null
                        }}
                        className="p-2 text-gray-300 hover:text-purple-600 transition-colors"
                        title="View Details"
                    >
                        <i className="fi fi-rr-eye text-lg"></i>
                    </button>
                )}

                {/* Status Checkbox-style box */}
                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        if (status !== 'completed' && onStart) onStart(assignment)
                    }}
                    className={cn(
                        "w-7 h-7 sm:w-8 sm:h-8 rounded-lg border-2 flex items-center justify-center transition-all shadow-sm",
                        status === 'completed'
                            ? "bg-green-500 border-green-500 text-white"
                            : status === 'in-progress'
                                ? "bg-blue-50 border-blue-200 text-blue-500"
                                : "bg-white border-gray-200 text-gray-200 group-hover:border-purple-300"
                    )}
                >
                    {status === 'completed' ? (
                        <i className="fi fi-rr-check text-xs font-bold" />
                    ) : status === 'in-progress' ? (
                        <i className="fi fi-rr-play text-[10px] ml-0.5" />
                    ) : (
                        <div className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-purple-200 transition-colors" />
                    )}
                </button>
            </div>
        </motion.div>
    )
}

export default AssignmentCard

