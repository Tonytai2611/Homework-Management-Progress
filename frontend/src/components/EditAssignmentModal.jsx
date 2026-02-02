import { useState, useEffect } from 'react'
import { assignmentsAPI, studentsAPI } from '../api/assignments'

const EditAssignmentModal = ({ assignment, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({
        title: assignment.title || '',
        subject: assignment.subject || '',
        description: assignment.description || '',
        link: assignment.link || '',
        dueDate: assignment.due_date ? assignment.due_date.split('T')[0] : '',
        priority: assignment.priority || 'medium',
        tasks: (assignment.tasks || []).map((t, i) => ({
            ...t,
            id: t.id || Date.now() + i
        }))
    })

    const [newTask, setNewTask] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const subjects = ['Reading', 'Writing', 'Listening', 'Speaking', 'Grammar & Vocabulary']
    const priorities = ['low', 'medium', 'high']

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleAddTask = () => {
        if (newTask.trim()) {
            setFormData(prev => ({
                ...prev,
                tasks: [...prev.tasks, { id: Date.now(), text: newTask.trim() }]
            }))
            setNewTask('')
        }
    }

    const handleRemoveTask = (taskId) => {
        setFormData(prev => ({
            ...prev,
            tasks: prev.tasks.filter(t => t.id !== taskId)
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            await assignmentsAPI.update(assignment.id, {
                ...formData,
                dueDate: new Date(formData.dueDate).toISOString()
            })

            onUpdate()
            onClose()
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update assignment')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">Edit Assignment</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-2xl"
                    >
                        ×
                    </button>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    {/* Subject */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Subject
                        </label>
                        <select
                            name="subject"
                            value={formData.subject}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                            {subjects.map(subject => (
                                <option key={subject} value={subject}>{subject}</option>
                            ))}
                        </select>
                    </div>

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Assignment Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Due Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Due Date
                            </label>
                            <input
                                type="date"
                                name="dueDate"
                                value={formData.dueDate}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>

                        {/* Priority */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Priority
                            </label>
                            <select
                                name="priority"
                                value={formData.priority}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            >
                                {priorities.map(priority => (
                                    <option key={priority} value={priority}>
                                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows="3"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                    </div>

                    {/* Link */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Link (optional)
                        </label>
                        <input
                            type="url"
                            name="link"
                            value={formData.link}
                            onChange={handleInputChange}
                            placeholder="https://example.com/resource"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                    </div>

                    {/* Tasks */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tasks to Complete (optional)
                        </label>
                        <div className="space-y-2">
                            {formData.tasks.map((task) => (
                                <div key={task.id} className="flex items-center space-x-2">
                                    <input
                                        type="text"
                                        value={task.text}
                                        onChange={(e) => {
                                            const newText = e.target.value
                                            setFormData(prev => ({
                                                ...prev,
                                                tasks: prev.tasks.map(t =>
                                                    t.id === task.id ? { ...t, text: newText } : t
                                                )
                                            }))
                                        }}
                                        className="flex-1 px-3 py-2 bg-gray-50 rounded-lg text-sm border border-transparent focus:bg-white focus:border-purple-300 focus:outline-none transition-colors"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveTask(task.id)}
                                        className="text-red-600 hover:text-red-800 px-2"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    value={newTask}
                                    onChange={(e) => setNewTask(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTask())}
                                    placeholder="Add a new task..."
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddTask}
                                    className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors font-medium"
                                >
                                    + Add
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex space-x-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Updating...' : 'Update Assignment'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditAssignmentModal
