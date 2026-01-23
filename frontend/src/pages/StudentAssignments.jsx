import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import AssignmentCard from '../components/shared/AssignmentCard'
import Badge from '../components/shared/Badge'
import Header from '../components/Header'
import AssignmentDetailModal from '../components/AssignmentDetailModal'
import { assignmentsAPI } from '../api/assignments'
import { IoCheckmarkCircle } from 'react-icons/io5'
import { GrInProgress } from 'react-icons/gr'
import { MdOutlinePendingActions } from 'react-icons/md'

const StudentAssignments = () => {
    const { user } = useAuth()
    const { showToast } = useToast()
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

        }
    }

    const stats = {
        total: assignments.length,
        pending: assignments.filter(a => a.status === 'pending').length,
        inProgress: assignments.filter(a => a.status === 'in-progress').length,
        completed: assignments.filter(a => a.status === 'completed').length
    }

    const filteredAssignments = assignments
        .filter(assignment => {
            const matchesFilter = filter === 'all' || assignment.status === filter
            const matchesSubject = selectedSubject === 'all' || assignment.subject === selectedSubject
            return matchesFilter && matchesSubject
        })
        .sort((a, b) => {
            const statusPriority = { 'pending': 0, 'in-progress': 1, 'completed': 2 }
            const priorityA = statusPriority[a.status] ?? 3
            const priorityB = statusPriority[b.status] ?? 3

            if (priorityA !== priorityB) return priorityA - priorityB
            return new Date(a.due_date || a.dueDate) - new Date(b.due_date || b.dueDate)
        });

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-teal-50 pb-24 md:pb-8">
            <Header />

            {/* Page Title */}
            <div className="bg-white shadow-sm mb-4 sm:mb-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Assignments</h1>
                    <p className="text-gray-600 mt-1 text-sm sm:text-base">Track and complete your homework</p>
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
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4">
                        <p className="text-xs sm:text-sm text-gray-600">Total</p>
                        <p className="text-xl sm:text-2xl font-bold text-purple-600">{stats.total}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4">
                        <p className="text-xs sm:text-sm text-gray-600">Pending</p>
                        <p className="text-xl sm:text-2xl font-bold text-orange-600">{stats.pending}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4">
                        <p className="text-xs sm:text-sm text-gray-600">Completed</p>
                        <p className="text-xl sm:text-2xl font-bold text-green-600">{stats.completed}</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 mb-4 sm:mb-6">
                    <div className="flex flex-col space-y-3 sm:space-y-4">
                        {/* Status Filter */}
                        <div>
                            <span className="text-xs sm:text-sm font-medium text-gray-700 mb-2 block">Status:</span>
                            <div className="flex flex-wrap gap-2">
                                {['all', 'pending', 'completed'].map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => setFilter(status)}
                                        className={`px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center gap-1 ${filter === status
                                            ? 'bg-purple-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        {status === 'pending' && (
                                            <MdOutlinePendingActions className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${filter === status ? 'text-white' : 'text-orange-600'}`} />
                                        )}
                                        {status === 'completed' && (
                                            <IoCheckmarkCircle className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${filter === status ? 'text-white' : 'text-green-600'}`} />
                                        )}
                                        <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Subject Filter */}
                        <div>
                            <span className="text-xs sm:text-sm font-medium text-gray-700 mb-2 block">Subject:</span>
                            <select
                                value={selectedSubject}
                                onChange={(e) => setSelectedSubject(e.target.value)}
                                className="w-full sm:w-auto px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                    <div className="space-y-3 sm:space-y-4">
                        {filteredAssignments.length === 0 ? (
                            <div className="bg-white rounded-xl shadow-lg text-center py-8 sm:py-12">
                                <span className="text-4xl sm:text-6xl mb-4 block">📭</span>
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No assignments found</h3>
                                <p className="text-sm sm:text-base text-gray-600">Try changing your filters</p>
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
