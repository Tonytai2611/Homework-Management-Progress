import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import AssignmentCard from '../components/shared/AssignmentCard'
import Badge from '../components/shared/Badge'
import Header from '../components/Header'
import AssignmentDetailModal from '../components/AssignmentDetailModal'
import { assignmentsAPI } from '../api/assignments'

const StudentAssignments = () => {
    const { user } = useAuth()
    const [filter, setFilter] = useState('all')
    const [selectedSubject, setSelectedSubject] = useState('all')
    const [assignments, setAssignments] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [selectedAssignment, setSelectedAssignment] = useState(null)

    const subjects = ['all', 'Reading', 'Writing', 'Listening', 'Speaking', 'Grammar']

    // Fetch assignments
    useEffect(() => {
        fetchAssignments()
    }, [filter, selectedSubject])

    const fetchAssignments = async () => {
        try {
            setLoading(true)
            setError('')

            const filters = {}
            if (filter !== 'all') filters.status = filter
            if (selectedSubject !== 'all') filters.subject = selectedSubject

            const response = await assignmentsAPI.getAll(filters)
            setAssignments(response.data || [])
        } catch (err) {
            console.error('Failed to load assignments:', err)
            setError('Failed to load assignments. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleStartAssignment = async (assignment) => {
        setSelectedAssignment(assignment)
    }

    const handleViewAssignment = (assignment) => {
        setSelectedAssignment(assignment)
    }

    const handleMarkComplete = async (assignmentId, completedTasks) => {
        try {
            await assignmentsAPI.updateStatus(assignmentId, 'completed', JSON.stringify(completedTasks))
            fetchAssignments() // Refresh list
            setSelectedAssignment(null)
        } catch (err) {
            console.error('Failed to mark complete:', err)
            alert('Failed to mark assignment as complete')
        }
    }

    const stats = {
        total: assignments.length,
        pending: assignments.filter(a => a.status === 'pending').length,
        inProgress: assignments.filter(a => a.status === 'in-progress').length,
        completed: assignments.filter(a => a.status === 'completed').length
    }

    const filteredAssignments = assignments.filter(assignment => {
        const matchesFilter = filter === 'all' || assignment.status === filter
        const matchesSubject = selectedSubject === 'all' || assignment.subject === selectedSubject
        return matchesFilter && matchesSubject
    })

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-teal-50 pb-8">
            <Header />

            {/* Page Title */}
            <div className="bg-white shadow-sm mb-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <h1 className="text-3xl font-bold text-gray-900">My Assignments</h1>
                    <p className="text-gray-600 mt-1">Track and complete your homework</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Error Message */}
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="card bg-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total</p>
                                <p className="text-2xl font-bold text-purple-600">{stats.total}</p>
                            </div>
                            <span className="text-3xl">📚</span>
                        </div>
                    </div>
                    <div className="card bg-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Pending</p>
                                <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
                            </div>
                            <span className="text-3xl">⏳</span>
                        </div>
                    </div>
                    <div className="card bg-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">In Progress</p>
                                <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
                            </div>
                            <span className="text-3xl">📝</span>
                        </div>
                    </div>
                    <div className="card bg-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Completed</p>
                                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                            </div>
                            <span className="text-3xl">✅</span>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="card bg-white mb-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                        {/* Status Filter */}
                        <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-700">Status:</span>
                            <div className="flex space-x-2">
                                {['all', 'pending', 'in-progress', 'completed'].map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => setFilter(status)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === status
                                            ? 'bg-purple-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        {status === 'in-progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Subject Filter */}
                        <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-700">Subject:</span>
                            <select
                                value={selectedSubject}
                                onChange={(e) => setSelectedSubject(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            >
                                {subjects.map((subject) => (
                                    <option key={subject} value={subject}>
                                        {subject.charAt(0).toUpperCase() + subject.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                        <p className="mt-4 text-gray-600">Loading assignments...</p>
                    </div>
                )}

                {/* Assignments List */}
                {!loading && (
                    <div className="space-y-4">
                        {filteredAssignments.length === 0 ? (
                            <div className="card bg-white text-center py-12">
                                <span className="text-6xl mb-4 block">📭</span>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">No assignments found</h3>
                                <p className="text-gray-600">Try changing your filters</p>
                            </div>
                        ) : (
                            filteredAssignments.map((assignment) => (
                                <AssignmentCard
                                    key={assignment.id}
                                    assignment={assignment}
                                    onStart={handleStartAssignment}
                                    onView={handleViewAssignment}
                                />
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* Assignment Detail Modal */}
            {selectedAssignment && (
                <AssignmentDetailModal
                    assignment={selectedAssignment}
                    onClose={() => setSelectedAssignment(null)}
                    onMarkComplete={handleMarkComplete}
                />
            )}
        </div>
    )
}

export default StudentAssignments
