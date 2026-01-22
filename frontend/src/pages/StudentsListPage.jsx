import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { studentsAPI } from '../api/assignments'
import Header from '../components/Header'
import ProgressBar from '../components/shared/ProgressBar'
import { SubjectIcon } from '../utils/subjectIcons'
import Badge from '../components/shared/Badge'
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment'

const StudentsListPage = () => {
    const { signout } = useAuth()
    const navigate = useNavigate()
    const [students, setStudents] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
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
            setError('Failed to load students')
        } finally {
            setLoading(false)
        }
    }

    const handleSignOut = () => {
        signout()
        navigate('/signin')
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-teal-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                    <p className="mt-4 text-gray-600">Loading students...</p>
                </div>
            </div>
        )
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
                                    className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors flex items-center space-x-2"
                                >
                                    <span>📚</span>
                                    <span>Manage Assignments</span>
                                </Link>
                                <Link
                                    to="/admin/students"
                                    className="px-4 py-2 rounded-lg text-sm font-medium bg-purple-100 text-purple-700 flex items-center space-x-2"
                                >
                                    <span>👥</span>
                                    <span>Students</span>
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
                {/* Page Title */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Student Performance Reports</h2>
                    <p className="text-gray-600 mt-1">Monitor student progress and achievements</p>
                </div>

                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}

                {/* Students Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {students.map((student) => (
                        <div key={student.student.id} className="card bg-white">
                            {/* Student Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center space-x-4">
                                    <div className="w-16 h-16 bg-gradient-purple-teal rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                        {student.student.fullName?.charAt(0) || 'S'}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">{student.student.fullName}</h3>
                                        <Badge variant="reading">{student.student.level || 'FLYERS'} Level</Badge>
                                    </div>
                                </div>
                            </div>

                            {/* Stats Row */}
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="text-center p-3 bg-orange-50 rounded-lg flex flex-col items-center">
                                    <div className="flex items-center space-x-1">
                                        <LocalFireDepartmentIcon className="text-red-600" sx={{ fontSize: 24 }} />
                                        <p className="text-2xl font-bold text-orange-600">5</p>
                                    </div>
                                </div>
                                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                                    <p className="text-2xl font-bold text-yellow-600">⭐ 1850</p>
                                    <p className="text-sm text-gray-600">pts</p>
                                </div>
                            </div>

                            {/* Performance Stats */}
                            <div className="grid grid-cols-3 gap-4 mb-4">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-green-600">{student.stats.completed}</p>
                                    <p className="text-xs text-gray-600">Completed</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-orange-600">{student.stats.pending}</p>
                                    <p className="text-xs text-gray-600">Pending</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-purple-600">{student.stats.completionRate}%</p>
                                    <p className="text-xs text-gray-600">Completion Rate</p>
                                </div>
                            </div>

                            {/* Subject Progress */}
                            <div className="space-y-3 mb-4">
                                {student.bySubject?.map((subject) => (
                                    <div key={subject.name}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="font-medium text-gray-700">{subject.name}</span>
                                            <span className="text-gray-600">{subject.progress}%</span>
                                        </div>
                                        <ProgressBar progress={subject.progress} color="purple" height="h-2" />
                                    </div>
                                ))}
                            </div>

                            {/* Recent Assignments */}
                            <div className="border-t border-gray-200 pt-4">
                                <h4 className="text-sm font-semibold text-gray-900 mb-3">Recent Assignments:</h4>
                                <div className="space-y-2">
                                    {student.recentAssignments?.slice(0, 3).map((assignment) => (
                                        <div key={assignment.id} className="flex items-center space-x-2 text-sm">
                                            <SubjectIcon subject={assignment.subject} className="text-lg" />
                                            <span className="flex-1 text-gray-700">{assignment.title}</span>
                                            <span className={`w-2 h-2 rounded-full ${assignment.status === 'completed' ? 'bg-green-500' : 'bg-gray-300'
                                                }`}></span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* View Details Button */}
                            <button
                                onClick={() => setSelectedStudent(student)}
                                className="w-full mt-4 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium hover:bg-purple-200 transition-colors"
                            >
                                View Details →
                            </button>
                        </div>
                    ))}
                </div>

                {students.length === 0 && !loading && (
                    <div className="text-center py-12">
                        <span className="text-6xl block mb-4">👥</span>
                        <p className="text-gray-600">No students found</p>
                    </div>
                )}
            </div>

            {/* Student Detail Modal */}
            {selectedStudent && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900">{selectedStudent.student.fullName} - Detailed Performance</h2>
                            <button
                                onClick={() => setSelectedStudent(null)}
                                className="text-gray-400 hover:text-gray-600 text-2xl"
                            >
                                ×
                            </button>
                        </div>

                        <div className="px-6 py-6 space-y-6">
                            {/* Full stats and details here */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="card bg-gradient-purple-teal text-white">
                                    <p className="text-sm opacity-90">Total</p>
                                    <p className="text-3xl font-bold">{selectedStudent.stats.total}</p>
                                </div>
                                <div className="card bg-green-50">
                                    <p className="text-sm text-gray-600">Completed</p>
                                    <p className="text-3xl font-bold text-green-600">{selectedStudent.stats.completed}</p>
                                </div>
                                <div className="card bg-orange-50">
                                    <p className="text-sm text-gray-600">Pending</p>
                                    <p className="text-3xl font-bold text-orange-600">{selectedStudent.stats.pending}</p>
                                </div>
                                <div className="card bg-purple-50">
                                    <p className="text-sm text-gray-600">Rate</p>
                                    <p className="text-3xl font-bold text-purple-600">{selectedStudent.stats.completionRate}%</p>
                                </div>
                            </div>

                            {/* All assignments list */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-4">All Assignments</h3>
                                <div className="space-y-3">
                                    {selectedStudent.recentAssignments?.map((assignment) => (
                                        <div key={assignment.id} className="border border-gray-200 rounded-lg p-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">{assignment.title}</h4>
                                                    <p className="text-sm text-gray-600">{assignment.subject}</p>
                                                </div>
                                                <Badge variant={assignment.status === 'completed' ? 'completed' : 'pending'}>
                                                    {assignment.status}
                                                </Badge>
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

export default StudentsListPage
