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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <Badge variant={assignment.subject?.toLowerCase()}>{assignment.subject}</Badge>
                        <h2 className="text-xl font-bold text-gray-900">{assignment.title}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-2xl"
                    >
                        ×
                    </button>
                </div>

                {/* Content */}
                <div className="px-6 py-6 space-y-6">
                    {/* Due Date */}
                    <div>
                        <p className="text-sm text-gray-600">
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
                            <h3 className="text-sm font-semibold text-gray-900 mb-2">📝 Description:</h3>
                            <p className="text-gray-700">{assignment.description}</p>
                        </div>
                    )}

                    {/* Assignment Links */}
                    {assignment.link && (
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 mb-2">🔗 Assignment Links:</h3>
                            <a
                                href={assignment.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline flex items-center space-x-2"
                            >
                                <span>🔗</span>
                                <span>{assignment.link}</span>
                            </a>
                        </div>
                    )}

                    {/* Tasks to Complete */}
                    {tasks.length > 0 && (
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 mb-3">✅ Tasks to Complete:</h3>
                            <div className="space-y-2">
                                {tasks.map((task, index) => (
                                    <label
                                        key={task.id || index}
                                        className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={completedTasks.includes(task.id || index)}
                                            onChange={() => handleTaskToggle(task.id || index)}
                                            className="mt-1 rounded text-purple-600 focus:ring-purple-500"
                                        />
                                        <span className={`flex-1 ${completedTasks.includes(task.id || index)
                                            ? 'line-through text-gray-400'
                                            : 'text-gray-700'
                                            }`}>
                                            {task.text}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200">
                    <div className="mb-4">
                        <h3 className="text-sm font-semibold text-gray-900 mb-2">Mark as Complete</h3>
                        <p className="text-sm text-gray-600">
                            {allTasksCompleted
                                ? 'Great job! All tasks completed. Click below to mark this assignment as complete.'
                                : 'Have you finished this assignment? Click below to mark it as complete.'}
                        </p>
                    </div>
                    <button
                        onClick={handleMarkComplete}
                        className="w-full bg-teal-500 text-white py-3 rounded-lg font-semibold hover:bg-teal-600 transition-colors flex items-center justify-center space-x-2"
                    >
                        <span>✓</span>
                        <span>Mark as Complete</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AssignmentDetailModal
