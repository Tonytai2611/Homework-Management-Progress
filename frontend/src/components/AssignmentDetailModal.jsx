import { useState } from 'react'
import Badge from './shared/Badge'

const AssignmentDetailModal = ({ assignment, onClose, onMarkComplete }) => {
    const [completedTasks, setCompletedTasks] = useState(
        assignment.completed_tasks || []
    )

    const handleTaskToggle = (taskId) => {
        setCompletedTasks(prev =>
            prev.includes(taskId)
                ? prev.filter(id => id !== taskId)
                : [...prev, taskId]
        )
    }

    const handleMarkComplete = () => {
        onMarkComplete(assignment.id, completedTasks)
        onClose()
    }

    const tasks = assignment.tasks || []
    const allTasksCompleted = tasks.length > 0 && completedTasks.length === tasks.length



    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
            <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                        <Badge variant={assignment.subject?.toLowerCase()} size="sm">{assignment.subject}</Badge>
                        <h2 className="text-base sm:text-xl font-bold text-gray-900 truncate">{assignment.title}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-2xl ml-2 flex-shrink-0"
                    >
                        ×
                    </button>
                </div>

                {/* Content */}
                <div className="px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
                    {/* Due Date */}
                    <div>
                        <p className="text-xs sm:text-sm text-gray-600">
                            📅 Due: {new Date(assignment.due_date).toLocaleDateString('en-US', {
                                weekday: 'short',
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                            })}
                        </p>
                    </div>

                    {/* Description */}
                    {assignment.description && (
                        <div>
                            <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-2">📝 Description:</h3>
                            <p className="text-sm sm:text-base text-gray-700">{assignment.description}</p>
                        </div>
                    )}

                    {/* Assignment Links */}
                    {assignment.link && (
                        <div>
                            <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-2">🔗 Assignment Links:</h3>
                            <a
                                href={assignment.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline flex items-center space-x-2 text-sm break-all"
                            >
                                <span>🔗</span>
                                <span className="truncate">{assignment.link}</span>
                            </a>
                        </div>
                    )}

                    {/* Tasks to Complete */}
                    {tasks.length > 0 && (
                        <div>
                            <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-3">✅ Tasks to Complete:</h3>
                            <div className="space-y-2">
                                {tasks.map((task, index) => (
                                    <label
                                        key={task.id || index}
                                        className="flex items-start space-x-3 p-2 sm:p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={completedTasks.includes(task.id || index)}
                                            onChange={() => handleTaskToggle(task.id || index)}
                                            className="mt-1 rounded text-purple-600 focus:ring-purple-500"
                                        />
                                        <span className={`flex-1 text-sm sm:text-base ${completedTasks.includes(task.id || index)
                                            ? 'line-through text-gray-400'
                                            : 'text-gray-700'
                                            }`}>
                                            {typeof task === 'string' ? task : task.text}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200">
                    {assignment.status === 'completed' ? (
                        <div className="text-center py-2">
                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 font-bold text-sm">
                                <span className="text-lg">🎉</span> Assignment Completed
                            </span>
                        </div>
                    ) : (
                        <>
                            <div className="mb-3 sm:mb-4">
                                <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-1 sm:mb-2">Mark as Complete</h3>
                                <p className="text-xs sm:text-sm text-gray-600">
                                    {allTasksCompleted
                                        ? 'Great job! All tasks completed. Click below to mark this assignment as complete.'
                                        : 'Have you finished this assignment? Click below to mark it as complete.'}
                                </p>
                            </div>
                            <button
                                onClick={handleMarkComplete}
                                className="w-full bg-teal-500 text-white py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-teal-600 transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base"
                            >
                                <span>✓</span>
                                <span>Mark as Complete</span>
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AssignmentDetailModal
