import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import { useNavigate, Link } from 'react-router-dom'
import { assignmentsAPI, studentsAPI } from '../api/assignments'
import Badge from '../components/shared/Badge'
import EditAssignmentModal from '../components/EditAssignmentModal'
import ConfirmDialog from '../components/ConfirmDialog'
import AssignmentDetailModal from '../components/AssignmentDetailModal'

const ManageAssignments = () => {
    const { user, signout } = useAuth()
    const { showToast } = useToast()
    const navigate = useNavigate()

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        subject: '',
        description: '',
        link: '',
        dueDate: '',
        priority: 'medium',
        studentIds: [],
        tasks: [] // Array of {id, text}
    })

    const [newTask, setNewTask] = useState('')

    // Lists
    const [students, setStudents] = useState([])
    const [assignments, setAssignments] = useState([])
    const [filteredAssignments, setFilteredAssignments] = useState([])

    // UI state
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [selectedStudentFilter, setSelectedStudentFilter] = useState('all')
    const [editingAssignment, setEditingAssignment] = useState(null)
    const [deletingAssignment, setDeletingAssignment] = useState(null)
    const [viewingAssignment, setViewingAssignment] = useState(null)

    const subjects = ['Reading', 'Writing', 'Listening', 'Speaking', 'Grammar']
    const priorities = ['low', 'medium', 'high']

    useEffect(() => {
        fetchStudents()
        fetchAssignments()
    }, [])

    useEffect(() => {
        if (selectedStudentFilter === 'all') {
            setFilteredAssignments(assignments)
        } else {
            // Filter assignments by student
            const filtered = assignments.filter(a =>
                a.student_assignments?.some(sa => sa.student_id === selectedStudentFilter)
            )
            setFilteredAssignments(filtered)
        }
    }, [selectedStudentFilter, assignments])

    const fetchStudents = async () => {
        try {
            const response = await studentsAPI.getAll()
            setStudents(response.data || [])
        } catch (err) {
            console.error('Failed to fetch students:', err)
        }
    }

    const fetchAssignments = async () => {
        try {
            const response = await assignmentsAPI.getAll()
            setAssignments(response.data || [])
            setFilteredAssignments(response.data || [])
        } catch (err) {
            console.error('Failed to fetch assignments:', err)
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleStudentSelect = (studentId) => {
        setFormData(prev => ({
            ...prev,
            studentIds: prev.studentIds.includes(studentId)
                ? prev.studentIds.filter(id => id !== studentId)
                : [...prev.studentIds, studentId]
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setSuccess('')

        try {
            await assignmentsAPI.create({
                ...formData,
                dueDate: new Date(formData.dueDate).toISOString()
            })

            showToast('Assignment created successfully!', 'success')

            // Reset form
            setFormData({
                title: '',
                subject: '',
                description: '',
                link: '',
                dueDate: '',
                priority: 'medium',
                studentIds: [],
                tasks: []
            })
            setNewTask('')

            // Refresh assignments list
            fetchAssignments()
        } catch (err) {
            console.error('Create assignment error:', err)
            showToast(err.response?.data?.message || 'Failed to create assignment', 'error')
        } finally {
            setLoading(false)
        }
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

    const handleClear = () => {
        setFormData({
            title: '',
            subject: '',
            description: '',
            link: '',
            dueDate: '',
            priority: 'medium',
            studentIds: [],
            tasks: []
        })
        setNewTask('')
        setError('')
        setSuccess('')
    }

    const handleSignOut = () => {
        signout()
        navigate('/signin')
    }

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'text-red-600'
            case 'medium': return 'text-yellow-600'
            case 'low': return 'text-green-600'
            default: return 'text-gray-600'
        }
    }

    const getSubjectIcon = (subject) => {
        const icons = {
            'Reading': '📖',
            'Writing': '✍️',
            'Listening': '👂',
            'Speaking': '🗣️',
            'Grammar': '📝'
        }
        return icons[subject] || '📚'
    }

    const handleDeleteAssignment = async () => {
        if (!deletingAssignment) return

        try {
            await assignmentsAPI.delete(deletingAssignment.id)
            showToast('Assignment deleted successfully!', 'success')
            fetchAssignments()
            setDeletingAssignment(null)
        } catch (err) {
            console.error('Delete assignment error:', err)
            showToast('Failed to delete assignment', 'error')
            setDeletingAssignment(null)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-teal-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-8">
                            <Link to="/admin/dashboard" className="flex items-center">
                                <div className="w-10 h-10 bg-gradient-purple-teal rounded-lg flex items-center justify-center mr-3">
                                    <span className="text-xl font-bold text-white">LB</span>
                                </div>
                                <h1 className="text-2xl font-bold text-gray-900">Little Buddies</h1>
                            </Link>

                            <nav className="hidden md:flex space-x-2">
                                <Link
                                    to="/admin/dashboard"
                                    className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors flex items-center space-x-2"
                                >
                                    <span>📊</span>
                                    <span>Dashboard</span>
                                </Link>
                                <Link
                                    to="/admin/manage-assignments"
                                    className="px-4 py-2 rounded-lg text-sm font-medium bg-purple-100 text-purple-700 flex items-center space-x-2"
                                >
                                    <span>📚</span>
                                    <span>Manage Assignments</span>
                                </Link>
                            </nav>
                        </div>

                        <button
                            onClick={handleSignOut}
                            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Success/Error Messages */}
                {success && (
                    <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                        {success}
                    </div>
                )}
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}

                {/* Add New Assignment Form */}
                <div className="card bg-white mb-8">
                    <div className="flex items-center space-x-2 mb-6">
                        <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                            +
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">Add New Assignment</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Student Select */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Student
                                </label>
                                <select
                                    value={formData.studentIds[0] || ''}
                                    onChange={(e) => {
                                        setFormData(prev => ({
                                            ...prev,
                                            studentIds: e.target.value ? [e.target.value] : []
                                        }))
                                    }}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    required
                                >
                                    <option value="">Select student...</option>
                                    {students.map(student => (
                                        <option key={student.id} value={student.id}>
                                            {student.full_name} ({student.level})
                                        </option>
                                    ))}
                                </select>
                            </div>

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
                                    <option value="">Select subject...</option>
                                    {subjects.map(subject => (
                                        <option key={subject} value={subject}>{subject}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Assignment Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Assignment Title
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder='e.g., Story: "The Magic Computer"'
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
                                placeholder="Describe what the student needs to do..."
                                rows="3"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>

                        {/* Links */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Links (optional)
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

                        {/* Tasks to Complete */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tasks to Complete (optional)
                            </label>
                            <div className="space-y-2">
                                {formData.tasks.map((task) => (
                                    <div key={task.id} className="flex items-center space-x-2">
                                        <span className="flex-1 px-3 py-2 bg-gray-50 rounded-lg text-sm">
                                            {task.text}
                                        </span>
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
                                        placeholder="e.g., Read pages 12-18 in your Flyers book"
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddTask}
                                        className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors font-medium"
                                    >
                                        + Add Task
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex space-x-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-teal-500 text-white py-3 rounded-lg font-semibold hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Creating...' : 'Add Assignment'}
                            </button>
                            <button
                                type="button"
                                onClick={handleClear}
                                className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Clear
                            </button>
                        </div>
                    </form>
                </div>

                {/* All Assignments List */}
                <div className="card bg-white">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-2">
                            <span className="text-2xl">📋</span>
                            <h2 className="text-xl font-bold text-gray-900">All Assignments</h2>
                        </div>

                        <select
                            value={selectedStudentFilter}
                            onChange={(e) => setSelectedStudentFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                            <option value="all">All Students</option>
                            {students.map(student => (
                                <option key={student.id} value={student.id}>
                                    {student.full_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-4">
                        {filteredAssignments.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                <span className="text-6xl block mb-4">📭</span>
                                <p>No assignments found</p>
                            </div>
                        ) : (
                            filteredAssignments.map(assignment => (
                                <div key={assignment.id} className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <span className="text-2xl">{getSubjectIcon(assignment.subject)}</span>
                                                <div>
                                                    <Badge variant={assignment.subject.toLowerCase()}>{assignment.subject}</Badge>
                                                    <h3 className="font-semibold text-gray-900 mt-1">{assignment.title}</h3>
                                                </div>
                                            </div>

                                            {assignment.description && (
                                                <p className="text-sm text-gray-600 mb-2">{assignment.description}</p>
                                            )}

                                            {assignment.link && (
                                                <a
                                                    href={assignment.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm text-blue-600 hover:underline flex items-center space-x-1"
                                                >
                                                    <span>🔗</span>
                                                    <span>{assignment.link}</span>
                                                </a>
                                            )}

                                            <div className="flex items-center space-x-4 mt-3 text-sm text-gray-600">
                                                <span>📅 Due: {new Date(assignment.due_date).toLocaleDateString()}</span>
                                                <span className={getPriorityColor(assignment.priority)}>
                                                    ● {assignment.priority.charAt(0).toUpperCase() + assignment.priority.slice(1)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col space-y-2">
                                            <button
                                                onClick={() => setViewingAssignment(assignment)}
                                                className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="View Details"
                                            >
                                                👁️ View
                                            </button>
                                            <button
                                                onClick={() => setEditingAssignment(assignment)}
                                                className="px-3 py-1.5 text-sm text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                ✏️ Edit
                                            </button>
                                            <button
                                                onClick={() => setDeletingAssignment(assignment)}
                                                className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                🗑️ Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Edit Assignment Modal */}
            {editingAssignment && (
                <EditAssignmentModal
                    assignment={editingAssignment}
                    onClose={() => setEditingAssignment(null)}
                    onUpdate={() => {
                        fetchAssignments()
                        setEditingAssignment(null)
                        setSuccess('Assignment updated successfully!')
                        setTimeout(() => setSuccess(''), 3000)
                    }}
                />
            )}

            {/* Delete Confirmation Dialog */}
            {deletingAssignment && (
                <ConfirmDialog
                    title="Delete Assignment"
                    message={`Are you sure you want to delete "${deletingAssignment.title}"? This action cannot be undone.`}
                    onConfirm={handleDeleteAssignment}
                    onCancel={() => setDeletingAssignment(null)}
                />
            )}

            {/* View Assignment Detail Modal (Admin View) */}
            {viewingAssignment && (
                <AssignmentDetailModal
                    assignment={viewingAssignment}
                    onClose={() => setViewingAssignment(null)}
                    onMarkComplete={() => { }} // Admin doesn't mark complete
                />
            )}
        </div>
    )
}

export default ManageAssignments
