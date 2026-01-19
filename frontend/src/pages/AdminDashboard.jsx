import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import { useNavigate, Link } from 'react-router-dom'
import { studentsAPI, assignmentsAPI } from '../api/assignments'
import ProgressBar from '../components/shared/ProgressBar'
import Badge from '../components/shared/Badge'

const AdminDashboard = () => {
    const { user, signout } = useAuth()
    const { showToast } = useToast()
    const navigate = useNavigate()
    const [students, setStudents] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedStudent, setSelectedStudent] = useState(null)

    useEffect(() => {
        fetchStudents()
    }, [])

    const fetchStudents = async () => {
        try {
            setLoading(true)
            const response = await studentsAPI.getAll()
            // Fetch details for each student
            const studentsWithDetails = await Promise.all(
                (response.data || []).map(async (student) => {
                    try {
                        const detailsResponse = await studentsAPI.getById(student.id)
                        return detailsResponse.data
                    } catch (err) {
                        console.error(`Failed to fetch details for student ${student.id}:`, err)
                        return student
                    }
                })
            )
            setStudents(studentsWithDetails)
        } catch (err) {
            console.error('Failed to fetch students:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleSignOut = () => {
        signout()
        navigate('/signin')
    }

    const formatPercentage = (value) => {
        // Convert to number first
        const numValue = Number(value)

        // Handle null, undefined, NaN, or non-numeric values
        if (value === null || value === undefined || isNaN(numValue)) {
            return '0'
        }
        return Math.round(numValue)
    }

    const getSubjectColor = (subject) => {
        const colors = {
            'Reading': 'blue',
            'Writing': 'green',
            'Listening': 'purple',
            'Speaking': 'orange',
            'Grammar': 'teal'
        }
        return colors[subject] || 'purple'
    }

    const handleUpdateStatus = async (studentAssignmentId, status) => {
        if (!studentAssignmentId) return

        try {
            await assignmentsAPI.adminUpdateStatus(studentAssignmentId, status, 'Marked by teacher')

            showToast('Assignment status updated successfully!', 'success')

            // Update local state
            const updatedStudent = { ...selectedStudent }
            const assignmentIndex = updatedStudent.recentAssignments.findIndex(a => a.studentAssignmentId === studentAssignmentId)

            if (assignmentIndex >= 0) {
                updatedStudent.recentAssignments[assignmentIndex].status = status
                // Recalculate stats simplified (or just re-fetch, but optimistic update is faster)
                // For simplicity, just update status display. Real implementation should update counts too.
                // Let's re-fetch details for this student to be safe
                const detailsResponse = await studentsAPI.getById(selectedStudent.student.id)
                setSelectedStudent(detailsResponse.data)

                // Also update main list
                setStudents(prev => prev.map(s =>
                    s.student.id === selectedStudent.student.id ? detailsResponse.data : s
                ))
            }
        } catch (err) {
            console.error('Failed to update status:', err)
            showToast('Failed to update status', 'error')
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

                            {/* Navigation Tabs */}
                            <nav className="hidden md:flex space-x-2">
                                <Link
                                    to="/admin/dashboard"
                                    className="px-4 py-2 rounded-lg text-sm font-medium bg-purple-100 text-purple-700 flex items-center space-x-2"
                                >
                                    <span>📊</span>
                                    <span>Dashboard</span>
                                </Link>
                                <Link
                                    to="/admin/manage-assignments"
                                    className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors flex items-center space-x-2"
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

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Banner */}
                <div className="bg-gradient-purple-teal rounded-2xl shadow-xl p-8 mb-8 text-white">
                    <div className="flex items-center">
                        <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-3xl mr-4">
                            👨‍🏫
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold mb-1">Admin Dashboard</h2>
                            <p className="text-purple-100">System Overview & Student Management</p>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="card">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                                <span className="text-2xl">👥</span>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Total Students</p>
                                <p className="text-2xl font-bold text-gray-900">{students.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                                <span className="text-2xl">✅</span>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Completed</p>
                                <p className="text-2xl font-bold text-green-600">
                                    {students.reduce((sum, s) => sum + (s.stats?.completed || 0), 0)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                                <span className="text-2xl">⏳</span>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Pending</p>
                                <p className="text-2xl font-bold text-orange-600">
                                    {students.reduce((sum, s) => sum + (s.stats?.pending || 0), 0)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                                <span className="text-2xl">📚</span>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Total Assignments</p>
                                <p className="text-2xl font-bold text-purple-600">
                                    {students.reduce((sum, s) => sum + (s.stats?.total || 0), 0)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Student Performance Reports */}
                <div className="mb-6">
                    <div className="flex items-center space-x-2 mb-4">
                        <span className="text-2xl">👥</span>
                        <h3 className="text-2xl font-bold text-gray-900">Student Performance Reports</h3>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                        <p className="mt-4 text-gray-600">Loading students...</p>
                    </div>
                ) : students.length === 0 ? (
                    <div className="text-center py-12">
                        <span className="text-6xl block mb-4">👥</span>
                        <p className="text-gray-600">No students found</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {students.map((student) => (
                            <div key={student.student?.id} className="card bg-white">
                                {/* Student Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-16 h-16 bg-gradient-purple-teal rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                            {student.student?.fullName?.charAt(0) || 'S'}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900">{student.student?.fullName}</h3>
                                            <Badge variant="reading">{student.student?.level || 'FLYERS'} Level</Badge>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <div className="text-center">
                                            <p className="text-sm text-gray-600">🔥 {student.stats?.weeklyStreak || 0} week streak</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm text-gray-600">⭐ 0 pts</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* Left: Stats */}
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="text-center p-3 bg-green-50 rounded-lg">
                                            <p className="text-2xl font-bold text-green-600">{student.stats?.completed || 0}</p>
                                            <p className="text-xs text-gray-600">Completed</p>
                                        </div>
                                        <div className="text-center p-3 bg-orange-50 rounded-lg">
                                            <p className="text-2xl font-bold text-orange-600">{student.stats?.pending || 0}</p>
                                            <p className="text-xs text-gray-600">Pending</p>
                                        </div>
                                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                                            <p className="text-2xl font-bold text-purple-600">
                                                {formatPercentage(student.stats?.completionRate)}%
                                            </p>
                                            <p className="text-xs text-gray-600">Completion Rate</p>
                                        </div>
                                    </div>

                                    {/* Middle: Subject Progress */}
                                    <div className="space-y-2">
                                        {student.bySubject?.map((subject) => (
                                            <div key={subject.name}>
                                                <div className="flex justify-between text-xs mb-1">
                                                    <span className="font-medium text-gray-700">{subject.name}</span>
                                                    <span className="text-gray-600">{formatPercentage(subject.progress)}%</span>
                                                </div>
                                                <ProgressBar progress={subject.progress || 0} color={getSubjectColor(subject.name)} height="h-2" />
                                            </div>
                                        ))}
                                    </div>

                                    {/* Right: Recent Assignments */}
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Recent Assignments:</h4>
                                        <div className="space-y-2">
                                            {student.recentAssignments?.slice(0, 3).map((assignment) => (
                                                <div key={assignment.id} className="flex items-center space-x-2 text-sm">
                                                    <span className="text-lg">
                                                        {assignment.subject === 'Reading' ? '📖' :
                                                            assignment.subject === 'Writing' ? '✏️' :
                                                                assignment.subject === 'Listening' ? '🎧' : '📝'}
                                                    </span>
                                                    <span className="flex-1 text-gray-700 truncate">{assignment.title}</span>
                                                    <span className={`w-2 h-2 rounded-full ${assignment.status === 'completed' ? 'bg-green-500' :
                                                        assignment.status === 'in-progress' ? 'bg-blue-500' : 'bg-gray-300'
                                                        }`}></span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* View Details Button */}
                                <button
                                    onClick={() => setSelectedStudent(student)}
                                    className="w-full mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
                                >
                                    View Details →
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Student Detail Modal */}
            {selectedStudent && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                            <h2 className="text-xl font-bold text-gray-900">
                                {selectedStudent.student?.fullName} - Detailed Performance
                            </h2>
                            <button
                                onClick={() => setSelectedStudent(null)}
                                className="text-gray-400 hover:text-gray-600 text-2xl"
                            >
                                ×
                            </button>
                        </div>

                        <div className="px-6 py-6 space-y-6">
                            {/* Full stats */}
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                <div className="card bg-gradient-purple-teal text-white">
                                    <p className="text-sm opacity-90">Total Tasks</p>
                                    <p className="text-3xl font-bold">{selectedStudent.stats?.total || 0}</p>
                                </div>
                                <div className="card bg-orange-50">
                                    <p className="text-sm text-gray-600">Streak</p>
                                    <div className="flex items-baseline">
                                        <p className="text-3xl font-bold text-orange-600">{selectedStudent.stats?.weeklyStreak || 0}</p>
                                        <span className="ml-1 text-sm text-orange-600">weeks 🔥</span>
                                    </div>
                                </div>
                                <div className="card bg-green-50">
                                    <p className="text-sm text-gray-600">Completed</p>
                                    <p className="text-3xl font-bold text-green-600">{selectedStudent.stats?.completed || 0}</p>
                                </div>
                                <div className="card bg-blue-50">
                                    <p className="text-sm text-gray-600">Pending</p>
                                    <p className="text-3xl font-bold text-blue-600">{selectedStudent.stats?.pending || 0}</p>
                                </div>
                                <div className="card bg-purple-50">
                                    <p className="text-sm text-gray-600">Completion</p>
                                    <p className="text-3xl font-bold text-purple-600">
                                        {formatPercentage(selectedStudent.stats?.completionRate)}%
                                    </p>
                                </div>
                            </div>

                            {/* All assignments */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-4">All Assignments ({selectedStudent.recentAssignments?.length || 0})</h3>
                                <div className="space-y-3">
                                    {selectedStudent.recentAssignments?.map((assignment) => (
                                        <div key={assignment.id} className="border border-gray-200 rounded-lg p-4 hover:border-purple-200 transition-colors">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">{assignment.title}</h4>
                                                    <p className="text-sm text-gray-600">{assignment.subject}</p>
                                                </div>
                                                <div className="flex items-center space-x-3">
                                                    <Badge variant={assignment.status === 'completed' ? 'completed' : 'pending'}>
                                                        {assignment.status}
                                                    </Badge>
                                                    {assignment.status !== 'completed' && (
                                                        <button
                                                            onClick={() => handleUpdateStatus(assignment.studentAssignmentId, 'completed')}
                                                            className="p-1 rounded-full text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors"
                                                            title="Mark as Completed"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminDashboard
