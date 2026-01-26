import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import { useNavigate, Link } from 'react-router-dom'
import { studentsAPI, assignmentsAPI } from '../api/assignments'
import ProgressBar from '../components/shared/ProgressBar'
import Badge from '../components/shared/Badge'
import { SubjectIcon } from '../utils/subjectIcons'
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment'
import logo from '../images/littlebuddies.png'

const AdminDashboard = () => {
    const { user, signout } = useAuth()
    const { showToast } = useToast()
    const navigate = useNavigate()
    const [students, setStudents] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedStudent, setSelectedStudent] = useState(null)
    const [editingPoints, setEditingPoints] = useState({ studentId: null, points: 0 })





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
                        return student
                    }
                })
            )
            setStudents(studentsWithDetails)
        } catch (err) {

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
            await studentsAPI.adminUpdateStatus(studentAssignmentId, status, 'Marked by teacher')

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
            showToast('Failed to update status', 'error')
        }
    }

    const handleEditPoints = (student) => {
        setEditingPoints({
            studentId: student.id,
            points: student.points || 0
        })
    }

    const handleSavePoints = async () => {
        if (!editingPoints.studentId) return

        try {
            await studentsAPI.updatePoints(editingPoints.studentId, Number(editingPoints.points))
            showToast('Points updated successfully!', 'success')

            // Update local state
            setStudents(prev => prev.map(s => {
                if (s.student.id === editingPoints.studentId) {
                    return {
                        ...s,
                        student: {
                            ...s.student,
                            points: Number(editingPoints.points)
                        }
                    }
                }
                return s
            }))

            setEditingPoints({ studentId: null, points: 0 })
        } catch (err) {
            showToast('Failed to update points', 'error')
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
                                <img src={logo} alt="Little Buddies" className="w-10 h-10 object-contain mr-3" />
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
                                            {editingPoints.studentId === student.student.id ? (
                                                <div className="flex items-center space-x-1">
                                                    <input
                                                        type="number"
                                                        value={editingPoints.points}
                                                        onChange={(e) => setEditingPoints(prev => ({ ...prev, points: e.target.value }))}
                                                        className="w-16 px-2 py-1 text-sm border border-purple-300 rounded focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                                        autoFocus
                                                    />
                                                    <button
                                                        onClick={handleSavePoints}
                                                        className="p-1 text-green-600 hover:bg-green-50 rounded"
                                                        title="Save"
                                                    >
                                                        ✓
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingPoints({ studentId: null, points: 0 })}
                                                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                                                        title="Cancel"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ) : (
                                                <div
                                                    className="group relative flex items-center justify-center cursor-pointer px-3 py-1.5 rounded-full hover:bg-purple-50 hover:shadow-sm border border-transparent hover:border-purple-200 transition-all duration-200"
                                                    onClick={() => handleEditPoints(student.student)}
                                                    title="Click to edit points"
                                                >
                                                    <p className="text-sm text-gray-700 font-medium flex items-center">
                                                        <span className="mr-1.5 text-yellow-500">⭐</span>
                                                        {student.student?.points || 0} pts
                                                        <span className="ml-2 text-purple-400 group-hover:text-purple-600">✎</span>
                                                    </p>
                                                </div>
                                            )}
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
                                        {student.bySubject?.map((subject) => {
                                            // Safely calculate progress percentage
                                            const progress = subject.progress ??
                                                (subject.completed && subject.assignments ?
                                                    Math.round((subject.completed / subject.assignments) * 100) : 0)

                                            return (
                                                <div key={subject.name}>
                                                    <div className="flex justify-between text-xs mb-1">
                                                        <span className="font-medium text-gray-700">{subject.name}</span>
                                                        <span className="text-gray-600">{formatPercentage(progress)}%</span>
                                                    </div>
                                                    <ProgressBar progress={progress} color={getSubjectColor(subject.name)} height="h-2" />
                                                </div>
                                            )
                                        })}
                                    </div>

                                    {/* Right: Recent Assignments */}
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Recent Assignments:</h4>
                                        <div className="space-y-2">
                                            {student.recentAssignments?.slice(0, 3).map((assignment) => (
                                                <div key={assignment.id} className="flex items-center space-x-2 text-sm">
                                                    <SubjectIcon subject={assignment.subject} className="text-lg" />
                                                    <span className="flex-1 text-gray-700 truncate">{assignment.title}</span>
                                                    <span className={`w-2 h-2 rounded-full ${assignment.status === 'completed' ? 'bg-green-500' : 'bg-gray-300'
                                                        }`}></span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Footer Actions */}
                                <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
                                    <button
                                        onClick={() => setSelectedStudent(student)}
                                        className="inline-flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-sm"
                                    >
                                        <span>View Details</span>
                                        <span>→</span>
                                    </button>
                                </div>
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
                            {/* Full stats */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-lg transform hover:scale-105 transition-transform duration-200">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-purple-100 text-sm font-medium">Total Tasks</p>
                                        <span className="text-2xl opacity-80">📋</span>
                                    </div>
                                    <p className="text-3xl font-bold">{selectedStudent.stats?.total || 0}</p>
                                </div>

                                <div className="p-4 rounded-xl bg-green-50 border border-green-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-green-600 text-sm font-medium">Completed</p>
                                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                            ✓
                                        </div>
                                    </div>
                                    <p className="text-3xl font-bold text-gray-800">{selectedStudent.stats?.completed || 0}</p>
                                </div>

                                <div className="p-4 rounded-xl bg-orange-50 border border-orange-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-orange-600 text-sm font-medium">Pending</p>
                                        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                                            ⏳
                                        </div>
                                    </div>
                                    <p className="text-3xl font-bold text-gray-800">{selectedStudent.stats?.pending || 0}</p>
                                </div>

                                <div className="p-4 rounded-xl bg-purple-50 border border-purple-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-purple-600 text-sm font-medium">Completion Rate</p>
                                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                                            📊
                                        </div>
                                    </div>
                                    <p className="text-3xl font-bold text-gray-800">
                                        {formatPercentage(selectedStudent.stats?.completionRate)}<span className="text-lg text-gray-500 ml-1">%</span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* All assignments */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-4">All Assignments ({selectedStudent.recentAssignments?.length || 0})</h3>
                            <div className="space-y-3">
                                {selectedStudent.recentAssignments?.map((assignment) => (
                                    <div key={assignment.id} className="group border border-gray-100 rounded-xl p-4 hover:border-purple-200 hover:shadow-md transition-all duration-200 bg-white">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                                <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-purple-50 transition-colors">
                                                    <SubjectIcon subject={assignment.subject} className="text-2xl" />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">{assignment.title}</h4>
                                                    <div className="flex items-center text-xs text-gray-500 mt-1 space-x-3">
                                                        <span className="flex items-center text-purple-600 font-medium bg-purple-50 px-2 py-0.5 rounded-full">
                                                            {assignment.subject}
                                                        </span>
                                                        {assignment.due_date && (
                                                            <span className="flex items-center">
                                                                📅 {new Date(assignment.due_date).toLocaleDateString()}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-3">
                                                {assignment.status === 'completed' ? (
                                                    <span className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wide">
                                                        <span>✓</span>
                                                        <span>Done</span>
                                                    </span>
                                                ) : (
                                                    <div className="flex items-center space-x-2">
                                                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium uppercase tracking-wide">
                                                            Pending
                                                        </span>
                                                        <button
                                                            onClick={() => handleUpdateStatus(assignment.studentAssignmentId, 'completed')}
                                                            className="flex items-center space-x-1 px-3 py-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-xs font-semibold border border-green-200"
                                                            title="Mark as Completed"
                                                        >
                                                            <span>✓ Mark Done</span>
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminDashboard
