import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { studentsAPI } from '../api/assignments'
import { RxDashboard } from 'react-icons/rx'
import { MdAssignment } from 'react-icons/md'
import { BsCalendar3 } from 'react-icons/bs'
import { HiOutlineChartBar } from 'react-icons/hi'
import ProgressBar from '../components/shared/ProgressBar'

const StudentDashboard = () => {
    const { user, signout } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const [stats, setStats] = useState({
        total: 0,
        completed: 0,
        pending: 0,
        inProgress: 0,
        completionRate: 0,
        weeklyStreak: 0
    })
    const [assignments, setAssignments] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                console.log('Fetching dashboard data...')
                const response = await studentsAPI.getDashboard()
                const data = response.data
                console.log('Dashboard data:', data)

                setStats({
                    total: data.total || 0,
                    completed: data.completed || 0,
                    pending: data.pending || 0,
                    inProgress: data.in_progress || 0,
                    completionRate: data.completion_rate || 0,
                    weeklyStreak: data.weekly_streak || 0
                })

                // Fetch assignments for recent assignments list
                console.log('Fetching assignments...')
                const assignmentsResponse = await studentsAPI.getAssignments()
                console.log('Assignments response:', assignmentsResponse)
                console.log('Assignments data:', assignmentsResponse.data)
                setAssignments(assignmentsResponse.data || [])
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error)
                console.error('Error details:', error.response?.data)
            } finally {
                setLoading(false)
            }
        }

        if (user) {
            fetchDashboardData()
        }
    }, [user])

    const handleSignOut = () => {
        signout()
        navigate('/signin')
    }

    const navItems = [
        { name: 'Overview', path: '/student/dashboard', icon: <RxDashboard className="w-5 h-5" /> },
        { name: 'Assignments', path: '/student/assignments', icon: <MdAssignment className="w-5 h-5" /> },
        { name: 'Calendar', path: '/student/calendar', icon: <BsCalendar3 className="w-5 h-5" /> },
        { name: 'Progress', path: '/student/progress', icon: <HiOutlineChartBar className="w-5 h-5" /> }
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-teal-50">
            {/* Header with Navigation */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-8">
                            <div className="flex items-center">
                                <div className="w-10 h-10 bg-gradient-purple-teal rounded-lg flex items-center justify-center mr-3">
                                    <span className="text-xl font-bold text-white">LB</span>
                                </div>
                                <h1 className="text-2xl font-bold text-gray-900">Little Buddies</h1>
                            </div>

                            {/* Navigation Menu */}
                            <nav className="hidden md:flex space-x-2">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${location.pathname === item.path
                                            ? 'bg-purple-100 text-purple-700'
                                            : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
                                            }`}
                                    >
                                        <span>{item.icon}</span>
                                        <span>{item.name}</span>
                                    </Link>
                                ))}
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
                <div className="bg-gradient-purple-teal rounded-2xl shadow-xl p-8 mb-8 text-white relative overflow-hidden">
                    <div className="relative z-10 flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-3xl mr-4">
                                {user?.fullName?.charAt(0) || 'S'}
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold mb-1">Welcome back, {user?.fullName}!</h2>
                                <p className="text-purple-100">Keep up the great work!</p>
                            </div>
                        </div>
                        <div className="hidden md:block text-center bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                            <p className="text-sm text-purple-100 mb-1">Current Streak</p>
                            <div className="flex items-center justify-center space-x-2">
                                <span className="text-3xl">🔥</span>
                                <span className="text-4xl font-bold">{stats.weeklyStreak}</span>
                                <span className="text-xl">weeks</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="card">
                        <div className="flex items-center">
                            <div>
                                <p className="text-sm text-gray-600">Total Assignments</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="flex items-center">
                            <div>
                                <p className="text-sm text-gray-600">Completed</p>
                                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="flex items-center">
                            <div>
                                <p className="text-sm text-gray-600">Pending</p>
                                <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="flex items-center">
                            <div>
                                <p className="text-sm text-gray-600">Progress</p>
                                <p className="text-2xl font-bold text-purple-600">{stats.completionRate}%</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Your Performance Section */}
                <div className="card">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Your Performance</h3>

                    {/* User Info Header */}
                    <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
                        <div className="flex items-center space-x-4">
                            <div className="w-14 h-14 bg-gradient-purple-teal rounded-full flex items-center justify-center">
                                <span className="text-2xl font-bold text-white">
                                    {user?.fullName?.charAt(0) || 'U'}
                                </span>
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-gray-900">{user?.fullName || 'Student'}</h4>
                                <p className="text-sm text-gray-600">{user?.level || 'FLYERS'} Level</p>
                                <div className="flex items-center space-x-3 mt-1">
                                    <span className="text-xs text-orange-600 flex items-center">
                                        🔥 {stats.weeklyStreak}-day streak
                                    </span>
                                    <span className="text-xs text-blue-600 flex items-center">
                                        ⭐ {stats.total * 100} pts
                                    </span>
                                </div>
                            </div>
                        </div>
                        <Link
                            to="/student/progress"
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                        >
                            View Details →
                        </Link>
                    </div>

                    {/* Performance Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-green-50 rounded-lg p-4 text-center">
                            <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
                            <p className="text-sm text-gray-600 mt-1">Completed</p>
                        </div>
                        <div className="bg-orange-50 rounded-lg p-4 text-center">
                            <p className="text-3xl font-bold text-orange-600">{stats.pending}</p>
                            <p className="text-sm text-gray-600 mt-1">Pending</p>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-4 text-center">
                            <p className="text-3xl font-bold text-purple-600">{stats.completionRate}%</p>
                            <p className="text-sm text-gray-600 mt-1">Completion Rate</p>
                        </div>
                    </div>

                    {/* Skills Progress */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900 mb-3">Skills Progress</h4>
                        {(() => {
                            // Group assignments by subject and calculate progress
                            const subjectProgress = {}

                            console.log('All assignments for skills:', assignments)

                            assignments.forEach(assignment => {
                                const subject = assignment.subject || 'Other'
                                console.log('Processing assignment:', assignment.title, 'Subject:', subject, 'Status:', assignment.status)
                                if (!subjectProgress[subject]) {
                                    subjectProgress[subject] = { total: 0, completed: 0 }
                                }
                                subjectProgress[subject].total++
                                if (assignment.status === 'completed') {
                                    subjectProgress[subject].completed++
                                }
                            })

                            console.log('Subject progress:', subjectProgress)

                            // Define skills with colors
                            const skillsConfig = [
                                { name: 'Reading', color: 'blue' },
                                { name: 'Writing', color: 'green' },
                                { name: 'Grammar', color: 'green' },
                                { name: 'Listening', color: 'purple' },
                                { name: 'Speaking', color: 'orange' }
                            ]

                            // Map skills to their data (show all skills, even with 0%)
                            const skills = skillsConfig.map(skill => {
                                const data = subjectProgress[skill.name] || { total: 0, completed: 0 }
                                return {
                                    name: skill.name,
                                    value: data.completed,
                                    max: data.total > 0 ? data.total : 1, // Use 1 as max if no assignments
                                    color: skill.color,
                                    hasData: data.total > 0
                                }
                            })

                            console.log('Skills to display:', skills)

                            return skills.map((skill) => {
                                const percentage = skill.hasData ? Math.round((skill.value / skill.max) * 100) : 0
                                const textColorClass = {
                                    'blue': 'text-blue-600',
                                    'green': 'text-green-600',
                                    'purple': 'text-purple-600',
                                    'orange': 'text-orange-600'
                                }[skill.color]

                                return (
                                    <div key={skill.name}>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm font-medium text-gray-700">{skill.name}</span>
                                            <span className={`text-lg font-bold ${textColorClass}`}>
                                                {percentage}%
                                            </span>
                                        </div>
                                        <ProgressBar
                                            value={skill.value}
                                            max={skill.max}
                                            color={skill.color}
                                            height="h-2"
                                            showLabel={false}
                                        />
                                    </div>
                                )
                            })
                        })()}
                    </div>

                    {/* Recent Assignments */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <h4 className="font-semibold text-gray-900 mb-3">Recent Assignments:</h4>
                        <div className="space-y-2">
                            {assignments.slice(0, 3).map((assignment, index) => (
                                <div key={assignment.id} className="flex items-center space-x-2 text-sm text-gray-600">
                                    <span className="text-blue-600">📘</span>
                                    <span className="flex-1 truncate">{assignment.title}</span>
                                </div>
                            ))}
                            {assignments.length === 0 && (
                                <p className="text-sm text-gray-500 italic">No assignments yet</p>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default StudentDashboard
